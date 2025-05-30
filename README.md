# Better Auth Monorepo

A robust authentication and authorization demo using Better Auth, Express, and PostgreSQL.

This monorepo contains two main projects:

- **Api/**: An Express-based API server with protected endpoints and health checks.
- **IdP/**: The Identity Provider, running Better Auth, handling all `/api/auth/*` endpoints and user/session management.

---

## Features
- User registration and login with email & password (via Better Auth)
- Persistent session storage using PostgreSQL
- All `/api/auth/*` endpoints are handled by Better Auth (no custom logic in API server)
- Unified API router (`Api/src/infrastructure/routes.js`) for custom endpoints (`/api/health`, `/api/protected`)
- Full end-to-end (E2E) test flow, including orchestration of both servers

---

## Prerequisites
- Node.js 16.x or later
- Yarn (recommended)
- PostgreSQL (running and accessible)
- [Optional] `nc` (netcat) for E2E orchestration script

---

## Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/better-auth.git
   cd better-auth
   ```

2. **Install dependencies for both projects:**
   ```sh
   cd Api && yarn install
   cd ../IdP && yarn install
   cd ..
   ```

3. **Configure environment variables:**
   - Set `POSTGRES_CONNECTION_STRING` in both the `Api` and `IdP` environments as needed.
   - You may copy `.env.example` to `.env` in each subproject if provided.

4. **Generate/migrate database schema:**
   ```sh
   cd IdP
   yarn better-auth-cli generate   # or: yarn better-auth-cli migrate
   cd ..
   ```

---

## Running the Servers

### Start the IdP (Identity Provider)
```sh
cd IdP
yarn dev
```
- Runs on [http://localhost:3000](http://localhost:3000)

### Start the API
```sh
cd Api
yarn dev
```
- Runs on [http://localhost:3005](http://localhost:3005)

---

## End-to-End (E2E) Tests

The E2E test covers the full authentication flow:
- User sign-up (handles already existing users)
- Sign-in to get a session token and cookie
- Exchange session token for JWT
- Access a protected endpoint with the JWT

### How to Run E2E Tests

**Just run:**
```sh
yarn test
```
from the `Api` directory (or project root if you forward the script). This will:
- Start both IdP and API servers in the background (if not already running)
- Wait for both to be healthy (using `nc`)
- Run the Jest E2E test (`Api/test/api.e2e.test.js`)
- Clean up any servers it started

**Script details:**
- Orchestration is handled by `Api/test/e2e.sh`
- The actual test is run via `yarn test:only` (which runs Jest directly)

#### To run only the Jest test (assuming servers are already running):
```sh
cd Api
yarn test:only
```

---

## Architecture Notes
- All `/api/auth/*` endpoints are handled by Better Auth (see `IdP` project)
- The API server (`Api/`) only defines `/api/health` and `/api/protected` endpoints (see `Api/src/infrastructure/routes.js`)
- JWT verification and session handling are delegated to Better Auth
- Database: PostgreSQL via the `pg` library and Better Auth's schema

---

## Troubleshooting
- Ensure PostgreSQL is running and accessible from both projects
- If E2E script fails to start servers, check logs in `/tmp/idp.log` and `/tmp/api.log`
- For schema issues, re-run migrations with `@better-auth/cli`

---

For more details, see the code and comments in each file. If you have issues or want to extend the workflow (CI, Docker, etc.), open an issue or PR!


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