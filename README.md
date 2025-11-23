# 🏃 FitCompare - Fitness Activity File Analyzer# 🏃 FitCompare - Fitness Activity File Analyzer



FitCompare is a professional web application for analyzing and comparing fitness activity files (FIT files) from running, endurance, and strength training activities. Visualize dual activity metrics side-by-side with interactive heart rate comparison charts.FitCompare is a professional web application for analyzing and comparing fitness activity files (FIT files) from running, endurance, and strength training activities. Visualize dual activity metrics side-by-side with interactive heart rate comparison charts.



## 📋 Features## 📋 Features



- **FIT File Upload & Parsing** - Upload `.fit` files from fitness trackers and wearables- **FIT File Upload & Parsing** - Upload `.fit` files from fitness trackers and wearables

- **Dual File Comparison** - Side-by-side metrics comparison of two activities- **Dual File Comparison** - Side-by-side metrics comparison of two activities

- **Heart Rate Analysis** - Interactive dual-line chart showing heart rate over time for both activities- **Heart Rate Analysis** - Interactive dual-line chart showing heart rate over time for both activities

- **Native Area Selection Zoom** - Drag to select and zoom into specific time ranges on the graph- **Native Area Selection Zoom** - Drag to select and zoom into specific time ranges on the graph

- **Professional Metrics Dashboard** - Compare:- **Professional Metrics Dashboard** - Compare:

  - Sport type and sub-sport classification  - Sport type and sub-sport classification

  - Average and maximum heart rate  - Average and maximum heart rate

  - Activity duration and timestamps  - Activity duration and timestamps

  - Total record counts  - Total record counts

- **Athletic Theme** - Modern dark mode design with orange branding optimized for fitness professionals- **Athletic Theme** - Modern dark mode design with orange branding optimized for fitness professionals

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices



## 🚀 Getting Started## 🚀 Getting Started



### Prerequisites### Prerequisites

- Node.js 16+ and npm/yarn- Node.js 16+ and npm/yarn

- Modern web browser- Modern web browser



### Installation### Installation



```bash```bash

# Clone the repository# Clone the repository

git clone <repository-url>git clone <repository-url>

cd fit-comparecd fit-compare



# Install dependencies# Install dependencies

npm installnpm install



# Start development server# Start development server

npm run devnpm run dev

``````



The app will be available at `http://localhost:5174`The app will be available at `http://localhost:5174`



### Building for Production### Building for Production



```bash```bash

npm run buildnpm run build

``````



This generates an optimized production build in the `dist/` folder.This generates an optimized production build in the `dist/` folder.



## 🛠️ Tech Stack## 🛠️ Tech Stack



- **Frontend Framework**: React 19.2.0 with TypeScript 5.9.3- **Frontend Framework**: React 19.2.0 with TypeScript 5.9.3

- **Build Tool**: Vite 7.2.4- **Build Tool**: Vite 7.2.4

- **Charting**: ECharts 5+ (native area selection zoom)- **Charting**: ECharts 5+ (native area selection zoom)

- **FIT File Parsing**: fit-file-parser npm package- **FIT File Parsing**: fit-file-parser npm package

- **UI Framework**: Bootstrap (responsive grid)- **UI Framework**: Bootstrap (responsive grid)

- **Styling**: Custom CSS with dark athletic theme- **Styling**: Custom CSS with dark athletic theme



## 📊 How to Use## 📊 How to Use



1. **Upload Files**: 1. **Upload Files**: 

   - Click "Choose File" for File 1 and File 2   - Click "Choose File" for File 1 and File 2

   - Select your `.fit` files from your fitness tracker   - Select your `.fit` files from your fitness tracker



2. **View Comparison**:2. **View Comparison**:

   - Metrics table shows side-by-side comparison of activity data   - Metrics table shows side-by-side comparison of activity data

   - Heart rate chart displays both activities with distinct colors:   - Heart rate chart displays both activities with distinct colors:

     - **Orange (#ff6b35)** - File 1     - **Orange (#ff6b35)** - File 1

     - **Blue (#3498db)** - File 2     - **Blue (#3498db)** - File 2



3. **Zoom Into Data**:3. **Zoom Into Data**:

   - **Drag** on the chart to select a time range and zoom in   - **Drag** on the chart to select a time range and zoom in

   - **Scroll** to zoom with mouse wheel   - **Scroll** to zoom with mouse wheel

   - Use the **zoom slider** at the bottom for precise control   - Use the **zoom slider** at the bottom for precise control

   - Click **Reset Zoom** to return to full view   - Click **Reset Zoom** to return to full view



4. **Compare Metrics**:4. **Compare Metrics**:

   - Average Heart Rate (bpm)   - Average Heart Rate (bpm)

   - Max Heart Rate (bpm)   - Max Heart Rate (bpm)

   - Sport type and category   - Sport type and category

   - Start/end times and duration   - Start/end times and duration

   - Total data records captured   - Total data records captured



## 📁 Project Structure## 📁 Project Structure



``````

fit-compare/fit-compare/

├── src/├── src/

│   ├── App.tsx              # Main application component│   ├── App.tsx              # Main application component

│   ├── App.css              # Athletic theme styling│   ├── App.css              # Athletic theme styling

│   ├── main.tsx             # Entry point│   ├── main.tsx             # Entry point

│   ├── index.css            # Global styles│   ├── index.css            # Global styles

│   └── utils/│   └── utils/

│       └── fitDataParser.ts # FIT file parsing utilities│       └── fitDataParser.ts # FIT file parsing utilities

├── public/                  # Static assets├── public/                  # Static assets

├── index.html               # HTML template├── index.html               # HTML template

├── package.json             # Dependencies├── package.json             # Dependencies

├── tsconfig.json            # TypeScript config├── tsconfig.json            # TypeScript config

├── vite.config.ts           # Vite configuration├── vite.config.ts           # Vite configuration

└── README.md                # This file└── README.md                # This file

``````



## 🎨 Design Philosophy## 🎨 Design Philosophy



FitCompare features a **professional athletic-focused design** with:FitCompare features a **professional athletic-focused design** with:

- **Dark Mode**: Reduces eye strain during extended use- **Dark Mode**: Reduces eye strain during extended use

- **Orange Branding**: High-visibility primary color for important elements- **Orange Branding**: High-visibility primary color for important elements

- **Clean Typography**: Bold, uppercase labels for quick scanning- **Clean Typography**: Bold, uppercase labels for quick scanning

- **Responsive Layout**: Optimized grid for all screen sizes- **Responsive Layout**: Optimized grid for all screen sizes

- **User-Select Prevention**: Smooth drag interactions without text selection- **User-Select Prevention**: Smooth drag interactions without text selection



## 🔧 Configuration## 🔧 Configuration



The app is pre-configured for FIT file parsing with these settings:The app is pre-configured for FIT file parsing with these settings:

- Speed Unit: km/h- Speed Unit: km/h

- Length Unit: km- Length Unit: km

- Temperature Unit: Celsius- Temperature Unit: Celsius

- Pressure Unit: bar- Pressure Unit: bar



## 📝 License## 📝 License



This project is provided as-is for fitness analysis purposes.This project is provided as-is for fitness analysis purposes.



## 🤝 Contributing## 🤝 Contributing



Suggestions and improvements welcome! Please feel free to open issues or submit pull requests.Suggestions and improvements welcome! Please feel free to open issues or submit pull requests.



## 📧 Support## 📧 Support



For questions or issues, please check the browser console (F12) for debug information when uploading FIT files.For questions or issues, please check the browser console (F12) for debug information when uploading FIT files.


```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
