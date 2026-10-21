# INVICTORS Intro Video Optimization Guide

To ensure fast buffering and silky-smooth playback on both high-end desktop monitors and mobile devices on campus Wi-Fi, optimize the source video using `ffmpeg` with `+faststart` enabled:

### Desktop Version (1080p, H.264 + AAC)
```bash
ffmpeg -i input.mp4 -vf "scale=-2:1080,fps=30" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k public/Video.mp4
```

### Mobile Portrait / Compact Version (720p, High Compression)
```bash
ffmpeg -i input.mp4 -vf "scale=-2:720,fps=30" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k public/assets/intro/intro-mobile.mp4
```

### Video Poster Frame (First Frame or Climax)
```bash
ffmpeg -i input.mp4 -frames:v 1 -q:v 3 public/assets/intro/intro-poster.jpg
```

### Performance Target
- Target file size: under 2-4 MB so playback begins instantaneously.
- `+faststart` moves the MP4 atom index (moov atom) to the beginning of the file, allowing playback to start before the full file finishes downloading.
