# GrowWithUS

GrowWithUS is an IT career roadmap platform with a React + Tailwind frontend and a Node.js + Express + MongoDB backend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, MongoDB, Mongoose, JWT

## Repository Structure

- `growwithus-frontend/` - Web application
- `growwithus-backend/` - REST API

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string

## Backend Setup

```bash
cd growwithus-backend
npm install
```

Create `growwithus-backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

## Frontend Setup

```bash
cd growwithus-frontend
npm install
```

Optional frontend env (`growwithus-frontend/.env`):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

## Scripts

Frontend (`growwithus-frontend`):

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build

Backend (`growwithus-backend`):

- `npm run dev` - Start with nodemon
- `npm start` - Start server

## Features

- Authentication (register/login)
- Role-based access (student/admin)
- Roadmap browsing and filtering
- Progress tracking dashboard
- Admin panel for roadmap management

## License

This project is for educational and portfolio use.
