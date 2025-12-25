#!/usr/bin/env node

/**
 * Converts workout CSV files to JSON format
 *
 * CSV format: movement,intervals,work,rest,Time,Group
 * - REST rows have empty intervals/work, only rest value
 * - Combo movements like "BRP + FLSQ" get split into separate blocks
 * - Time column is ignored (calculated)
 * - Group column tags blocks for collapsing into "rounds" in preview
 *
 * Output: assets/workouts/level-1.json
 */

const fs = require('fs');
const path = require('path');

const CSV_DIR = path.join(__dirname, '..', 'workouts', 'csv');
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'workouts');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'level-1.json');

// Movement display names
const MOVEMENTS = {
  '8CBB': '8-COUNT BODYBUILDERS',
  'JSQ': 'JUMP SQUATS',
  'BRP': 'BURPEES',
  'FLSQ': 'FLYING SQUATS',
  'PU': 'PUSH-UPS',
  'MC': 'MOUNTAIN CLIMBERS',
  'LNG': 'LUNGES',
  'JLNG': 'JUMP LUNGES',
  'HK': 'HIGH KNEES',
  'REST': 'REST',
};

/**
 * Parse a single CSV file into a WorkoutProgram
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');

  // Skip header row
  const dataLines = lines.slice(1);

  // Extract week and day from filename (e.g., "week1-day1.csv")
  const filename = path.basename(filePath, '.csv');
  const match = filename.match(/week(\d+)-day(\d+)/i);
  const week = match ? parseInt(match[1], 10) : 1;
  const day = match ? parseInt(match[2], 10) : 1;

  const blocks = [];
  let blockIndex = 0;

  for (const line of dataLines) {
    if (!line.trim()) continue;

    // Split by comma, handling empty values
    // Format: movement,intervals,work,rest,Time,Group
    const parts = line.split(',');
    const movement = (parts[0] || '').trim();
    const intervals = parts[1] ? parts[1].trim() : '';
    const work = parts[2] ? parts[2].trim() : '';
    const rest = parts[3] ? parts[3].trim() : '';
    // parts[4] = Time (ignored, calculated)
    const group = parts[5] ? parts[5].trim() : '';

    if (!movement) continue;

    // Check if this is a REST row (empty intervals and work)
    if (movement.toUpperCase() === 'REST') {
      const restBlock = {
        id: `rest-${blockIndex}`,
        movement: 'REST',
        displayName: MOVEMENTS.REST,
        intervals: 1,
        workDuration: 0,
        restDuration: parseInt(rest, 10) || 30,
        isTransition: true,
      };
      // Add group if specified (for REST between rounds)
      if (group) {
        restBlock.group = group;
      }
      blocks.push(restBlock);
      blockIndex++;
      continue;
    }

    // Check if this is a combo movement (e.g., "BRP + FLSQ")
    if (movement.includes('+')) {
      const movementCodes = movement.split('+').map(m => m.trim().toUpperCase());
      const totalIntervals = parseInt(intervals, 10) || movementCodes.length;
      const intervalsPerMovement = Math.floor(totalIntervals / movementCodes.length);
      const workDuration = parseInt(work, 10) || 20;
      const restDuration = parseInt(rest, 10) || 10;

      // Create a block for each movement in the combo
      for (const code of movementCodes) {
        const block = {
          id: `${code.toLowerCase()}-${blockIndex}`,
          movement: code,
          displayName: MOVEMENTS[code] || code,
          intervals: intervalsPerMovement,
          workDuration,
          restDuration,
        };
        if (group) {
          block.group = group;
        }
        blocks.push(block);
        blockIndex++;
      }
      continue;
    }

    // Regular movement row
    const movementCode = movement.toUpperCase();
    const block = {
      id: `${movementCode.toLowerCase()}-${blockIndex}`,
      movement: movementCode,
      displayName: MOVEMENTS[movementCode] || movementCode,
      intervals: parseInt(intervals, 10) || 1,
      workDuration: parseInt(work, 10) || 0,
      restDuration: parseInt(rest, 10) || 0,
    };
    if (group) {
      block.group = group;
    }
    blocks.push(block);
    blockIndex++;
  }

  return {
    id: `week${week}-day${day}`,
    name: generateWorkoutName(week, day),
    week,
    day,
    blocks,
  };
}

/**
 * Generate a workout name based on week and day
 */
function generateWorkoutName(week, day) {
  const names = {
    '1-1': 'Foundation',
    '1-2': 'Build',
    '1-3': 'Push',
    '1-4': 'Fortify',
    '2-1': 'Elevation',
    '2-2': 'Momentum',
    '2-3': 'Breakthrough',
    '2-4': 'Summit',
  };
  return names[`${week}-${day}`] || `Week ${week} Day ${day}`;
}

/**
 * Main conversion function
 */
function convert() {
  console.log('🔄 Converting workout CSVs...');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created ${OUTPUT_DIR}`);
  }

  // Check if CSV directory exists
  if (!fs.existsSync(CSV_DIR)) {
    console.error(`❌ CSV directory not found: ${CSV_DIR}`);
    process.exit(1);
  }

  // Get all CSV files
  const csvFiles = fs.readdirSync(CSV_DIR)
    .filter(f => f.endsWith('.csv'))
    .sort();

  if (csvFiles.length === 0) {
    console.error('❌ No CSV files found in', CSV_DIR);
    process.exit(1);
  }

  console.log(`📄 Found ${csvFiles.length} CSV file(s)`);

  // Parse all workouts
  const workouts = csvFiles.map(file => {
    const filePath = path.join(CSV_DIR, file);
    console.log(`  - Parsing ${file}`);
    return parseCSV(filePath);
  });

  // Calculate stats for each workout
  const workoutsWithStats = workouts.map(workout => ({
    ...workout,
    totalDuration: calculateDuration(workout),
    movementCount: countMovements(workout),
  }));

  // Write output
  const output = {
    version: 1,
    level: 1,
    generatedAt: new Date().toISOString(),
    workouts: workoutsWithStats,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✅ Written ${OUTPUT_FILE}`);
  console.log(`   ${workouts.length} workout(s) converted`);

  // Print summary
  workoutsWithStats.forEach(w => {
    const mins = Math.floor(w.totalDuration / 60);
    const secs = w.totalDuration % 60;
    const groupCount = countGroups(w);
    const groupInfo = groupCount > 0 ? `, ${groupCount} round group(s)` : '';
    console.log(`   - ${w.name} (W${w.week}D${w.day}): ${mins}:${secs.toString().padStart(2, '0')}, ${w.movementCount} movements${groupInfo}`);
  });
}

/**
 * Calculate total workout duration in seconds
 */
function calculateDuration(workout) {
  return workout.blocks.reduce((total, block) => {
    if (block.isTransition) {
      return total + block.restDuration;
    }
    return total + (block.workDuration + block.restDuration) * block.intervals;
  }, 0);
}

/**
 * Count unique movements (excluding REST)
 */
function countMovements(workout) {
  const movements = new Set();
  workout.blocks.forEach(block => {
    if (!block.isTransition) {
      movements.add(block.movement);
    }
  });
  return movements.size;
}

/**
 * Count unique groups in workout
 */
function countGroups(workout) {
  const groups = new Set();
  workout.blocks.forEach(block => {
    if (block.group) {
      groups.add(block.group);
    }
  });
  return groups.size;
}

// Run
convert();
