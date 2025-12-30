/**
 * Post-workout taglines for each session
 * Keyed by "week-day" (e.g., "1-1" for Week 1 Day 1)
 */

export const SESSION_TAGLINES: Record<string, string> = {
  // Week 1 — Learning the System
  "1-1": "You took the first step.",
  "1-2": "You came back.",
  "1-3": "Now you know what is asked of you.",

  // Week 2 — Holding Consistency
  "2-1": "Now this starts to matter",
  "2-2": "You stayed when it got hard.",
  "2-3": "You proved consistency doesn't need motivation.",

  // Week 3 — First Accumulation
  "3-1": "You felt the weight of your choices.",
  "3-2": "You kept your focus was fatigure accumulated",
  "3-3": "You finished knowing this doesn't get easier",

  // Week 4 — Crossing the Threshold
  "4-1": "You worked past the point where excuses appear.",
  "4-2": "You stayed present instead of negotiating.",
  "4-3": "You earned the right to continue.",

  // Week 5 — Volume With Fatigue
  "5-1": "You carried fatigue without letting it lead.",
  "5-2": "You held the line longer than before.",
  "5-3": "You didn't look for an exit.",

  // Week 6 — Staying Under Pressure
  "6-1": "You kept going when stopping made sense.",
  "6-2": "You chose effort over comfort again.",
  "6-3": "You held your pace under pressure.",

  // Week 7 — Psychological Load
  "7-1": "You worked with less certainty and stayed anyway.",
  "7-2": "You continued without needing clarity.",
  "7-3": "You stayed steady while everything argued back.",

  // Week 8 — The Summit
  "8-1": "You carried the full weight of the work.",
  "8-2": "You finished without needing proof.",
  "8-3": "You've seen what staying looks like",
};

/**
 * Get tagline for a specific session
 */
export function getSessionTagline(week: number, day: number): string {
  const key = `${week}-${day}`;
  return SESSION_TAGLINES[key] || "You just proved something to yourself.";
}
