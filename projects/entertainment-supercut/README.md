# Entertainment Supercut — AFTER THE SIGNAL

**Status: working browser prototype plus reproducible vertical MP4 render.** The browser version is a 15-second interactive concept; the MP4 is a separate 12-second, 720 × 1280, 24 fps H.264 cut with original synthesized sound design.

## Preview and deliverables
- [Play the 15-second browser promo](index.html)
- [Production notes and shot list](production-notes.md)
- [Re-render script](render_teaser.sh)
- Hosted MP4 after successful Pages deployment: [after-the-signal-teaser.mp4](after-the-signal-teaser.mp4)

## Creative direction
A fictional near-future mystery about a city that receives a message from tomorrow. The visuals use original typography, graphic shapes, and copy. No third-party footage or music is used.

## Included work
- Five-beat browser promo with pause/replay controls, progress indicator, responsive layout, reduced-motion fallback, and a click-to-enable synthesized sound preview.
- Reproducible FFmpeg script for a 12-second vertical MP4 with synthesized low-frequency drone, pulsing texture, and intermittent signal tones with animated graphic treatment and title cards.
- Storyboard timing, export settings, and render metadata checks in the production notes and deployment workflow.

## Quality checks
- [x] Browser animation and responsive layout implemented
- [x] MP4 render script checked into the repository
- [x] GitHub Pages deployment renders the MP4 and checks duration and dimensions before publishing
- [x] Original synthesized sound effects and music bed included; no third-party audio or footage
- [ ] Review playback on a physical phone and capture genuine editing-process screenshots
- [x] Add original synthesized sound design and encode AAC audio in the MP4
- [ ] Listen on phone/headphones and review loudness and tonal balance before final approval

## Honest tool statement
The browser prototype is HTML/CSS/JavaScript and includes an opt-in Web Audio API sound preview. The MP4 is rendered from generated typography and graphic overlays using FFmpeg. This is a motion-graphics teaser, not live-action footage, and it does not claim use of CapCut, Remotion, or an AI video generator. The MP4 link is only live when the latest GitHub Pages deployment succeeds.
