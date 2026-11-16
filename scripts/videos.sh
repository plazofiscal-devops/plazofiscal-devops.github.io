#!/usr/bin/env bash
# Encodes the recorded demonstrations for the web, at 1080p with a poster for each one.
# Usage: npm run videos -- <folder with the original MP4 files>
set -euo pipefail
src=${1:?give the folder with the original videos}
out=public/videos
mkdir -p "$out"
for f in "$src"/*.mp4; do
  name=$(basename "$f" .mp4)
  ffmpeg -hide_banner -loglevel error -y -i "$f" \
    -vf "scale=1920:1080:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 24 -profile:v high \
    -an -movflags +faststart "$out/$name.mp4"
  duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  ffmpeg -hide_banner -loglevel error -y -ss "$(awk "BEGIN { print $duration * 0.4 }")" -i "$f" -frames:v 1 \
    -vf "scale=1280:720:flags=lanczos" -c:v libwebp -quality 82 "$out/$name.webp"
  echo "$name $(du -h "$out/$name.mp4" | cut -f1)"
done
