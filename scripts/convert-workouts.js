#!/usr/bin/env node

/**
 * Converts workout CSV files to JSON format
 *
 * CSV format: movement,intervals,work,rest,Time,Group,Type
 *
 * Movement notation:
 * - Single: "8CBB", "OGBRP"
 * - With rep target: "OGBRP (8)", "FLSQ (2-3)"
 * - Combo (+): "OGBRP + FLSQ" - split into separate blocks, alternating
 * - Sequence (>): "FLSQ (2) > OGBRP" - both in single work phase
 * - Choice (/): "JLNG/LNG" - user picks either movement
 * - Smoker: "PL > OGBRP" with Type=SM - no true rest, hold position
 *
 * Columns:
 * - REST rows have intervals=1, empty work, and rest duration
 * - Time column is ignored (calculated by script)
 * - Group column tags blocks for collapsing into "rounds" in preview
 * - Type column: SM=smoker (no rest, always red), empty=standard
 * - Orphan total row at bottom (just a number) is ignored
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
  // Bodybuilders
  '8CBB': '8-COUNT BODYBUILDERS',
  '6CBB': '6-COUNT BODYBUILDERS',
  // Squats
  'JSQ': 'JUMP SQUATS',
  'FLSQ': 'FLYING SQUATS',
  'STPSQ': 'STOP SQUATS',
  // Burpees
  'OGBRP': 'BURPEES',           // Original Burpee (no push-up, continuous)
  'PUBRP': 'PUSH-UP BURPEES',   // Push-up Burpee (with push-up, isolated)
  'BRP': 'BURPEES',             // Legacy alias
  // Upper body
  'PU': 'PUSH-UPS',
  'TH': 'THRUSTERS',
  'ZPR': 'ZIPPERS',
  // Core / Cardio
  'MC': 'MOUNTAIN CLIMBERS',
  'PL': 'PLANK',
  'JJ': 'JUMPING JACKS',
  'JK': 'JACKS',
  'HK': 'HIGH KNEES',
  // Lunges
  'LNG': 'LUNGES',
  'JLNG': 'JUMP LUNGES',
  // Special
  'REST': 'REST',
};

/**
 * Parse rep target from movement string
 * "OGBRP (8)" → { code: "OGBRP", repTarget: "8" }
 * "FLSQ (2-3)" → { code: "FLSQ", repTarget: "2-3" }
 * "OGBRP" → { code: "OGBRP", repTarget: null }
 */
function parseMovementWithTarget(movementStr) {
  const match = movementStr.match(/^([A-Z0-9]+)\s*\((\d+(?:-\d+)?)\)$/i);
  if (match) {
    return {
      code: match[1].toUpperCase(),
      repTarget: match[2], // Keep as string to preserve ranges like "8-12"
    };
  }
  return {
    code: movementStr.toUpperCase(),
    repTarget: null,
  };
}

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
    // Format: movement,intervals,work,rest,Time,Group,Type
    const parts = line.split(',');
    const movement = (parts[0] || '').trim();
    const intervals = parts[1] ? parts[1].trim() : '';
    const work = parts[2] ? parts[2].trim() : '';
    const rest = parts[3] ? parts[3].trim() : '';
    // parts[4] = Time (ignored, calculated)
    const group = parts[5] ? parts[5].trim() : '';
    const type = parts[6] ? parts[6].trim().toUpperCase() : '';

    // Skip empty lines and orphan total rows (just a number in Time column)
    if (!movement) continue;
    // Skip if movement is just a number (orphan total row)
    if (!isNaN(parseFloat(movement)) && movement.trim().match(/^[\d.]+$/)) continue;

    // Check if this is a REST row
    if (movement.toUpperCase() === 'REST') {
      const restBlock = {
        id: `rest-${blockIndex}`,
        movement: 'REST',
        displayName: MOVEMENTS.REST,
        intervals: parseInt(intervals, 10) || 1,
        workDuration: 0,
        restDuration: parseInt(rest, 10) || 30,
        isTransition: true,
      };
      if (group) restBlock.group = group;
      blocks.push(restBlock);
      blockIndex++;
      continue;
    }

    const workDuration = parseInt(work, 10) || 0;
    const restDuration = parseInt(rest, 10) || 0;
    const intervalCount = parseInt(intervals, 10) || 1;

    // Check if this is a SMOKER (Type = SM) with sequence notation
    if (type === 'SM' && movement.includes('>')) {
      const movementParts = movement.split('>').map(m => m.trim());
      const holdPart = parseMovementWithTarget(movementParts[0]);
      const workPart = parseMovementWithTarget(movementParts[1]);

      const block = {
        id: `smoker-${blockIndex}`,
        movement: `${holdPart.code}>${workPart.code}`,
        displayName: `${MOVEMENTS[workPart.code] || workPart.code}`,
        intervals: intervalCount,
        workDuration,
        restDuration, // This is the hold duration in smoker context
        type: 'SM',
        isSmoker: true,
        holdMovement: {
          code: holdPart.code,
          displayName: MOVEMENTS[holdPart.code] || holdPart.code,
        },
        workMovement: {
          code: workPart.code,
          displayName: MOVEMENTS[workPart.code] || workPart.code,
          repTarget: workPart.repTarget,
        },
      };
      if (group) block.group = group;
      if (holdPart.repTarget) block.holdMovement.repTarget = holdPart.repTarget;
      blocks.push(block);
      blockIndex++;
      continue;
    }

    // Check if this is a SEQUENCE (>) - multiple movements in one work phase
    if (movement.includes('>')) {
      const movementParts = movement.split('>').map(m => m.trim());
      const sequence = movementParts.map(part => {
        const parsed = parseMovementWithTarget(part);
        return {
          code: parsed.code,
          displayName: MOVEMENTS[parsed.code] || parsed.code,
          repTarget: parsed.repTarget,
        };
      });

      // Create display name from sequence
      const displayName = sequence.map(s => s.displayName).join(' → ');

      const block = {
        id: `seq-${blockIndex}`,
        movement: sequence.map(s => s.code).join('>'),
        displayName,
        intervals: intervalCount,
        workDuration,
        restDuration,
        isSequence: true,
        sequence,
      };
      if (group) block.group = group;
      if (type) block.type = type;
      blocks.push(block);
      blockIndex++;
      continue;
    }

    // Check if this is a CHOICE movement (e.g., "JLNG/LNG" = either one)
    if (movement.includes('/')) {
      const movementParts = movement.split('/').map(m => m.trim());
      const choices = movementParts.map(part => {
        const parsed = parseMovementWithTarget(part);
        return {
          code: parsed.code,
          displayName: MOVEMENTS[parsed.code] || parsed.code,
          repTarget: parsed.repTarget,
        };
      });

      // Create display name with "/" separator
      const displayName = choices.map(c => c.displayName).join(' / ');

      const block = {
        id: `choice-${blockIndex}`,
        movement: choices.map(c => c.code).join('/'),
        displayName,
        intervals: intervalCount,
        workDuration,
        restDuration,
        isChoice: true,
        choices,
      };
      if (group) block.group = group;
      if (type) block.type = type;
      // If any choice has a rep target, use the first one found
      const repTarget = choices.find(c => c.repTarget)?.repTarget;
      if (repTarget) block.repTarget = repTarget;
      blocks.push(block);
      blockIndex++;
      continue;
    }

    // Check if this is a COMBO movement (e.g., "OGBRP + FLSQ" or "JSQ + OGBRP + JLNG")
    // Creates cycling 1-interval blocks: A, B, C, A, B, C, A, B, C...
    if (movement.includes('+')) {
      const movementParts = movement.split('+').map(m => m.trim());
      const numMovements = movementParts.length;
      const totalIntervals = intervalCount || numMovements;
      const cycles = Math.floor(totalIntervals / numMovements);

      // Parse all movements upfront
      const parsedMovements = movementParts.map(part => parseMovementWithTarget(part));

      // Create cycling blocks: A, B, C, A, B, C... for the total number of intervals
      for (let i = 0; i < totalIntervals; i++) {
        const movementIndex = i % numMovements;
        const parsed = parsedMovements[movementIndex];
        const block = {
          id: `${parsed.code.toLowerCase()}-${blockIndex}`,
          movement: parsed.code,
          displayName: MOVEMENTS[parsed.code] || parsed.code,
          intervals: 1, // Each block is 1 interval
          workDuration,
          restDuration,
        };
        if (group) block.group = group;
        if (type) block.type = type;
        if (parsed.repTarget) block.repTarget = parsed.repTarget;
        blocks.push(block);
        blockIndex++;
      }
      continue;
    }

    // Regular movement row (possibly with rep target)
    const parsed = parseMovementWithTarget(movement);
    const block = {
      id: `${parsed.code.toLowerCase()}-${blockIndex}`,
      movement: parsed.code,
      displayName: MOVEMENTS[parsed.code] || parsed.code,
      intervals: intervalCount,
      workDuration,
      restDuration,
    };
    if (group) block.group = group;
    if (type) block.type = type;
    if (parsed.repTarget) block.repTarget = parsed.repTarget;
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
