# World Clock Dashboard

A responsive world clock application built with React and TypeScript. View the current time across different cities, explore locations on an interactive map, and manage your favourite time zones.

## Features

- **Live World Clocks** – Display current local times across multiple cities and time zones.
- **Interactive World Map** – Explore locations using an interactive map powered by React Leaflet and OpenStreetMap.
- **City Search** – Search for locations and add them to your dashboard.
- **Automatic Time Zone Detection** – Retrieve the time zone for newly added locations using their geographical coordinates.
- **Favourite Locations** – Mark frequently viewed cities as favourites.
- **Persistent Storage** – Save favourite clocks and custom locations using browser local storage.
- **Region Navigation** – Browse locations by geographical region.
- **Responsive Interface** – Designed to work across different screen sizes.

## Technologies

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type safety and application logic |
| Vite | Development server and build tooling |
| React Leaflet | Interactive map integration |
| Leaflet | Map rendering |
| OpenStreetMap | Map tile data |
| Nominatim | City and location search |
| Open-Meteo API | Time zone detection |
| Browser Local Storage | Persistent user preferences |

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Hassan-Naveed1/world-clock-wall.git
```

Navigate to the project directory:

```bash
cd world-clock-wall
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### Production Build

To generate an optimised production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
world-clock-wall/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Clock.tsx
│   │   ├── ClockGrid.tsx
│   │   ├── Header.tsx
│   │   ├── RegionNavigation.tsx
│   │   ├── SearchBar.tsx
│   │   └── WorldMap.tsx
│   ├── types/
│   │   └── clock.ts
│   ├── utils/
│   │   └── timezones.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## External Services

This application uses publicly available services:

- [OpenStreetMap](https://www.openstreetmap.org/) for map data.
- [Nominatim](https://nominatim.org/) for location search.
- [Open-Meteo](https://open-meteo.com/) for time zone information.

These services are subject to their own usage policies and availability.

## Purpose

This project was developed as part of my ongoing software engineering development, with a focus on React, TypeScript, API integration, component-based architecture, and browser storage.