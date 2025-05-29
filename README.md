# Better Auth Demo

A simple authentication system built with Express and Better Auth, using Bearer tokens and persistent PostgreSQL storage.

## Features

- User registration and login with email & password
- Bearer token authentication (no JWT)
- Persistent session storage using PostgreSQL
- All authentication endpoints (`/api/auth/*`) are handled by Better Auth
- Unified API router (`src/infrastructure/routes.js`) for all custom endpoints under `/api` (e.g., `/api/health`, `/api/protected`)

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- PostgreSQL (running and accessible)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/better-auth-demo.git
   cd better-auth-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3005
NODE_ENV=development

# Better Auth Configuration
AUTH_SECRET=your-secure-secret-key-here
BASE_URL=http://localhost:3005
TRUSTED_ORIGINS=http://localhost:3000
```

## Available Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/auth/sign-up/email` - User registration
- `POST /api/auth/sign-in/email` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/protected` - Protected endpoint (requires Bearer token)

## API Documentation

Interactive API documentation is available at: [http://localhost:3005/docs](http://localhost:3005/docs)

## Development

### Prerequisites
- Node.js 16+
- Yarn

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Copy environment file and update values:
   ```bash
   cp .env.example .env
   ```

3. Start development server (auto-restart on changes):
   ```bash
   yarn dev
   ```

4. For production:
   ```bash
   yarn start
   ```

5. Run tests:
   ```bash
   yarn test
   ```

## Usage

### 1. Sign Up
Send a POST request to `/api/auth/sign-up/email` with JSON body:
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "User Name"
}
```
The response will include a `set-auth-token` header containing your Bearer session token.

### 2. Sign In
Send a POST request to `/api/auth/sign-in/email` with your credentials to receive a new Bearer token.

### 3. Access Protected Endpoint
Send a GET request to `/api/protected` with the Bearer token:
```
Authorization: Bearer <your-session-token>
```

### 4. Health Check
Send a GET request to `/api/health` to verify the server is running:
```
curl http://localhost:3005/api/health
```

### 4. Log Out
Send a POST request to `/api/auth/sign-out` with the Bearer token in the Authorization header.

## Database

This project uses PostgreSQL for persistent session and user storage. You must set up a PostgreSQL database and provide the connection string via the environment variable.

## Migrations

To generate and run migrations (after changing plugins or schema):
```bash
npx @better-auth/cli@latest generate
npx @better-auth/cli@latest migrate
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3005
NODE_ENV=development

# Better Auth Configuration
AUTH_SECRET=your-secure-secret-key-here
BASE_URL=http://localhost:3005
TRUSTED_ORIGINS=http://localhost:3000
POSTGRES_CONNECTION_STRING=postgres://username:password@localhost:5432/better-auth
```

## License

MIT