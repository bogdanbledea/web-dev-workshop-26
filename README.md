# TV Show Voting App — Web Dev Workshop

A real-time voting application where users can vote for their favourite TV shows. Built with a **React** frontend and **Node.js/Express** backend, connected via **Socket.IO** for live updates.

## Project Structure

```
├── backend/          # Express API server
│   ├── index.js      # Main server — REST API + Socket.IO
│   ├── middleware/
│   │   └── auth.js   # API key authentication middleware
│   ├── package.json
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── frontend/         # React SPA (Vite + TypeScript)
    ├── src/
    │   ├── App.tsx    # Main component — renders shows & handles voting
    │   ├── config.ts  # App configuration (API URL, Socket URL, API key)
    │   ├── socket.ts  # Socket.IO client instance
    │   ├── main.tsx   # Entry point
    │   └── index.css  # Styles (Tailwind CSS)
    ├── package.json
    ├── Dockerfile
    ├── docker-compose.yml
    └── nginx.conf     # Nginx config for production serving
```

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** — build tool & dev server
- **Radix UI** — component library
- **Tailwind CSS** — utility-first styling
- **Axios** — HTTP client for API calls
- **Socket.IO Client** — real-time communication

### Backend
- **Node.js** with Express 5
- **Socket.IO** — WebSocket server for real-time vote broadcasting
- **dotenv** — environment variable management
- **CORS** enabled for cross-origin requests

## How It Works

1. The frontend fetches the list of TV shows from `GET /api/shows`
2. When a user clicks "Vote", a `POST /api/vote` request is sent with the show ID
3. The backend updates the vote count and broadcasts the updated list to **all connected clients** via Socket.IO
4. Every connected browser sees the vote update in real time — no page refresh needed

## Getting Started

### Prerequisites

- **Node.js** (v20 or later recommended)
- **npm**

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
API_KEY=HaufeWebDevWorkshop26
```

Start the server:

```bash
npm start
```

The backend runs on **http://localhost:3000**.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_KEY=HaufeWebDevWorkshop26
VITE_BACKEND_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

The frontend runs on **http://localhost:5173**.

## API Endpoints

All `/api` routes require the `X-Api-Key` header.

| Method | Endpoint      | Description                  | Body              |
|--------|---------------|------------------------------|--------------------|
| GET    | `/api/shows`  | Get all shows with votes     | —                  |
| POST   | `/api/vote`   | Vote for a show              | `{ "id": <number> }` |

## Real-Time Events (Socket.IO)

| Event   | Direction        | Payload                  | Description                        |
|---------|------------------|--------------------------|------------------------------------|
| `vote`  | Server → Client  | `{ shows: VoteItem[] }`  | Broadcasted when any user votes    |

## Environment Variables

### Backend (`backend/.env`)

| Variable  | Description                       |
|-----------|-----------------------------------|
| `API_KEY` | Shared secret for API auth        |

### Frontend (`frontend/.env`)

| Variable            | Description                          |
|---------------------|--------------------------------------|
| `VITE_API_KEY`      | API key sent in `X-Api-Key` header   |
| `VITE_BACKEND_URL`  | Backend API base URL                 |
| `VITE_SOCKET_URL`   | Socket.IO server URL                 |

> **Note:** Vite environment variables are baked into the app at **build time**. Changing them requires a rebuild.

## Docker

Both the backend and frontend include a `Dockerfile` and `docker-compose.yml` for containerized deployment. Each can be built and run independently from their respective folders using:

```bash
docker compose up -d --build
```

The frontend build args (`VITE_*`) are read from the `.env` file in the `frontend/` directory automatically by Docker Compose.

- **Backend** listens on port `3000`
- **Frontend** is served by Nginx on port `80`
