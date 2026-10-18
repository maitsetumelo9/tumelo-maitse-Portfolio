#!/usr/bin/env bash
# Re-render the silent vertical AFTER THE SIGNAL teaser.
# Requires FFmpeg built with libx264 and DejaVu Sans fonts.
set -euo pipefail
OUT="${1:-after-the-signal-teaser.mp4}"
FONT="${FONT:-/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf}"
BOLD="${BOLD:-/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf}"
if [[ ! -f "$FONT" || ! -f "$BOLD" ]]; then
  echo "Missing DejaVu Sans font. Set FONT and BOLD to valid font-file paths." >&2
  exit 1
fi
ffmpeg -y -f lavfi -i "color=c=#050b12:s=720x1280:r=24:d=12" -filter_complex "
[0:v]drawgrid=width=72:height=72:thickness=1:color=#10303c@0.55,
noise=alls=8:allf=t+u,
drawbox=x='mod(t*90,900)-180':y=0:w=130:h=1280:color=#00d9ff@0.045:t=fill,
drawbox=x=44:y=230:w=632:h=2:color=#00d9ff@0.8:t=fill,
drawbox=x=44:y=1050:w=632:h=2:color=#00d9ff@0.55:t=fill,
drawtext=fontfile=${BOLD}:text='INCOMING TRANSMISSION':fontcolor=#00e5ff:fontsize=18:x=(w-text_w)/2:y=180:alpha='if(lt(t\\,2)\\,if(lt(t\\,0.3)\\,t/0.3\\,if(gt(t\\,1.7)\\,(2-t)/0.3\\,1))\\,0)',
drawtext=fontfile=${BOLD}:text='SIGNAL LOST':fontcolor=white:fontsize=62:x=(w-text_w)/2:y=570:alpha='if(lt(t\\,2)\\,if(lt(t\\,0.3)\\,t/0.3\\,if(gt(t\\,1.7)\\,(2-t)/0.3\\,1))\\,0)',
drawtext=fontfile=${FONT}:text='NO NETWORK. NO HELP. NO WAY BACK.':fontcolor=#a6c4ce:fontsize=19:x=(w-text_w)/2:y=660:alpha='if(lt(t\\,2)\\,if(lt(t\\,0.4)\\,t/0.4\\,if(gt(t\\,1.65)\\,(2-t)/0.35\\,1))\\,0)',
drawtext=fontfile=${BOLD}:text='THE WORLD WENT QUIET.':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=590:alpha='if(between(t\\,2\\,4.2)\\,if(lt(t\\,2.25)\\,(t-2)/0.25\\,if(gt(t\\,3.9)\\,(4.2-t)/0.3\\,1))\\,0)',
drawtext=fontfile=${FONT}:text='UNTIL SOMETHING ANSWERED.':fontcolor=#00e5ff:fontsize=22:x=(w-text_w)/2:y=660:alpha='if(between(t\\,2.2\\,4.2)\\,if(lt(t\\,2.5)\\,(t-2.2)/0.3\\,if(gt(t\\,3.9)\\,(4.2-t)/0.3\\,1))\\,0)',
drawbox=x=44:y=450:w=632:h=350:color=#00d9ff@0.08:t=2:enable='between(t\,4.2\,6.6)',
drawtext=fontfile=${BOLD}:text='THE STATIC':fontcolor=#00e5ff:fontsize=52:x=(w-text_w)/2:y=540:alpha='if(between(t\\,4.2\\,6.6)\\,if(lt(t\\,4.5)\\,(t-4.2)/0.3\\,if(gt(t\\,6.3)\\,(6.6-t)/0.3\\,1))\\,0)',
drawtext=fontfile=${BOLD}:text='IS TALKING.':fontcolor=white:fontsize=52:x=(w-text_w)/2:y=610:alpha='if(between(t\\,4.2\\,6.6)\\,if(lt(t\\,4.6)\\,(t-4.2)/0.4\\,if(gt(t\\,6.3)\\,(6.6-t)/0.3\\,1))\\,0)',
drawtext=fontfile=${BOLD}:text='DON’T TRUST THE VOICE.':fontcolor=white:fontsize=39:x=(w-text_w)/2:y=590:alpha='if(between(t\\,6.6\\,9)\\,if(lt(t\\,6.9)\\,(t-6.6)/0.3\\,if(gt(t\\,8.7)\\,(9-t)/0.3\\,1))\\,0)',
drawtext=fontfile=${FONT}:text='IT KNOWS YOUR NAME.':fontcolor=#ff476f:fontsize=22:x=(w-text_w)/2:y=660:alpha='if(between(t\\,6.9\\,9)\\,if(lt(t\\,7.2)\\,(t-6.9)/0.3\\,if(gt(t\\,8.7)\\,(9-t)/0.3\\,1))\\,0)',
drawbox=x=0:y=0:w=720:h=1280:color=black@0.35:t=fill:enable='between(t\,9\,12)',
drawtext=fontfile=${BOLD}:text='AFTER THE SIGNAL':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=545:alpha='if(between(t\\,9\\,12)\\,if(lt(t\\,9.5)\\,(t-9)/0.5\\,if(gt(t\\,11.6)\\,(12-t)/0.4\\,1))\\,0)',
drawtext=fontfile=${BOLD}:text='A SERIES CONCEPT':fontcolor=#00e5ff:fontsize=21:x=(w-text_w)/2:y=625:alpha='if(between(t\\,9.3\\,12)\\,if(lt(t\\,9.7)\\,(t-9.3)/0.4\\,if(gt(t\\,11.6)\\,(12-t)/0.4\\,1))\\,0)',
drawtext=fontfile=${FONT}:text='THE SIGNAL IS ONLY THE BEGINNING':fontcolor=#a6c4ce:fontsize=16:x=(w-text_w)/2:y=1068:alpha='if(between(t\\,9.5\\,12)\\,if(lt(t\\,9.9)\\,(t-9.5)/0.4\\,if(gt(t\\,11.7)\\,(12-t)/0.3\\,1))\\,0)',
format=yuv420p[v]" -map "[v]" -an -c:v libx264 -preset medium -crf 25 -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "$OUT"
