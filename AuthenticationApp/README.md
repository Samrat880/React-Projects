# Authentication App

Token-based authentication app using FreeAPI user endpoints.

## Live Demo

https://authentication-app-two-topaz.vercel.app/

## Screenshot

![Authentication App Screenshot](https://github.com/user-attachments/assets/c4053353-76d3-43f7-beeb-c20805901f69)

## Features

- Register a new user (username, email, password)
- Login with username and password
- Persist access token in local storage
- Fetch current user profile using bearer token
- Logout (API + local cleanup)
- Toast notifications for success and failure states

## Tech Stack

- React
- Vite
- Fetch API
- Tailwind utility classes

## API Endpoints Used

- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `GET /api/v1/users/current-user`
- `POST /api/v1/users/logout`

Base URL:

`https://api.freeapi.app/api/v1/users`

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

Practice full authentication flow handling in a React SPA with token lifecycle management.
