# GRHIIT Video Strategy & Implementation

## Overview

GRHIIT is a video-heavy app with three distinct video categories, each requiring different hosting and delivery strategies. This document outlines the hybrid approach that balances offline reliability, user experience, SEO benefits, and cost efficiency.

**Core Principle:** Movement videos must work offline. Everything else can be online with smart caching.

## Video Categories

### 1. Movement Library (Critical - Offline Required)

**Purpose:** Demonstrate proper form for the 4 core movements

**Content:**
- 8-Count Bodybuilders (60-90 seconds)
- Jump Squats (45-60 seconds)
- Burpees (45-60 seconds)
- Flying Squats (60-75 seconds)

**Each video includes:**
- Full movement demo (real-time speed)
- Slow-motion breakdown of key positions
- Common mistakes to avoid (side-by-side comparison)
- Coaching cues (text overlays + voiceover)

**Hosting:** Firebase Storage or Cloudflare R2
**Delivery:** Download on first app launch, cache locally
**Fallback:** Re-download option if user clears cache
**Total Size:** ~60-100MB (4 videos at 15-25MB each)

**Why offline:**
- Users train in gyms with poor/no signal
- Zero latency = instant playback when needed
- No data usage during workouts
- Critical for safety (form instruction)

### 2. Pre-Workout Videos (Important - Hybrid)

**Purpose:** Kevin's coaching brief before each session (60 seconds each)

**Content:**
- Week 1, Day 1: "Foundation - Learn the rhythm"
- Week 1, Day 2: "Building volume"
- Week 1, Day 3: "First test"
- ...continuing through all 24 sessions

**Each video includes:**
- What's coming in this session
- Mental preparation
- Key focus points
- Encouragement + philosophy

**Hosting:** YouTube (unlisted)
**Delivery:** Stream on first view, cache locally after
**Fallback:** "Video unavailable offline" with text summary
**Total Size:** ~300-500MB (24 videos at 15-20MB each)

**Why hybrid:**
- Nice-to-have but not critical (can start without watching)
- Caching improves UX over time
- YouTube unlisted = shareable but not public
- Can update videos without app update

### 3. Educational Content (Optional - Online Only)

**Purpose:** SEO, discovery, education on methodology

**Content:**
- "What is GRHIIT?" (2-3 min)
- "The Science of Tabata Intervals" (4-5 min)
- "Why 8 Weeks?" (2-3 min)
- "Recalibrating Hard" (3-4 min)
- User transformation stories (ongoing)
- Movement deep-dives (advanced technique)

**Hosting:** YouTube (public)
**Delivery:** Stream only (in-app webview or open YouTube app)
**Total Size:** N/A (not downloaded)

**Why online-only:**
- Marketing content, not training content
- SEO benefit (rank for "Tabata training," "HIIT progression")
- Shareable (links drive app downloads)
- Updated frequently

## Technical Implementation

### Movement Library Download Flow

**On First App Launch:**

```typescript
async function downloadMovementLibrary() {
  const movements = [
    '8-count-bodybuilders.mp4',
    'jump-squats.mp4',
    'burpees.mp4',
    'flying-squats.mp4'
  ];
  
  // Show progress modal
  showDownloadProgress({
    title: "Downloading Movement Library",
    subtitle: "Required for offline training"
  });
  
  for (const movement of movements) {
    // Download from Firebase Storage
    const url = await storage.ref(`movements/${movement}`).getDownloadURL();
    const localPath = `${RNFS.DocumentDirectoryPath}/movements/${movement}`;
    
    // Download with progress tracking
    await RNFS.downloadFile({
      fromUrl: url,
      toFile: localPath,
      progress: (res) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        updateDownloadProgress(movement, progress);
      }
    }).promise;
  }
  
  // Mark as downloaded
  await AsyncStorage.setItem('movementLibraryDownloaded', 'true');
  
  hideDownloadProgress();
}
```

**Video Playback:**

```typescript
function playMovement(movementName: string) {
  const localPath = `${RNFS.DocumentDirectoryPath}/movements/${movementName}.mp4`;
  
  // Check if downloaded
  const exists = await RNFS.exists(localPath);
  
  if (exists) {
    // Play from local cache
    return <Video source={{ uri: `file://${localPath}` }} />;
  } else {
    // Fallback: stream or prompt re-download
    return <DownloadPrompt movement={movementName} />;
  }
}
```

### Pre-Workout Video Caching

**Lazy Download Strategy:**

```typescript
async function loadPreWorkoutVideo(week: number, day: number) {
  const videoId = `w${week}-d${day}`;
  const cacheKey = `pre-workout-${videoId}`;
  const localPath = `${RNFS.CachesDirectory}/pre-workouts/${videoId}.mp4`;
  
  // Check cache first
  const cached = await RNFS.exists(localPath);
  
  if (cached) {
    // Play from cache
    return { uri: `file://${localPath}`, cached: true };
  } else {
    // Stream from YouTube (embedded)
    const youtubeUrl = getYouTubeVideoUrl(videoId);
    
    // Background: download for next time
    downloadInBackground(youtubeUrl, localPath);
    
    return { uri: youtubeUrl, cached: false };
  }
}
```

**Background Download:**

```typescript
function downloadInBackground(url: string, destination: string) {
  // Don't block UI
  RNFS.downloadFile({
    fromUrl: url,
    toFile: destination,
    background: true,
    discretionary: true, // iOS: download when device idle
    cacheable: true
  });
}
```

### YouTube Embed (Educational Content)

```typescript
import YoutubePlayer from 'react-native-youtube-iframe';

function EducationalVideo({ videoId }: { videoId: string }) {
  return (
    <YoutubePlayer
      height={220}
      videoId={videoId}
      play={false}
      onChangeState={(state) => {
        if (state === 'ended') {
          trackVideoComplete(videoId);
        }
      }}
    />
  );
}
```

## Hosting Architecture

### Firebase Storage Structure

```
/videos/
  /movements/
    8-count-bodybuilders.mp4
    jump-squats.mp4
    burpees.mp4
    flying-squats.mp4
  /pre-workouts/
    w1-d1.mp4
    w1-d2.mp4
    w1-d3.mp4
    ...
    w8-d3.mp4
```

**CDN:** Firebase Storage includes global CDN (fast worldwide delivery)

**Security Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Movement library: public read
    match /videos/movements/{video} {
      allow read: if true;
      allow write: if false; // Admin only
    }
    
    // Pre-workout videos: authenticated users only
    match /videos/pre-workouts/{video} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

### YouTube Channel Organization

**GRHIIT YouTube Channel** (create before launch)

**Playlists:**

1. **Movement Library** (Private)
   - Not indexed by Google
   - Backup/reference only
   - Primary delivery via Firebase

2. **Pre-Workout Videos** (Unlisted)
   - Shareable via link
   - Embedded in app
   - Not publicly searchable

3. **Educational Series** (Public)
   - "What is GRHIIT?"
   - "The Science of Tabata"
   - "Why 8 Weeks Works"
   - SEO optimized titles/descriptions

4. **User Stories** (Public)
   - Transformation testimonials
   - Week 8 completion reactions
   - Community highlights

**SEO Strategy:**

Target keywords:
- "Tabata training"
- "HIIT workout progression"
- "bodyweight interval training"
- "8-week transformation"
- "burpee challenge"

Video titles:
- "What is Tabata Training? The 4-Minute Fat Burning Protocol"
- "Why 8 Weeks of HIIT Changes Your Body (Science Explained)"
- "How to Do Burpees Correctly (Common Mistakes)"

Link to app in every description:
"Download GRHIIT: [App Store link]"

## Video Production Specs

### Movement Library Videos

**Resolution:** 1080p (1920x1080)
**Frame Rate:** 60fps (smooth slow-motion)
**Bitrate:** 8-10 Mbps (high quality, ~15-25MB per video)
**Format:** H.264, MP4 container
**Audio:** AAC, 128 kbps (voiceover + music)

**Filming Setup:**
- Well-lit space (natural light or softbox)
- Clean background (garage gym, black backdrop)
- Multiple angles (front, side for form check)
- Slow-motion shots at 120fps

**Editing:**
- Text overlays for key coaching cues
- Split-screen for common mistakes
- 3-5 second intro (GRHIIT logo)
- 2-3 second outro (call to action)

### Pre-Workout Videos

**Resolution:** 1080p
**Frame Rate:** 30fps (talking head, lower priority)
**Bitrate:** 5-6 Mbps (~10-15MB per 60s video)
**Format:** H.264, MP4
**Audio:** AAC, 128 kbps (voiceover only or with music bed)

**Filming Setup:**
- Selfie-style (phone or webcam)
- At 13% BF or better (credibility)
- Authentic, not scripted (60s off-the-cuff)
- Consistent background (same location all 24)

**Editing:**
- Minimal (just trim start/end)
- Add GRHIIT logo watermark
- Week/Day text overlay (bottom third)

### Educational Content

**Resolution:** 1080p or 4K (future-proof)
**Frame Rate:** 30fps or 60fps
**Bitrate:** 10-15 Mbps
**Format:** H.264, MP4

**Production Value:**
- Higher quality than pre-workout videos
- B-roll footage (training, nature, movement demos)
- Motion graphics for science explanations
- Music bed (licensed or royalty-free)

## Cost Analysis

### Firebase Storage Costs

**Pricing:**
- Storage: $0.026 per GB stored
- Download: $0.12 per GB transferred

**Movement Library (per user):**
- Download: 100MB = 0.1 GB
- Cost: 0.1 × $0.12 = $0.012 per install

**At Scale:**
- 1,000 users: $12
- 10,000 users: $120
- 100,000 users: $1,200

**Storage Costs:**
- Movement library: 0.1 GB × $0.026 = $0.0026/month
- Pre-workout videos: 0.5 GB × $0.026 = $0.013/month
- Total: ~$0.02/month (negligible)

**Revenue per user:** $19.99 → you keep $13.99
**Video delivery cost:** $0.012
**Margin:** 99.9% after video costs

### YouTube Costs

**Free tier:** Unlimited storage + bandwidth
**Trade-off:** Ads (but not on unlisted/private)
**Benefit:** SEO, discoverability, community

## Offline-First UX

### Download States

**First Launch:**
```
┌─────────────────────────────────┐
│  Downloading Movement Library   │
│                                 │
│  ████████████░░░░░░  62%       │
│                                 │
│  Burpees.mp4 (3.2 MB / 5 MB)   │
│                                 │
│  [Cancel]        [Background]   │
└─────────────────────────────────┘
```

**Library Screen (Downloaded):**
```
Movement Library ✓
├─ 8-Count Bodybuilders  [▶] Downloaded
├─ Jump Squats           [▶] Downloaded  
├─ Burpees               [▶] Downloaded
└─ Flying Squats         [▶] Downloaded

[⟳ Re-download All]
```

**Library Screen (Not Downloaded):**
```
Movement Library
├─ 8-Count Bodybuilders  [↓] Download (15 MB)
├─ Jump Squats           [↓] Download (12 MB)
├─ Burpees               [↓] Download (18 MB)
└─ Flying Squats         [↓] Download (14 MB)

[⬇ Download All (59 MB)]

⚠️ Videos required for offline training
```

### Network State Handling

```typescript
import NetInfo from '@react-native-community/netinfo';

// Monitor connectivity
NetInfo.addEventListener(state => {
  if (!state.isConnected) {
    // Show offline indicator
    showOfflineBanner();
    
    // Disable online-only features
    disableEducationalVideos();
    disablePreWorkoutStreaming();
    
    // Movement library still works
  } else {
    hideOfflineBanner();
    
    // Resume background downloads
    resumeVideoDownloads();
  }
});
```

## Video Player Implementation

### React Native Video

**Library:** `react-native-video`

```typescript
import Video from 'react-native-video';

function MovementVideo({ movement }: { movement: string }) {
  const videoRef = useRef<Video>(null);
  const [paused, setPaused] = useState(false);
  
  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: getMovementVideoPath(movement) }}
        style={styles.video}
        paused={paused}
        repeat={true}
        resizeMode="contain"
        controls={false} // Custom controls
      />
      
      <TouchableOpacity 
        style={styles.playPause}
        onPress={() => setPaused(!paused)}
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
      </TouchableOpacity>
      
      <View style={styles.controls}>
        <SlowMotionButton onPress={() => setPlaybackRate(0.5)} />
        <NormalSpeedButton onPress={() => setPlaybackRate(1.0)} />
      </View>
    </View>
  );
}
```

**Features:**
- Play/pause
- Scrub timeline
- Slow-motion toggle (0.5x speed)
- Loop by default
- Fullscreen option

## Launch Checklist

### Pre-Production

- [ ] Script all movement videos (coaching cues, common mistakes)
- [ ] Plan filming locations (well-lit, clean background)
- [ ] Reach 8% body fat (camera-ready)
- [ ] Gather equipment (phone/camera, tripod, lighting)

### Production (Movement Library)

- [ ] Film 8-Count Bodybuilders (3-4 takes, multiple angles)
- [ ] Film Jump Squats (front + side angles)
- [ ] Film Burpees (full movement + slow-mo)
- [ ] Film Flying Squats (emphasis on form)

### Post-Production (Movement Library)

- [ ] Edit: Add text overlays for coaching cues
- [ ] Edit: Side-by-side correct vs. incorrect form
- [ ] Edit: Slow-motion breakdowns
- [ ] Edit: Add GRHIIT logo intro/outro
- [ ] Export: 1080p, H.264, ~15-25MB each
- [ ] Upload to Firebase Storage

### Production (Pre-Workout Videos)

- [ ] Film Week 1, Day 1 brief (60s, authentic)
- [ ] Film Week 1, Day 2 brief
- [ ] Film Week 1, Day 3 brief
- [ ] Continue through all 24 sessions (can film in batches)

### Post-Production (Pre-Workout)

- [ ] Minimal editing (trim only)
- [ ] Add week/day text overlay
- [ ] Export: 1080p, H.264, ~10-15MB each
- [ ] Upload to YouTube (unlisted)
- [ ] Upload to Firebase Storage (backup)

### Educational Content

- [ ] Script "What is GRHIIT?" video
- [ ] Script "The Science of Tabata" video
- [ ] Film, edit, publish to YouTube (public)
- [ ] Optimize titles/descriptions for SEO
- [ ] Link to App Store in descriptions

### App Integration

- [ ] Implement Firebase Storage download logic
- [ ] Build video player component
- [ ] Add download progress UI
- [ ] Test offline playback
- [ ] Test cache management
- [ ] Integrate YouTube embed for educational content

### Testing

- [ ] Download on WiFi (fast connection)
- [ ] Download on cellular (slow connection)
- [ ] Playback offline (airplane mode)
- [ ] Re-download after cache clear
- [ ] Multiple devices (iPhone, Android)
- [ ] Low storage scenarios

## Future Enhancements

### v1.1 - Enhanced Library

- Bookmarking specific timestamps in videos
- Notes on each movement (personal form cues)
- Playback speed controls (0.25x, 0.5x, 1x, 2x)

### v1.2 - AI Form Check

- Upload user video
- AI analyzes form vs. reference
- Feedback on corrections needed
- Gamification: "Form Score"

### v2.0 - Live Coaching

- Weekly live Q&A (Zoom/YouTube Live)
- Form check sessions
- Community accountability

### v2.1 - User-Generated Content

- Share your burpee technique
- Community tips
- Workout variations

---

**Last Updated:** 2025-12-24
**Version:** 1.0
**Status:** Strategy defined, production pending
**Priority:** Movement library videos = launch blocker, rest can follow