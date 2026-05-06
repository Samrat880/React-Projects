# YouTube Listing

Premium-style video listing interface powered by FreeAPI YouTube feed data.

## Live Demo

https://youtube-listing-lemon.vercel.app/

## Screenshot

![YouTube Listing Screenshot](https://github.com/user-attachments/assets/0bdeb7d6-7dbb-4db4-8bce-f1d8fae5de43)

## Features

- Fetch and normalize video feed response data
- Display responsive video cards with metadata
- Parse and format ISO-8601 durations
- Compact formatting for views and likes
- Loading skeletons, empty state, and error state
- External links to original YouTube videos

## Tech Stack

- React
- Vite
- Fetch API
- Tailwind utility classes

## API Endpoint

`https://api.freeapi.app/api/v1/public/youtube/videos`

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run preview` - preview production build

## Project Goal

Practice transforming nested API data into a polished, production-like listing UI.
