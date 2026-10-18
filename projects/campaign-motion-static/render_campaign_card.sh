#!/usr/bin/env bash
# Render a six-second 16:9 campaign motion card with original synthesized sonic branding.
# Requires FFmpeg with libx264 and DejaVu Sans fonts.
set -euo pipefail
OUT="${1:-campaign-motion-card.mp4}"
FONT="${FONT:-/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf}"
BOLD="${BOLD:-/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf}"
if [[ ! -f "$FONT" || ! -f "$BOLD" ]]; then
  echo "Missing DejaVu Sans fonts. Set FONT and BOLD to valid font-file paths." >&2
  exit 1
fi
ffmpeg -hide_banner -y \
  -f lavfi -i "color=c=0x080b15:s=1920x1080:r=24:d=6" \
  -f lavfi -i "sine=frequency=65:duration=6:sample_rate=48000" \
  -f lavfi -i "sine=frequency=130:duration=6:sample_rate=48000" \
  -f lavfi -i "sine=frequency=990:duration=6:sample_rate=48000" \
  -f lavfi -i "sine=frequency=740:duration=6:sample_rate=48000" \
  -filter_complex "[0:v]
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
fade=t=in:st=0:d=0.4,fade=t=out:st=5.6:d=0.4,format=yuv420p[v];
[1:a]lowpass=f=115,volume=0.22,afade=t=in:st=0:d=0.4,afade=t=out:st=5.0:d=1[drone];
[2:a]lowpass=f=250,volume=0.08,tremolo=f=1.4:d=0.6[pulse];
[3:a]volume='0.18*if(between(mod(t\,1.5)\,0\,0.10)\,1\,0)',lowpass=f=2600[ping];
[4:a]volume='0.13*if(between(mod(t+0.35\,2)\,0\,0.08)\,1\,0)',lowpass=f=2200[echo];
[drone][pulse][ping][echo]amix=inputs=4:duration=longest:normalize=0,alimiter=limit=0.85,afade=t=in:st=0:d=0.2,afade=t=out:st=5.4:d=0.6[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 160k -ar 48000 -movflags +faststart "$OUT"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -show_entries format=duration,size -of default=noprint_wrappers=1 "$OUT"
