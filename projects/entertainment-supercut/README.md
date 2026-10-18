# Entertainment Supercut — AFTER THE SIGNAL

**Status: browser prototype and a real silent MP4 teaser are available.** The MP4 is a 12-second, 720×1280, 24 fps H.264 export; it is a separate vertical cut, not the 15-second browser prototype.

## Preview
- [Play the browser-based promo](index.html)
- [Production notes and shot list](production-notes.md)
- [Re-render script](render_teaser.sh)

## Creative direction
A fictional series teaser called **AFTER THE SIGNAL**: a near-future mystery about a city that receives a message from tomorrow. The visuals use original typography, graphic shapes, and copy. No third-party footage or music is used.

## Deliverables
- Browser promo: 15-second interactive prototype with five timed story beats, replay/pause controls, progress indicator, responsive layout, and reduced-motion fallback.
- MP4 teaser: 12-second vertical H.264 video with timed title cards, animated grid/signal sweep, and transitions. This version is intentionally silent.
- Production documentation: shot timing, export settings, and a reproducible FFmpeg script.

## QA / remaining work
- [x] Browser animation and responsive layout
- [x] MP4 rendered and duration/size metadata checked with ffprobe
- [x] Sample frames inspected for visual layout
- [x] Silent delivery clearly labelled; no unlicensed audio
- [ ] Add an original or properly licensed sound mix if the brief requires audio
- [ ] Review on a phone and capture genuine editing-process screenshots for a showreel case study
- [ ] Add an MP4 asset to the hosted portfolio after choosing a repository/hosting location for binary media

## Honest tool statement
The browser prototype is HTML/CSS/JavaScript. The MP4 was rendered with FFmpeg using generated typography and graphic overlays. This is a motion-graphics teaser, not live-action footage, and it does not claim use of CapCut, Remotion, or an AI video generator.