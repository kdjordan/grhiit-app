import { View, Text, Pressable, ScrollView, LayoutAnimation, Platform, UIManager } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useUserStore } from "@/stores/userStore";
import { useDevStore, isDevWorkoutSelectEnabled } from "@/stores/devStore";
import {
  getWorkoutById,
  getWorkoutByNumber,
  calculateWorkoutDuration,
  formatDuration,
  getUniqueMovements,
} from "@/lib/workoutLoader";
import { WorkoutBlock, WorkoutProgram } from "@/types";
import { sizing, scale, moderateScale } from "@/lib/responsive";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Types for grouped display
type DisplayItem =
  | { type: "block"; block: WorkoutBlock; restAfter?: number; section?: string }
  | { type: "rounds"; rounds: number; pattern: string; timing: string; restBetween: number; totalDuration: number; restAfter?: number; section?: string };

type WorkoutSection = "RAMP-UP" | "SUMMIT" | "RUN-OUT";

interface SectionGroup {
  section: WorkoutSection;
  items: DisplayItem[];
  totalDuration: number;
}

/**
 * Generate a tagline for the workout
 */
function generateTagline(name: string, week: number): string {
  const taglines: Record<string, string> = {
    "Foundation": "Learn the rhythm",
    "Build": "Establish the pattern",
    "Push": "Find your edge",
    "Fortify": "Solidify the base",
    "Endure": "Build your capacity",
    "Surge": "Increase the tempo",
    "Peak": "Maximum intensity",
    "Finish": "Complete the journey",
  };

  if (taglines[name]) {
    return taglines[name];
  }

  // Week-based fallbacks
  const weekDescriptors: Record<number, string> = {
    1: "Building your foundation",
    2: "Developing consistency",
    3: "Increasing intensity",
    4: "Testing your limits",
    5: "Breaking through plateaus",
    6: "Refining your technique",
    7: "Peak performance",
    8: "Final push",
  };

  return weekDescriptors[week] || "Push your limits";
}

/**
 * Groups consecutive blocks with same group tag into "rounds" display items
 * Attaches restAfter to items instead of creating separate REST entries
 */
function groupBlocksForDisplay(blocks: WorkoutBlock[]): DisplayItem[] {
  const items: DisplayItem[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // If block has a group, collect all consecutive blocks with same group
    if (block.group && !block.isTransition) {
      const groupName = block.group;
      const groupedBlocks: WorkoutBlock[] = [];
      const restDurations: number[] = [];
      let j = i;

      // Collect all blocks and rests in this group
      while (j < blocks.length) {
        const current = blocks[j];

        if (current.group === groupName && !current.isTransition) {
          groupedBlocks.push(current);
          j++;
        } else if (current.isTransition && j > i) {
          // Check if next non-rest block is still in same group
          const nextNonRest = blocks.slice(j + 1).find(b => !b.isTransition);
          if (nextNonRest?.group === groupName) {
            restDurations.push(current.restDuration);
            j++;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      // Count rounds and get pattern
      const firstBlock = groupedBlocks[0];
      const pattern = getPatternFromBlocks(groupedBlocks);
      const roundCount = countRoundsFromBlocks(groupedBlocks);
      const hasComboMetadata = groupedBlocks.some(b => b.comboGroup);

      // For single-movement blocks with only 1 round, display as regular block
      // (not as "1 ROUNDS" which is confusing)
      if (groupedBlocks.length === 1 && roundCount === 1 && !hasComboMetadata) {
        // Check if there's a REST after this block
        let restAfter: number | undefined;
        if (j < blocks.length && blocks[j].isTransition) {
          restAfter = blocks[j].restDuration;
          j++; // Skip the rest block
        }
        items.push({ type: "block", block: firstBlock, restAfter, section: firstBlock.section });
        i = j;
        continue;
      }

      // Calculate intervals per round
      // For combo blocks (comboGroup): count blocks in first comboGroup
      // For single-movement blocks: use block's intervals property
      let intervalsPerRound: number;
      if (hasComboMetadata) {
        const firstComboGroup = groupedBlocks.find(b => b.comboGroup)?.comboGroup;
        intervalsPerRound = groupedBlocks.filter(b => b.comboGroup === firstComboGroup).length;
      } else if (groupedBlocks.length === 1 && firstBlock.intervals > 1) {
        // Single-movement block with multiple intervals (e.g., SQTH with intervals: 2)
        intervalsPerRound = firstBlock.intervals;
      } else {
        // Fallback: pattern length
        intervalsPerRound = pattern.split(" + ").length;
      }

      // Calculate total duration
      const totalDuration = groupedBlocks.reduce((sum, b) =>
        sum + (b.workDuration + b.restDuration) * b.intervals, 0
      ) + restDurations.reduce((sum, r) => sum + r, 0);

      // Check if there's a REST after this group
      let restAfter: number | undefined;
      if (j < blocks.length && blocks[j].isTransition) {
        restAfter = blocks[j].restDuration;
        j++; // Skip the rest block
      }

      items.push({
        type: "rounds",
        rounds: roundCount,
        pattern: pattern,
        timing: `${intervalsPerRound} × (${firstBlock.workDuration}s/${firstBlock.restDuration}s)`,
        restBetween: restDurations[0] || 30,
        totalDuration,
        restAfter,
        section: firstBlock.section,
      });

      i = j;
      continue;
    }

    // Regular block (skip REST transitions - attach to previous item)
    if (block.isTransition) {
      // Attach rest to previous item
      if (items.length > 0) {
        items[items.length - 1].restAfter = block.restDuration;
      }
      i++;
      continue;
    }

    items.push({ type: "block", block, section: block.section });
    i++;
  }

  return items;
}

/**
 * Calculate duration for a display item
 */
function getItemDuration(item: DisplayItem): number {
  if (item.type === "rounds") {
    return item.totalDuration + (item.restAfter || 0);
  }
  if (item.type === "block") {
    const blockDur = (item.block.workDuration + item.block.restDuration) * item.block.intervals;
    return blockDur + (item.restAfter || 0);
  }
  return 0;
}

/**
 * Map section code to display name
 */
function mapSectionName(section: string | undefined): WorkoutSection {
  switch (section?.toUpperCase()) {
    case "RAMP": return "RAMP-UP";
    case "SUMMIT": return "SUMMIT";
    case "RUNOUT": return "RUN-OUT";
    default: return "RAMP-UP"; // Default to ramp-up if no section specified
  }
}

/**
 * Group display items by their explicit section property
 */
function detectSections(items: DisplayItem[]): SectionGroup[] {
  const sectionOrder: WorkoutSection[] = ["RAMP-UP", "SUMMIT", "RUN-OUT"];
  const sectionMap = new Map<WorkoutSection, DisplayItem[]>();

  // Initialize empty arrays for each section
  sectionOrder.forEach(s => sectionMap.set(s, []));

  // Group items by section
  for (const item of items) {
    const sectionName = mapSectionName(item.section);
    sectionMap.get(sectionName)?.push(item);
  }

  // Build section groups (only include non-empty sections)
  const sections: SectionGroup[] = [];
  for (const sectionName of sectionOrder) {
    const sectionItems = sectionMap.get(sectionName) || [];
    if (sectionItems.length > 0) {
      const totalDuration = sectionItems.reduce((sum, item) => sum + getItemDuration(item), 0);
      sections.push({ section: sectionName, items: sectionItems, totalDuration });
    }
  }

  // Fallback: if no sections found, put everything in RAMP-UP
  if (sections.length === 0 && items.length > 0) {
    const totalDuration = items.reduce((sum, item) => sum + getItemDuration(item), 0);
    return [{ section: "RAMP-UP", items, totalDuration }];
  }

  return sections;
}

/**
 * Extract movement pattern from grouped blocks
 * Always shows clean display names: "SQUAT THRUST + FLYING SQUATS"
 * No bracket notation, no rep targets in preview
 */
function getPatternFromBlocks(blocks: WorkoutBlock[]): string {
  // Check if these blocks have combo metadata
  const hasComboMetadata = blocks.some(b => b.comboGroup);

  if (hasComboMetadata) {
    // Group blocks by comboGroup to find one representative combo
    const firstComboGroup = blocks.find(b => b.comboGroup)?.comboGroup;
    const comboBlocks = blocks.filter(b => b.comboGroup === firstComboGroup);

    // Build pattern from display names in order (preserving sequence like SQTH + FLSQ + SQTH)
    const pattern = comboBlocks.map(b => b.displayName).join(" + ");
    return pattern;
  }

  // Fallback: display names from all blocks
  return blocks.map(b => b.displayName).join(" + ");
}

/**
 * Count rounds from grouped blocks
 * For bracket notation: count unique comboGroups
 * For regular: count based on unique movements per round
 */
function countRoundsFromBlocks(blocks: WorkoutBlock[]): number {
  // Check if these blocks have combo metadata (bracket notation)
  const comboGroups = new Set(blocks.filter(b => b.comboGroup).map(b => b.comboGroup));

  if (comboGroups.size > 0) {
    // Each unique comboGroup is one round
    return comboGroups.size;
  }

  // Fallback: count unique movements, assume that's one round pattern
  const uniqueMovements = new Set(blocks.map(b => b.movement));
  return Math.ceil(blocks.length / uniqueMovements.size);
}

export default function WorkoutPreviewScreen() {
  const { setWorkout } = useWorkoutStore();
  const { getCurrentWorkoutNumber } = useUserStore();
  const { selectedWorkoutId, clearSelection } = useDevStore();
  const isDevMode = isDevWorkoutSelectEnabled();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get workout from JSON
  const workout = useMemo((): WorkoutProgram | null => {
    if (isDevMode && selectedWorkoutId) {
      return getWorkoutById(selectedWorkoutId);
    }
    return getWorkoutByNumber(getCurrentWorkoutNumber());
  }, [selectedWorkoutId, isDevMode]);

  // Load workout into store on mount
  useEffect(() => {
    if (workout) {
      setWorkout(workout);
    }
  }, [workout]);

  // Clear dev selection when leaving
  useEffect(() => {
    return () => {
      if (isDevMode) {
        clearSelection();
      }
    };
  }, [isDevMode]);

  // Toggle expand/collapse with animation
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  // Handle no workout found
  if (!workout) {
    return (
      <SafeAreaView style={tw`flex-1 bg-grhiit-black items-center justify-center`}>
        <Text style={tw`text-white text-lg mb-4`}>Workout not found</Text>
        <Pressable
          style={tw`bg-[#262626] px-6 py-3 rounded-xl`}
          onPress={() => router.back()}
        >
          <Text style={tw`text-white`}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const totalDuration = calculateWorkoutDuration(workout);
  const uniqueMovements = getUniqueMovements(workout);
  const exerciseBlocks = workout.blocks.filter((b) => !b.isTransition);
  const totalIntervals = exerciseBlocks.reduce((sum, b) => sum + b.intervals, 0);
  const tagline = generateTagline(workout.name, workout.week);

  // Group blocks for display
  const displayItems = useMemo(
    () => groupBlocksForDisplay(workout.blocks),
    [workout]
  );

  // Detect sections
  const sections = useMemo(
    () => detectSections(displayItems),
    [displayItems]
  );

  const handleStart = () => {
    router.push("/workout/active");
  };

  // Dev shortcut to skip to complete screen
  const handleDevSkipToComplete = () => {
    // Simulate elapsed time as the total workout duration
    const totalDuration = calculateWorkoutDuration(workout);
    useWorkoutStore.setState({
      elapsedTime: totalDuration,
      workout: workout, // Ensure workout is set
    });
    router.push("/workout/complete");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-32`}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={tw`px-5 pt-4`}>
          <Pressable
            onPress={() => router.back()}
            style={tw`flex-row items-center mb-6`}
          >
            <Feather name="arrow-left" size={20} color="#6B7280" />
            <Text style={tw`text-gray-500 ml-2`}>Back</Text>
          </Pressable>

          {/* Dev mode indicator + shortcuts */}
          {isDevMode && (
            <View style={tw`flex-row items-center gap-2 mb-4`}>
              {selectedWorkoutId && (
                <View style={tw`bg-[#22C55E]/20 px-3 py-1.5 rounded-lg`}>
                  <Text style={[tw`text-[#22C55E] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                    DEV: {workout.id}
                  </Text>
                </View>
              )}
              <Pressable
                onPress={handleDevSkipToComplete}
                style={tw`bg-[#F59E0B]/20 px-3 py-1.5 rounded-lg`}
              >
                <Text style={[tw`text-[#F59E0B] text-xs`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
                  SKIP → COMPLETE
                </Text>
              </Pressable>
            </View>
          )}

          {/* Workout Title + Tagline */}
          <Text style={[tw`text-white/50 mb-1`, { fontSize: sizing.caption, letterSpacing: 1.5 }]}>
            WEEK {workout.week} • DAY {workout.day}
          </Text>
          <Text
            style={[
              tw`text-white font-bold`,
              { fontFamily: "ChakraPetch_700Bold", fontSize: sizing.headerLarge },
            ]}
          >
            {workout.name}
          </Text>
          <Text
            style={[
              tw`text-white/40 mt-1 mb-6`,
              { fontFamily: "SpaceGrotesk_400Regular", fontStyle: "italic", fontSize: sizing.bodyLarge },
            ]}
          >
            {tagline}
          </Text>

          {/* Stats Row */}
          <View style={tw`flex-row items-center gap-4 mb-6`}>
            <View style={tw`flex-row items-center`}>
              <Feather name="clock" size={scale(14)} color="#6B7280" />
              <Text style={[tw`text-gray-500 ml-1`, { fontSize: sizing.bodySmall }]}>
                {formatDuration(totalDuration)}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Feather name="repeat" size={scale(14)} color="#6B7280" />
              <Text style={[tw`text-gray-500 ml-1`, { fontSize: sizing.bodySmall }]}>
                {totalIntervals} intervals
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Feather name="activity" size={scale(14)} color="#6B7280" />
              <Text style={[tw`text-gray-500 ml-1`, { fontSize: sizing.bodySmall }]}>
                {uniqueMovements.length} movements
              </Text>
            </View>
          </View>

          {/* Video Preview */}
          <VideoPreview week={workout.week} day={workout.day} />

          {/* Expand/Collapse Button */}
          <Pressable
            onPress={toggleExpanded}
            style={tw`flex-row items-center justify-center py-3 border border-[#333] rounded-xl`}
          >
            <Text
              style={[
                tw`text-white/60 text-sm mr-2`,
                { fontFamily: "SpaceGrotesk_500Medium" },
              ]}
            >
              {isExpanded ? "HIDE BREAKDOWN" : "VIEW BREAKDOWN"}
            </Text>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color="#9CA3AF"
            />
          </Pressable>
        </View>

        {/* Expanded Breakdown */}
        {isExpanded && (
          <View style={tw`px-5`}>
            {sections.map((section, sectionIdx) => {
              const isSummit = section.section === "SUMMIT";
              return (
                <View key={section.section} style={tw`mb-4`}>
                  {/* Section Header */}
                  <SectionHeader
                    section={section.section}
                    duration={section.totalDuration}
                  />

                  {/* Section Items - SUMMIT gets a wrapping bento */}
                  {isSummit ? (
                    <View
                      style={{
                        padding: 12,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "rgba(239, 68, 68, 0.25)",
                      }}
                    >
                      {section.items.map((item, itemIdx) => (
                        <DisplayRow
                          key={`${sectionIdx}-${itemIdx}`}
                          item={item}
                          isLast={itemIdx === section.items.length - 1}
                        />
                      ))}
                    </View>
                  ) : (
                    section.items.map((item, itemIdx) => (
                      <DisplayRow
                        key={`${sectionIdx}-${itemIdx}`}
                        item={item}
                        isLast={itemIdx === section.items.length - 1}
                      />
                    ))
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[tw`absolute bottom-0 left-0 right-0 pt-4 bg-grhiit-black`, { paddingHorizontal: sizing.paddingHorizontal, paddingBottom: scale(32) }]}>
        <Pressable
          style={[
            tw`bg-grhiit-red flex-row items-center justify-center`,
            {
              borderRadius: scale(16),
              shadowColor: "#EF4444",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              paddingVertical: scale(16),
            },
          ]}
          onPress={handleStart}
        >
          <Text
            style={[
              tw`text-white font-bold`,
              { fontFamily: "SpaceGrotesk_700Bold", fontSize: sizing.bodyLarge, letterSpacing: 0.5 },
            ]}
          >
            LET'S GO
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Video preview component - placeholder until videos are added
// TODO: Replace with expo-video when videos are ready
function VideoPreview({ week, day }: { week: number; day: number }) {
  return (
    <View style={tw`mb-4`}>
      <Text
        style={[
          tw`text-white/40 text-xs tracking-widest mb-3`,
          { fontFamily: "SpaceGrotesk_500Medium" },
        ]}
      >
        SESSION WALKTHROUGH
      </Text>

      <View
        style={[
          tw`bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#262626]`,
          { aspectRatio: 16 / 9 },
        ]}
      >
        {/* Placeholder state - no video configured yet */}
        <View style={tw`flex-1 items-center justify-center bg-[#141414]`}>
          <View
            style={[
              tw`bg-[#262626] items-center justify-center mb-3`,
              { width: 64, height: 64, borderRadius: 32 },
            ]}
          >
            <Feather name="video" size={28} color="#6B7280" />
          </View>
          <Text
            style={[
              tw`text-white/60 text-sm mb-1`,
              { fontFamily: "SpaceGrotesk_600SemiBold" },
            ]}
          >
            Week {week} • Day {day}
          </Text>
          <Text
            style={[
              tw`text-white/30 text-xs`,
              { fontFamily: "SpaceGrotesk_400Regular" },
            ]}
          >
            Video coming soon
          </Text>
        </View>
      </View>
    </View>
  );
}

// Section header component
function SectionHeader({ section, duration }: { section: WorkoutSection; duration: number }) {
  const isSummit = section === "SUMMIT";

  const icons: Record<WorkoutSection, string> = {
    "RAMP-UP": "trending-up",
    "SUMMIT": "zap",
    "RUN-OUT": "chevrons-right",
  };

  return (
    <View
      style={[
        tw`flex-row items-center justify-between py-2 mb-2 border-b`,
        isSummit ? tw`border-grhiit-red/30` : tw`border-[#333]`,
      ]}
    >
      <View style={tw`flex-row items-center`}>
        <Feather
          name={icons[section] as any}
          size={14}
          color={isSummit ? "#EF4444" : "#6B7280"}
        />
        <Text
          style={[
            tw`text-xs ml-2 tracking-widest`,
            isSummit ? tw`text-grhiit-red` : tw`text-white/50`,
            { fontFamily: "SpaceGrotesk_600SemiBold" },
          ]}
        >
          {section}
        </Text>
      </View>
      <Text
        style={[
          tw`text-xs`,
          isSummit ? tw`text-grhiit-red/70` : tw`text-white/30`,
          { fontFamily: "SpaceGrotesk_500Medium" },
        ]}
      >
        {formatDuration(duration)}
      </Text>
    </View>
  );
}

// Display row component with inline rest
function DisplayRow({ item, isLast }: { item: DisplayItem; isLast: boolean }) {
  if (item.type === "rounds") {
    return (
      <View style={tw`mb-2`}>
        <View
          style={tw`bg-[#1a1a1a] rounded-xl py-3 px-4 border border-grhiit-red/20`}
        >
          <View style={tw`flex-row items-center justify-between mb-1`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`bg-grhiit-red/20 px-2 py-0.5 rounded mr-2`}>
                <Text style={[tw`text-grhiit-red text-xs`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                  {item.rounds} ROUNDS
                </Text>
              </View>
            </View>
            <Text
              style={[
                tw`text-white/40 text-sm`,
                { fontFamily: "SpaceGrotesk_500Medium" },
              ]}
            >
              {formatDuration(item.totalDuration)}
            </Text>
          </View>
          <Text style={[tw`text-white text-sm`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
            {item.pattern}
          </Text>
          <Text style={[tw`text-white/50 text-xs mt-0.5`, { fontFamily: "SpaceGrotesk_400Regular" }]}>
            {item.timing}
          </Text>
        </View>
        {/* Inline rest indicator */}
        {item.restAfter && (
          <View style={tw`flex-row items-center justify-center py-2`}>
            <View style={tw`h-px bg-[#F59E0B]/30 flex-1`} />
            <Text style={[tw`text-[#F59E0B]/60 text-xs mx-3`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
              {item.restAfter}s REST
            </Text>
            <View style={tw`h-px bg-[#F59E0B]/30 flex-1`} />
          </View>
        )}
      </View>
    );
  }

  // Regular exercise block
  const block = item.block;
  const blockDuration = (block.workDuration + block.restDuration) * block.intervals;
  const isSmoker = block.isSmoker || block.type === "SM";

  return (
    <View style={tw`mb-2`}>
      <View
        style={[
          tw`bg-[#141414] rounded-xl py-3 px-4 border`,
          isSmoker ? tw`border-[#F59E0B]/30` : tw`border-[#262626]`,
        ]}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-1`}>
            {/* Smoker badge */}
            {isSmoker && (
              <View style={tw`flex-row items-center mb-1`}>
                <View style={tw`bg-[#F59E0B]/20 px-2 py-0.5 rounded mr-2`}>
                  <Text style={[tw`text-[#F59E0B] text-xs`, { fontFamily: "SpaceGrotesk_700Bold" }]}>
                    SMOKER
                  </Text>
                </View>
                {block.holdMovement && (
                  <Text style={[tw`text-[#F59E0B]/70 text-xs`, { fontFamily: "SpaceGrotesk_400Regular" }]}>
                    {block.holdMovement.displayName} hold
                  </Text>
                )}
              </View>
            )}
            <Text style={[tw`text-white text-sm`, { fontFamily: "SpaceGrotesk_600SemiBold" }]}>
              {isSmoker && block.workMovement ? block.workMovement.displayName : block.displayName}
            </Text>
            <Text style={[tw`text-white/50 text-xs mt-0.5`, { fontFamily: "SpaceGrotesk_400Regular" }]}>
              {block.intervals} × ({block.workDuration}s/{block.restDuration}s)
            </Text>
          </View>
          <Text
            style={[
              tw`text-white/40 text-sm`,
              { fontFamily: "SpaceGrotesk_500Medium" },
            ]}
          >
            {formatDuration(blockDuration)}
          </Text>
        </View>
      </View>
      {/* Inline rest indicator */}
      {item.restAfter && (
        <View style={tw`flex-row items-center justify-center py-2`}>
          <View style={tw`h-px bg-[#F59E0B]/30 flex-1`} />
          <Text style={[tw`text-[#F59E0B]/60 text-xs mx-3`, { fontFamily: "SpaceGrotesk_500Medium" }]}>
            {item.restAfter}s REST
          </Text>
          <View style={tw`h-px bg-[#F59E0B]/30 flex-1`} />
        </View>
      )}
    </View>
  );
}
