#!/usr/bin/env bash
# Render a six-second, silent 16:9 campaign motion card.
# Requires FFmpeg with libx264 and DejaVu Sans fonts.
set -euo pipefail
OUT="${1:-campaign-motion-card.mp4}"
FONT="${FONT:-/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf}"
BOLD="${BOLD:-/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf}"
if [[ ! -f "$FONT" || ! -f "$BOLD" ]]; then
  echo "Missing DejaVu Sans fonts. Set FONT and BOLD to valid font-file paths." >&2
  exit 1
fi
ffmpeg -hide_banner -y -f lavfi -i "color=c=0x080b15:s=1920x1080:r=24:d=6" -vf "
drawgrid=width=96:height=96:thickness=1:color=0x183341@0.7,
drawbox=x=0:y=0:w=1920:h=5:color=0x75f2ef@0.8:t=fill,
drawbox=x=0:y=1075:w=1920:h=5:color=0xffbf69@0.8:t=fill,
drawbox=x=1320:y=180:w=420:h=420:color=0x75f2ef@0.10:t=3,
drawbox=x=1360:y=220:w=340:h=340:color=0xffbf69@0.15:t=2,
drawtext=fontfile=${BOLD}:text='TRANSMISSION 001 / UNKNOWN ORIGIN':fontcolor=0xffbf69:fontsize=28:x=120:y=180,
drawtext=fontfile=${BOLD}:text='AFTER THE SIGNAL':fontcolor=white:fontsize=96:x=120:y=390,
drawtext=fontfile=${BOLD}:text='THE FUTURE CALLED. NOBODY SHOULD ANSWER.':fontcolor=0x75f2ef:fontsize=34:x=124:y=535,
drawtext=fontfile=${FONT}:text='A SCI-FI MYSTERY CONCEPT':fontcolor=0xb4bfd6:fontsize=24:x=124:y=700,
drawtext=fontfile=${FONT}:text='ORIGINAL CAMPAIGN / MOTION STUDY':fontcolor=0xb4bfd6:fontsize=20:x=124:y=900,
fade=t=in:st=0:d=0.4,fade=t=out:st=5.6:d=0.4,format=yuv420p
" -an -c:v libx264 -preset medium -crf 23 -movflags +faststart "$OUT"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -show_entries format=duration,size -of default=noprint_wrappers=1 "$OUT"
