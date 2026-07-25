# Wonder Tools

A privacy-first collection of browser-based creative utilities by Wonder Studio.

## Tools

- `/split/` — split images into a configurable grid and download the results.
- `/qr-code/` — generate downloadable QR codes as SVG or PNG.
- `/raw2dng/` — convert supported RAW photographs to DNG locally in the browser.

All processing happens locally in the browser. Files are not uploaded to a server.

## Development

```bash
npm ci
npm run dev
```

## Static deployment

```bash
npm run build
```

The static export is written to `out/` and can be served by Nginx or another static web server.

