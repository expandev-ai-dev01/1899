# Moon Tracker - Backend API

Backend REST API for the Moon Tracker application - an interactive lunar calendar and 3D visualization system.

## Features

- 3D Moon visualization data
- Lunar phase calculations
- Interactive lunar calendar
- Date-based navigation
- Moonrise and moonset times
- Phase illumination and age data

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Architecture**: REST API
- **Calculations**: SunCalc

## Project Structure

```
src/
├── api/                    # API controllers
│   └── v1/                 # API version 1
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
│   └── v1/                 # Version 1 routes
├── middleware/             # Express middleware
├── services/               # Business logic
├── utils/                  # Utility functions
├── constants/              # Application constants
├── instances/              # Service instances
├── config/                 # Configuration
└── server.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`

### Development

Run the development server with hot reload:

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

### Building for Production

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Documentation

### Base URL

- Development: `http://localhost:3000/api/v1`
- Production: `https://api.yourdomain.com/api/v1`

### Endpoints

#### Health Check

```
GET /health
```

Returns server health status.

### Internal Routes (Authenticated)

```
/api/v1/internal/moon-phase
```

Retrieves moon phase data for specific dates or ranges.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `API_VERSION` | API version | `v1` |
| `CORS_ORIGINS` | Allowed CORS origins | `localhost:3000,localhost:5173` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `10` |
| `CACHE_TTL` | Cache time-to-live (seconds) | `3600` |
| `CACHE_CHECK_PERIOD` | Cache check interval (seconds) | `600` |

## License

ISC
