# FitCompare - Fitness Activity File Analyzer

FitCompare is a web application for analyzing and comparing fitness activity files (FIT files). Upload two FIT files from your GPS watch or cycling computer to compare time-synced metrics side-by-side and across a combined heart rate chart.

## Key Features

- Upload and parse `.fit` files
- Side-by-side metrics comparison (sport, average/max heart rate, timestamps, record counts)
- Interactive heart rate chart with native area selection zoom (ECharts)
- Responsive design and dark athletic theme
- Simple dev setup with Vite + React + TypeScript

## Quick Start

### Prerequisites
- Node.js 16+ and npm or yarn

### Install and Run

```bash
git clone <repo-url>
cd fit-compare
npm install
npm run dev
```

Open http://localhost:5174 in your browser.

### Build

```bash
npm run build
```

## How to Use

1. Choose `File 1` and `File 2` and upload `.fit` files.
2. When both files are uploaded and parsed, the comparison view will appear.
3. Use drag-to-zoom on the chart to select a time range and zoom; use `Reset Zoom` to return to full view.
4. Compare metrics in the table and visually examine heart rate overlaps on the chart.

## Project Structure

```
fit-compare/
 public/
 src/
    App.tsx
    App.css
    main.tsx
    utils/fitDataParser.ts
 package.json
 README.md
```

## Developer Notes

- The app uses `fit-file-parser` to convert FIT binaries into usable JSON structures.
- ECharts provides native dataZoom (`slider` + `inside`) and high performance rendering.
- If charts appear blank after upload, check browser DevTools (Console) for debug logs; there are console logs in `App.tsx` for data diagnostics.

## Contributing

Contributions are welcome. Open an issue or PR and follow the code style in the repository.

## License

MIT
