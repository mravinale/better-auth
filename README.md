# Better Auth Identity Provider (IdP)

A robust authentication and authorization Identity Provider using Better Auth, Express, PostgreSQL, and TypeScript.

This project provides a complete authentication service that handles user registration, login, email verification, password reset, session management, and organization management through Better Auth's comprehensive plugin system.

---

## Features

### Authentication & Authorization
- **User Management**: Registration, login, and profile management with email & password
- **Email Verification**: Automated email verification with customizable templates
- **Password Reset**: Secure password reset flow with token-based validation
- **JWT & Bearer Tokens**: Full JWT token generation and Bearer token support
- **Session Management**: Persistent sessions with PostgreSQL storage
- **Organization Support**: Multi-tenant organization management with invitations
- **Admin Panel**: Administrative endpoints for user and organization management
- **OpenAPI Integration**: Auto-generated API documentation and reference

### Developer Experience
- **TypeScript**: Full TypeScript implementation with strict type safety
- **Dependency Injection**: Clean architecture with TSyringe IoC container
- **Testing**: Comprehensive E2E test suite with Jest (28+ tests)
- **Email Mocking**: Automated email service mocking for development and testing
- **Hot Reload**: Development server with automatic restart via tsx
- **Better Auth CLI**: Database migrations and schema generation

### Production Ready
- **Environment Configuration**: Comprehensive environment variable validation
- **Database Migrations**: Automated schema management with Better Auth CLI
- **CORS Support**: Configurable CORS for frontend integration
- **Error Handling**: Structured error responses and logging
- **Security**: Trusted origins, secure session handling, and token validation

---

## Prerequisites
- Node.js 18.x or later
- Yarn (recommended) or npm
- PostgreSQL (running and accessible)
- [Optional] Resend API key for email functionality

---

## Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/better-auth-idp.git
cd better-auth-idp

# Install dependencies
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:
```bash
cp .env.example .env  # If you have an example file
# OR create manually:
touch .env
```

Edit `.env` with your configuration:
```env
# Server Configuration
PORT=3000

# Better Auth Configuration
AUTH_SECRET=your-secure-auth-secret-key-here
BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/better_auth

# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=auth@yourdomain.com

# Frontend Configuration
FE_URL=http://localhost:8080

# Optional: Trusted Origins (comma-separated)
TRUSTED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### 3. Database Setup
```bash
# Generate migration files
yarn cli:generate

# Apply migrations to database
yarn cli:migrate
```

### 4. Start Development Server

```bash
yarn dev
```

- **Server**: Runs on [http://localhost:3000](http://localhost:3000)
- **Auth Endpoints**: All `/api/auth/*` endpoints available
- **API Reference**: [http://localhost:3000/api/auth/reference](http://localhost:3000/api/auth/reference)
- **OpenAPI Docs**: Auto-generated documentation for all endpoints

---

## Project Structure

### Available Scripts

```bash
# Development
yarn dev              # Start development server with hot reload
yarn build            # Compile TypeScript to JavaScript
yarn start            # Run production build

# Database Management
yarn cli:generate     # Generate Better Auth migration files
yarn cli:migrate      # Apply migrations to database (auto-confirm)

# Testing
yarn test             # Run all tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Run tests with coverage report

# Type Checking
yarn typecheck        # Run TypeScript type checking
```

### Directory Structure

```
better-auth-idp/
├── src/
│   ├── auth.config.ts              # Better Auth configuration
│   ├── server.ts                   # Express server setup
│   ├── infrastructure/
│   │   └── interfaces/             # TypeScript interfaces
│   │       ├── IAuthService.ts     # Auth service interface
│   │       ├── IConfigService.ts   # Config service interface
│   │       └── IEmailService.ts    # Email service interface
│   └── services/
│       ├── AuthService.ts          # Better Auth service implementation
│       ├── ConfigService.ts        # Environment configuration service
│       └── EmailService.ts         # Email service with Resend integration
├── test/
│   ├── setup.js                    # Test configuration and mocking
│   ├── mocks/
│   │   └── EmailService.mock.js    # Email service mock for testing
│   └── e2e/
│       ├── auth-flow.test.js       # Authentication flow tests (7 tests)
│       ├── error-cases.test.js     # Error handling tests (9 tests)
│       ├── email-verification.test.js # Email service tests (9 tests)
│       ├── metadata-endpoints.test.js # JWKS & reference tests (2 tests)
│       └── token-validation.test.js   # JWT validation tests (1 test)
├── dist/                           # Compiled JavaScript output
├── coverage/                       # Test coverage reports
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── jest.config.js                  # Jest testing configuration
└── README.md                       # This file
```

### Dependencies

**Core Dependencies:**
- `better-auth` ^1.2.8 - Authentication framework with plugins
- `express` ^4.18.2 - Web server framework
- `cors` ^2.8.5 - CORS middleware for cross-origin requests
- `pg` ^8.16.0 - PostgreSQL client for database operations
- `resend` ^4.6.0 - Email service for verification and password reset
- `dotenv` ^16.3.1 - Environment variable management
- `tsyringe` ^4.10.0 - Dependency injection container
- `jose` ^6.0.11 - JWT operations and validation
- `jsonwebtoken` ^9.0.2 - JWT token handling
- `swagger-jsdoc` ^6.2.8 - OpenAPI documentation generation
- `swagger-ui-express` ^5.0.1 - API documentation UI
- `reflect-metadata` ^0.2.2 - Metadata reflection for decorators

**Development Dependencies:**
- `tsx` ^4.7.1 - TypeScript execution engine for development
- `jest` ^29.7.0 - Testing framework with ES module support
- `supertest` ^7.1.1 - HTTP testing library for API tests
- `@types/*` - TypeScript type definitions for all dependencies
- `nodemon` ^3.1.10 - Development server with auto-restart
- `ts-jest` ^29.4.0 - Jest TypeScript preprocessor

### Authentication Endpoints

All authentication endpoints are handled by Better Auth with comprehensive plugin support:

**Core Authentication:**
- `POST /api/auth/sign-up/email` - User registration with email verification
- `POST /api/auth/sign-in/email` - User login with email/password
- `POST /api/auth/sign-out` - User logout and session termination
- `GET /api/auth/session` - Get current user session
- `POST /api/auth/update-user` - Update user profile information

**Token Management:**
- `GET /api/auth/token` - Exchange session for JWT token
- `GET /api/auth/jwks` - JSON Web Key Set for token verification
- `POST /api/auth/bearer-token` - Generate Bearer tokens

**Password Management:**
- `POST /api/auth/forget-password` - Request password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/change-password` - Change password (authenticated)

**Email Verification:**
- `POST /api/auth/send-verification-email` - Send verification email
- `POST /api/auth/verify-email` - Verify email with token

**Organization Management:**
- `POST /api/auth/organization/create` - Create new organization
- `POST /api/auth/organization/invite-member` - Invite organization member
- `GET /api/auth/organization/list-members` - List organization members
- `POST /api/auth/organization/remove-member` - Remove organization member
- `POST /api/auth/organization/set-active` - Set active organization

**Admin Endpoints:**
- `GET /api/auth/admin/list-users` - List all users (admin only)
- `GET /api/auth/admin/list-sessions` - List user sessions (admin only)
- `POST /api/auth/admin/revoke-session` - Revoke user session (admin only)
- `POST /api/auth/admin/impersonate` - Impersonate user (admin only)

**Metadata & Documentation:**
- `GET /api/auth/reference` - Interactive API reference and documentation
- `GET /api/auth/openapi.json` - OpenAPI specification

### Email Integration

The IdP includes email verification and password reset functionality using Resend:

- **Email Verification**: Automatic email sending on user registration
- **Password Reset**: Email-based password reset flow
- **Test Mode**: Email functions are mocked during testing

### Testing

The project includes comprehensive testing with organized test suites:

**Test Structure:**
```
test/
├── .env.test                    # Test environment variables
├── setup.js                    # Shared test utilities and mocking
└── e2e/                        # End-to-end test suites
    ├── auth-flow.test.js           # Authentication flow (7 tests)
    ├── metadata-endpoints.test.js   # JWKS & reference endpoints (2 tests)
    ├── error-cases.test.js         # Error handling scenarios (9 tests)
    ├── token-validation.test.js    # JWT structure validation (1 test)
    └── email-verification.test.js  # Email service configuration (9 tests)
```

**Test Types:**
- **E2E Tests**: Full authentication flow testing (28 tests total)
- **Unit Tests**: Email service and configuration testing
- **Integration Tests**: Database and API endpoint testing
- **Error Testing**: Comprehensive error case coverage

**Test Features:**
- **Modular Organization**: Split test files by functionality
- **Shared Setup**: Centralized test utilities and server management
- **Email Mocking**: Uses `jest.unstable_mockModule()` for ES module mocking
- **Environment Isolation**: Separate `.env.test` configuration
- **TypeScript Support**: Full ES module and TypeScript compatibility
- **Database Management**: Automatic setup/teardown with connection pooling

**Run Tests:**
```bash
yarn test                    # Run all tests (28 tests across 5 suites)
yarn test:watch              # Watch mode
yarn test:coverage           # With coverage report
yarn test --verbose          # Detailed test output
```

**Individual Test Suites:**
```bash
yarn test test/e2e/auth-flow.test.js           # Authentication flow tests
yarn test test/e2e/error-cases.test.js         # Error handling tests
yarn test test/e2e/metadata-endpoints.test.js  # JWKS endpoint tests
yarn test test/e2e/token-validation.test.js    # JWT validation tests
yarn test test/e2e/email-verification.test.js  # Email service tests
```

### Environment Configuration

The IdP supports environment-based configuration with dedicated test setup:

**Development/Production (.env):**
- Email verification enabled
- Full email sending via Resend
- Debug logging enabled
- Production database

**Testing (.env.test):**
```env
NODE_ENV=test
DATABASE_URL=postgresql://mravinale:postgres@localhost:5432/better-auth-test
AUTH_SECRET=test-secret
BASE_URL=http://localhost:3000
RESEND_API_KEY=test-key
FROM_EMAIL=test@resend.dev
```

**Test Environment Features:**
- Email verification disabled automatically
- Mock email functions via `jest.unstable_mockModule()`
- Separate test database for isolation
- Consistent AUTH_SECRET to prevent JWT key issues
- Reduced logging for cleaner test output

---

## API Server Details

### Available Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/protected` - Protected endpoint (requires Bearer token)

### API Documentation

Interactive API documentation is available at: [http://localhost:3005/docs](http://localhost:3005/docs)

---

## End-to-End (E2E) Testing

The E2E tests are organized into focused test suites covering the complete authentication system:

### Test Coverage

**Authentication Flow Tests (auth-flow.test.js):**
- User registration with email verification (mocked)
- Session cookie management
- JWT token generation and exchange
- Sign-in and sign-out flow
- Session validation

**Error Cases Tests (error-cases.test.js):**
- Missing email/password validation
- Invalid credentials handling
- Duplicate user registration
- Unauthorized access attempts
- Token validation errors

**Metadata Endpoints Tests (metadata-endpoints.test.js):**
- JWKS (JSON Web Key Set) endpoint
- Better Auth reference endpoint
- Key structure validation

**Token Validation Tests (token-validation.test.js):**
- JWT structure verification
- Header and payload validation
- Timestamp verification
- Claims validation

**Email Verification Tests (email-verification.test.js):**
- Email service configuration
- Mock function validation
- Environment-based settings
- Dependency verification

### Running E2E Tests

**From IdP directory:**
```bash
cd IdP
yarn test                    # Run all 28 tests across 5 suites
yarn test:watch              # Run in watch mode
yarn test --verbose          # Detailed output with test names
```

**Run specific test suites:**
```bash
yarn test test/e2e/auth-flow.test.js           # 7 authentication tests
yarn test test/e2e/error-cases.test.js         # 9 error handling tests
yarn test test/e2e/metadata-endpoints.test.js  # 2 endpoint tests
yarn test test/e2e/token-validation.test.js    # 1 JWT validation test
yarn test test/e2e/email-verification.test.js  # 9 email configuration tests
```

**From API directory:**
```bash
cd Api
yarn test
```

This will:
- Start both IdP and API servers automatically
- Wait for health checks
- Run comprehensive API integration test suite
- Clean up processes

### Test Features

- **Isolated Test Environment**: Each test suite runs with fresh server instances
- **Automatic Mocking**: Email services automatically mocked using Jest
- **Database Isolation**: Tests use separate test database configuration
- **TypeScript Support**: Full ES module compatibility with TypeScript source files
- **Parallel Execution**: Jest runs test suites in parallel for faster execution
- **Comprehensive Coverage**: 28 tests covering authentication, errors, JWT, and email functionality

---

## Architecture Notes

### Authentication Flow
1. **Registration**: User signs up via IdP, receives email verification
2. **Verification**: User clicks email link to verify account
3. **Login**: User signs in to receive session cookie
4. **Token Exchange**: Session can be exchanged for JWT
5. **API Access**: JWT used to access protected endpoints

### Database Schema
- Uses Better Auth's automatic schema generation
- PostgreSQL with connection pooling
- Migrations handled by Better Auth CLI
- Tables: user, session, account, verification

### Security Features
- CORS configuration for frontend integration
- JWT with Ed25519 signing
- Session management with secure cookies
- Environment variable validation
- Trusted origins configuration

---

## Troubleshooting

### Common Issues

**Database Connection:**
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env
- Check database permissions

**Email Issues:**
- Verify RESEND_API_KEY is valid
- Check FROM_EMAIL domain configuration
- Ensure domain is verified in Resend

**JWT Issues:**
- Verify AUTH_SECRET consistency
- Check database key encryption
- Validate JWKS endpoint accessibility

**Test Failures:**
- Ensure test database exists and is accessible
- Check `.env.test` file exists with correct configuration
- Verify NODE_ENV=test is set in test environment
- Ensure TypeScript source files exist (`.ts` not `.js`)
- Check email mocking setup uses `jest.unstable_mockModule()`
- Verify import paths are correct for test file organization
- Ensure AUTH_SECRET consistency between dev and test environments

### Logs and Debugging

**Development Logs:**
- IdP: Console output with Better Auth debugging
- API: Express server logs

**Test Logs:**
- Jest output with test results and detailed test names
- Mocked email service logs
- Database connection status
- Individual test suite execution details

**Test Debugging:**
```bash
# Run specific test suite with verbose output
yarn test test/e2e/auth-flow.test.js --verbose

# Run tests with coverage to identify gaps
yarn test:coverage

# Debug test environment issues
yarn test --detectOpenHandles --forceExit
```

---

## Production Deployment

### Environment Setup
1. Set production environment variables
2. Configure production database
3. Set up email service (Resend)
4. Configure trusted origins
5. Build TypeScript: `yarn build`
6. Start: `yarn start`

### Security Considerations
- Use strong AUTH_SECRET (32+ characters)
- Configure HTTPS in production
- Set appropriate CORS origins
- Use environment-specific database
- Enable email verification

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run test suite: `yarn test`
5. Submit pull request

---

For more details, see the individual project directories and code comments. If you encounter issues or want to extend functionality, please open an issue or PR!