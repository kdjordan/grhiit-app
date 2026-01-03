#!/bin/bash
# Sync workout CSVs from Google Drive and convert to JSON
#
# Usage: npm run sync-workouts
#
# Prerequisites:
#   - rclone installed (brew install rclone)
#   - rclone configured with 'gdrive' remote (rclone config)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CSV_DIR="$PROJECT_DIR/workouts/csv"
DRIVE_FOLDER_ID="1p478tYwUL56tc2CUODYd976kDiPmLM2m"

echo "📥 Syncing workouts from Google Drive..."

# Clear existing CSVs (to remove stale files)
rm -f "$CSV_DIR"/*.csv

# Sync from Google Drive, exporting Sheets as CSV
rclone copy \
  --drive-root-folder-id "$DRIVE_FOLDER_ID" \
  --drive-export-formats csv \
  gdrive: "$CSV_DIR"

echo "✅ Synced $(ls -1 "$CSV_DIR"/*.csv 2>/dev/null | wc -l | tr -d ' ') CSV files"

# Run converter
echo ""
node "$SCRIPT_DIR/convert-workouts.js"
