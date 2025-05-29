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
   git clone https://github.com/yourusername/better-auth.git
   cd better-auth
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
- npm or Yarn
- PostgreSQL (running and accessible)

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Copy environment file and update values:
   ```bash
   cp .env.example .env
   # Edit .env and set POSTGRES_CONNECTION_STRING to your PostgreSQL connection string
   ```

3. **Prepare the Database (Run Migrations):**
   Before running the app, ensure your database schema is up to date:
   ```bash
   npm run cli:generate   # Generates the migration SQL from your Better Auth config
   npm run cli:migrate    # Applies the migration to your PostgreSQL database
   # or with yarn
   yarn cli:generate
   yarn cli:migrate
   ```
   This will create all necessary tables and columns in your PostgreSQL database.

4. Start development server (auto-restart on changes):
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. For production:
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

## Database Setup & Migration

This project uses PostgreSQL for persistent session and user storage. **Before running the app, you must:**

1. Set up a PostgreSQL database (local or cloud).
2. Set the `POSTGRES_CONNECTION_STRING` in your `.env` file.
3. Run the following commands to generate and apply the required schema/migrations:
   ```bash
   npm run cli:generate   # Generates migration SQL from your Better Auth config
   npm run cli:migrate    # Applies the migration to your PostgreSQL database
   # or with yarn
   yarn cli:generate
   yarn cli:migrate
   ```
   This will create all necessary tables (user, session, account, verification, etc.) in your PostgreSQL database.

If you change your Better Auth configuration or add plugins, re-run the above commands to update your schema.

### Resetting the Database (Development Only)

To fully reset your local PostgreSQL database and re-apply all migrations:

1. **Drop and recreate the database manually** (since the reset-db.sh script is no longer present):
   ```bash
   psql -U <your_db_user> -h <your_db_host> -d postgres -c "DROP DATABASE IF EXISTS \"better-auth\" WITH (FORCE);"
   psql -U <your_db_user> -h <your_db_host> -d postgres -c "CREATE DATABASE \"better-auth\";"
   ```
2. **Run migrations:**
   ```bash
   yarn cli:migrate
   # or
   npm run cli:migrate
   ```

**Warning:** This will delete all data in the database. Never use in production!

---

## Troubleshooting & Tips

- **Migration says "No migrations needed" but tables are missing:**
  - This means the migration tracking table is missing. Manually apply the latest migration SQL file in `better-auth_migrations/` using `psql`, then run the migration CLI again.
- **Tables already exist errors:**
  - This means your schema is partially present. Either drop the tables manually or reset the database as above.
- **E2E tests fail due to missing tables:**
  - Ensure you have run the migration after a reset.
- **Want a clean slate for tests?**
  - Use the reset workflow above, then run migrations and tests.

## End-to-End Test Success

After following the above workflow, all E2E tests (`yarn test`) should pass, confirming that your migrations and application setup are correct.

---

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