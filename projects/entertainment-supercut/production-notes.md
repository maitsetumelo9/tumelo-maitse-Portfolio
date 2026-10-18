# Production notes — AFTER THE SIGNAL

## Brief
Create a compact vertical teaser for a fictional near-future mystery series. The concept should communicate an escalating threat using typography, signal graphics, and pacing rather than stock footage.

## Shot list / edit timeline
| Timecode | Beat | Picture and copy | Purpose |
|---|---|---|---|
| 00:00–00:02 | Hook | “INCOMING TRANSMISSION” / “SIGNAL LOST” | Establish a technical failure immediately |
| 00:02–00:04.2 | Silence | “THE WORLD WENT QUIET.” / “UNTIL SOMETHING ANSWERED.” | Shift from outage to mystery |
| 00:04.2–00:06.6 | Escalation | Cyan “THE STATIC” and white “IS TALKING.” inside a signal frame | Introduce the impossible message |
| 00:06.6–00:09 | Threat | “DON’T TRUST THE VOICE.” / “IT KNOWS YOUR NAME.” | Raise personal stakes |
| 00:09–00:12 | Title card | “AFTER THE SIGNAL” / “A SERIES CONCEPT” | Land the title and premise |

## Export
- Container: MP4
- Video codec: H.264 (libx264)
- Frame: 720 × 1280 (9:16)
- Frame rate: 24 fps
- Duration: 12 seconds
- Audio: none; intentional silent visual cut
- Source tool: FFmpeg filter graph (render_teaser.sh)
- Design: dark navy field, cyan grid and signal sweep, white/cyan typography, subtle noise texture.

## Quality checks performed
- Render completed successfully.
- ffprobe reported a 12.000-second duration and a 307,000-byte file.
- Sample frames around 1, 5, and 10 seconds were extracted for visual inspection.
- The export is a motion-graphics concept, not footage from a real series.
- The hosted portfolio page is a separate HTML prototype. The MP4 file is not currently committed in this repository.

## Before calling this client-ready
1. Watch the complete MP4 on a phone at full screen.
2. Check title readability and safe margins on multiple players.
3. If audio is requested, add only original or properly licensed music and sound effects, then re-export and re-check.
4. Capture genuine timeline/workflow screenshots from the editor used. Do not present generated frames as screenshots of an editing timeline.
5. If the brief asks for multiple aspect ratios, create and inspect separate exports rather than stretching this vertical cut.

## Sound design update

Both MP4 render scripts synthesize original audio with FFmpeg tone sources and filters; no external music files, samples, or API keys are required.

- **12-second vertical teaser:** atmospheric low-frequency drone, pulsing sub-tone, and intermittent signal/echo beeps; AAC audio at 48 kHz.
- **6-second landscape campaign card:** sustained tone, pulse, and short sonic-branding pings; AAC audio at 48 kHz.
- The render pipeline checks the presence of an encoded audio stream alongside dimensions and duration.
- This is synthetic sound design, not a licensed commercial music track. Listening on a phone/headphones and final loudness review remain human checks.
