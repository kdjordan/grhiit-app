# GRHIIT Viral Sharing Strategy

## Overview

Every completed workout is a potential marketing post. GRHIIT's growth depends on users sharing their sessions on Instagram, TikTok, and X. This document outlines the comprehensive sharing system that turns users into distribution channels.

**Core Thesis:** Without sharing, GRHIIT stays small. With frictionless, beautiful sharing, every user becomes a billboard.

## Reference Apps

**Share Aura** (running app): https://apps.apple.com/us/app/share-aura/id6742422198
- Pulls HealthKit data
- AI-generated background templates
- Instagram Reels-style editing
- Making waves in running community

**GRHIIT's advantage:** Not just run data - *burpee and squat counts are more impressive and shareable than miles run.*

## User Flow

### Post-Workout Share Journey

```
Complete Workout → Enter Reps → Rate Session → SHARE button → 
Template Selector → Editor → Platform Select → Post/Save
```

**Critical:** Share option must be:
1. **Immediate** - right after completion high
2. **Effortless** - 3 taps to post
3. **Beautiful** - makes user look good
4. **Flexible** - customize or quick-post

## Template System Architecture

### Template Categories (200+ total)

**Brutal Minimalism (40 templates)**
- Black backgrounds, red accents
- Sharp geometric patterns
- Octagon motifs
- Typography-focused
- Example: "120 BURPEES" in massive red text on black

**Combat Sports Aesthetic (30 templates)**
- Octagon cage patterns
- Fighter walkout vibes
- Blood, sweat, sacrifice imagery
- MMA/Boxing inspired layouts

**Stoic Philosophy (30 templates)**
- Classical marble textures
- Roman numeral emphasis
- Marcus Aurelius quotes
- Aged parchment, stone carvings

**Raw & Gritty (25 templates)**
- Concrete textures
- Rust, metal, industrial
- Chalk on blackboard aesthetic
- Garage gym energy

**Athletic Performance (25 templates)**
- Heart rate graph overlays
- Data visualization focused
- Performance metrics highlighted
- Clean, technical layouts

**Motivational (25 templates)**
- Inspiring quotes + stats
- Achievement unlocked vibes
- Before/after style layouts
- Progress tracking emphasis

**Seasonal/Trending (15 templates)**
- Holiday themes (New Year, Summer, etc.)
- Seasonal colors/vibes
- Trending social formats
- Limited-time exclusives

**AI-Generated Backgrounds (10+ per month)**
- New templates added monthly
- User voting on favorites
- AI art trained on GRHIIT aesthetic
- Keeps content fresh

### Template Data Structure

```typescript
interface ShareTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  aspectRatio: '1:1' | '9:16' | '16:9' | '4:5';
  backgroundImage: string;        // URL or local asset
  textLayers: TextLayer[];        // Default text positioning
  dataBindings: DataBinding[];    // Where workout data appears
  customizable: {
    textPosition: boolean;
    colors: boolean;
    addPhoto: boolean;
    addText: boolean;
  };
  premium: boolean;                // Free vs. paid templates
}

interface TextLayer {
  id: string;
  content: string;                 // e.g., "{burpees} BURPEES"
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
  rotation: number;
  opacity: number;
}

interface DataBinding {
  field: 'burpees' | 'flyingSquats' | 'week' | 'day' | 'time' | 'date' | 'feelRating';
  layerId: string;                 // Which text layer to populate
  format: string;                  // e.g., "{value} BURPEES" or "W{week}:D{day}"
}
```

## Editor Features

### MVP Editor (Launch)

**Template Selection:**
- Horizontal scroll carousel
- Preview with actual workout data
- Quick-select most popular

**Text Customization:**
- Tap text to edit content
- Drag to reposition
- Pinch to resize
- Color picker for text

**Image Upload:**
- Add selfie background (post-workout photo)
- Replace template background entirely
- Overlay mode (blend photo with template)

**Quick Actions:**
- Toggle data visibility (hide reps if desired)
- Add custom caption text
- Adjust opacity/filters

**Export:**
- Instagram Story (9:16)
- Instagram Post (1:1 or 4:5)
- X/Twitter (16:9)
- TikTok (9:16)
- Save to Photos

### Advanced Editor (v1.1+)

**Full Design Tools:**
- Layer management (stacking order)
- Multiple text boxes (unlimited)
- Shapes & stickers library
- Filters & effects
- Font library (20+ options)
- Blend modes
- Drop shadows, glows, outlines

**Animation (for Stories/Reels):**
- Text entrance animations
- Data count-up effects
- Background parallax
- Pulse/heartbeat on logomark

**Collaboration:**
- Save custom templates
- Share templates with community
- Remix others' designs (with credit)

**Pro Features (IAP):**
- Exclusive template packs
- Remove GRHIIT watermark
- Custom fonts
- Advanced animations
- Priority new templates

## Data Display Options

### Core Stats (Always Available)

**Primary:**
- Burpees: {count}
- Flying Squats: {count}
- Week: {week}, Day: {day}
- Time: {duration}
- Date: {date}

**Secondary:**
- Feel rating: {1-5 with visual}
- Heart rate: Avg {avg}, Max {max}
- Streak: {days} days

**Cumulative (unlock after cycle complete):**
- Total burpees this cycle: {total}
- Total flying squats: {total}
- Workouts remaining: {24 - completed}

### Display Formats

**Minimal:**
```
120 BURPEES
240 FLYING SQUATS
W2:D1
```

**Detailed:**
```
SESSION COMPLETE
120 Burpees • 240 Flying Squats
Week 2, Day 1 • 16:32
Feel: 4/5 ⚡⚡⚡⚡
```

**Story-driven:**
```
8 weeks ago I couldn't do 10 burpees.
Today I did 120.

That's what GRHIIT does.
```

**Achievement:**
```
CYCLE COMPLETE
2,847 burpees
5,694 flying squats
56 days of maximum effort

Recalibrated. 🔴
```

## Technical Implementation

### Technology Stack

**React Native Libraries:**
```
- react-native-view-shot: Capture view as image
- react-native-svg: Vector graphics for templates
- @shopify/react-native-skia: Advanced graphics (animations)
- react-native-share: Native share sheet
- react-native-image-crop-picker: Photo upload
```

### Rendering Pipeline

1. **Template Load:** Fetch template JSON + background image
2. **Data Binding:** Populate text layers with workout data
3. **User Edits:** Apply customizations (position, color, text)
4. **Render:** Composite all layers using Skia/SVG
5. **Capture:** `react-native-view-shot` converts to image
6. **Export:** Native share sheet → Instagram/TikTok/X/Photos

### Performance Optimization

- **Lazy load templates:** Only load visible + adjacent
- **Cached renders:** Save rendered templates for quick re-share
- **Background processing:** Render in worker thread
- **Compressed assets:** WebP for backgrounds, SVG for vectors
- **Progressive enhancement:** Show low-res preview, render high-res on export

## Platform Integration

### Instagram

**Stories (9:16):**
- Direct share to Instagram app
- Pre-populated caption
- Link sticker (when 10k followers achieved)

**Feed Posts (1:1 or 4:5):**
- Export to Photos
- User manually posts
- Pre-written caption copied to clipboard

**Hashtag Strategy:**
```
Auto-suggest hashtags:
#GRHIIT #TabataTraining #BurpeeChallenge 
#BodyweightTraining #HIITWorkout #FitnessTransformation
```

### TikTok

**Video Posts (9:16):**
- Static image export (for now)
- Future: Screen recording of workout timer (advanced)
- Trending sound suggestions
- Duet-friendly format

**TikTok-specific templates:**
- Vertical format optimized
- Text overlays match TikTok style
- Captions positioned for TikTok UI

### X (Twitter)

**Image Posts (16:9 or 1:1):**
- Direct share via native sheet
- Pre-written tweet text
- Thread format for cycle completion

**Tweet Templates:**
```
Just crushed 120 burpees and 240 flying squats in 16 minutes.

Week 2, Day 1 of @GRHIITapp complete.

Your hardest workout wasn't hard. 🔴
```

### Native Share Sheet

Fallback for all platforms:
- Universal share (iMessage, WhatsApp, Email, etc.)
- "Copy Link" for web sharing
- "Save Image" to Photos

## Viral Mechanics

### Social Proof Loop

```
User completes workout → 
Shares impressive stats → 
Friends see post → 
"How did you do 120 burpees?" → 
"GRHIIT app" → 
Download + try
```

### Engagement Triggers

**1. Shocking Numbers:**
- "120 burpees in 16 minutes" = stops scroll
- "2,847 burpees in 8 weeks" = unbelievable → shareable

**2. Visual Impact:**
- Bold typography
- Red on black = distinctive
- Not generic fitness app aesthetic

**3. Identity Transformation:**
- Not "I worked out"
- "I'm someone who does 120 burpees"
- Aspirational identity

**4. Challenge Format:**
- "Can you match my 120 burpees?"
- Invite friends to try
- Tag GRHIIT account for repost

### In-App Virality Features

**Share Prompts:**
- After first completed workout: "Share your achievement?"
- After PR: "You just did your most burpees ever. Share it?"
- After cycle complete: "Show the world what you did."
- Streak milestones: "7 days in a row. That's rare."

**Social Feed (Future):**
- Opt-in community feed of shared workouts
- Like/comment on others' sessions
- Follow friends for accountability
- Leaderboards (weekly burpee totals)

**Challenges:**
- Monthly burpee challenge (total count)
- Streak challenges (consecutive days)
- Time challenges (fastest to complete cycle)
- Team challenges (group totals)

## Template Creation Workflow

### Internal Design Process

**Phase 1: MVP (20 templates)**
- Design in Figma
- Export as PNG backgrounds (high-res)
- Define text layer positions in JSON
- Test with real workout data
- A/B test most shared templates

**Phase 2: Scaling (50-200 templates)**
- AI-generated backgrounds (Midjourney/DALL-E)
- Prompt engineering for GRHIIT aesthetic
- Batch generation + curation
- User voting on favorites
- Monthly template drops

**Phase 3: User-Generated (v2.0)**
- Community template creator
- Submit custom templates
- Approval process
- Featured creators
- Template marketplace (creators earn credits)

### Template Prompts (AI Generation)

**Brutal Minimalism:**
```
"Black background, single red octagon shape, 
ultra minimalist, high contrast, geometric precision, 
Brutalist design, sharp edges, no gradients"
```

**Combat Sports:**
```
"MMA octagon cage from above, dramatic lighting, 
black and white with red accent, gritty texture, 
fighter walkout aesthetic, high contrast"
```

**Stoic Philosophy:**
```
"Marble texture background, ancient Roman aesthetic, 
classical sculpture fragment, weathered stone, 
muted earth tones with aged patina, philosophical"
```

## Analytics & Iteration

### Track Key Metrics

**Share Rate:**
- % of completed workouts shared
- Most shared templates
- Most shared stats (burpees > squats?)
- Time to share (immediate vs. delayed)

**Platform Distribution:**
- Instagram vs. TikTok vs. X
- Which platform drives most downloads
- Story vs. Feed performance

**Conversion:**
- Shares → app downloads (track via link)
- Template design → download rate
- User demos most likely to share

**Template Performance:**
- Views per template
- Shares per template
- Remix rate (if user customizes)
- Drop-off rate (template selected but not shared)

### Optimization Loop

1. **Weekly:** Review top-performing templates
2. **Monthly:** Generate new templates in winning styles
3. **Quarterly:** Retire low-performing templates
4. **Ongoing:** A/B test text positioning, colors, layouts

## Monetization Opportunities

### Free Tier

- 20 core templates (always free)
- All platform exports
- Basic customization (text, position)
- GRHIIT watermark on posts

### Pro Tier ($4.99/month or $39.99/year)

- 200+ premium templates
- Remove watermark
- Advanced editor tools
- Early access to new templates
- Custom fonts
- Animation effects
- Template favorites/collections

### One-Time Packs

- Seasonal pack: $2.99 (15 templates)
- AI Art pack: $3.99 (20 templates)
- Collab pack (guest designer): $4.99

## Launch Roadmap

### Pre-Launch (Before App Launch)

- [ ] Design 20 MVP templates (5 per category)
- [ ] Build template rendering engine
- [ ] Implement basic editor (text, position, color)
- [ ] Test share flow end-to-end
- [ ] Create template JSON schema

### Launch (v1.0)

- [ ] 20 free templates available
- [ ] Share to Instagram Stories/Feed
- [ ] Share to X
- [ ] Share to TikTok
- [ ] Save to Photos
- [ ] Pre-written captions

### Post-Launch (v1.1 - Month 2)

- [ ] Add 30 more templates (total 50)
- [ ] Advanced editor (layers, filters)
- [ ] Custom text boxes
- [ ] Photo upload background
- [ ] Template favorites

### Growth Phase (v1.2 - Month 4)

- [ ] 100+ templates
- [ ] Animation for Stories
- [ ] Pro subscription launch
- [ ] Community template voting
- [ ] Remix feature

### Maturity (v2.0 - Month 8)

- [ ] 200+ templates
- [ ] User-generated templates
- [ ] Template marketplace
- [ ] AI template generator (user prompts)
- [ ] Social feed integration

## Content Strategy

### GRHIIT Brand Account

**Instagram (@grhiit):**
- Repost user shares (with permission)
- Feature workouts of the week
- Technique tips
- Transformation stories

**TikTok (@grhiit):**
- Workout clips (timer screen recordings)
- Movement demos
- User challenges
- Duet-friendly content

**X (@grhiit):**
- Daily motivation quotes
- Workout stats
- Community highlights
- Response to user posts

### Influencer Strategy

Seed beta to:
- CrossFit athletes
- HIIT trainers
- Fitness YouTubers
- Running/endurance community

Give them:
- Early access
- Custom templates
- Affiliate link (20% commission)
- Feature in app (verified badge)

## Legal & Compliance

### User-Generated Content

**Terms of Use:**
- Users own their posts
- GRHIIT can repost with attribution
- No offensive content in public templates
- Community guidelines for template submissions

**Privacy:**
- Workout data only shared when user chooses
- No automatic posting
- All shares user-initiated
- Can delete shared data anytime

### Platform Compliance

**Instagram API:**
- Follow Meta's sharing guidelines
- No automated posting
- User-initiated shares only

**App Store Guidelines:**
- No spam/excessive sharing prompts
- Clear value proposition
- Respects user choice

## Success Metrics (6 Months Post-Launch)

**Viral Coefficient > 1.0:**
- Each user brings 1+ new user via shares
- 30%+ share rate on completed workouts
- 50k+ posts tagged #GRHIIT

**Template Engagement:**
- 100k+ template renders
- 50%+ of shares use custom editing
- 20+ user-submitted templates featured

**Platform Distribution:**
- Instagram: 60% of shares
- TikTok: 25% of shares
- X: 10% of shares
- Other: 5%

**Monetization:**
- 5%+ convert to Pro (template unlock)
- $10k+ MRR from template subscriptions
- Average 3 templates used per user

---

**Last Updated:** 2025-12-24
**Version:** 1.0
**Status:** Roadmap defined, implementation post-MVP
**Priority:** Critical for growth - required before public launch