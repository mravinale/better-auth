# Better Auth Monorepo

A robust authentication and authorization demo using Better Auth, Express, PostgreSQL, and TypeScript.

This monorepo contains two main projects:

- **Api/**: An Express-based API server with protected endpoints and health checks
- **IdP/**: The Identity Provider using Better Auth, handling all `/api/auth/*` endpoints and user/session management

---

## Features

### Authentication & Authorization
- User registration and login with email & password (via Better Auth)
- Email verification with Resend integration
- Password reset functionality
- JWT token generation and validation
- Session management with PostgreSQL storage
- CORS support for frontend integration

### Developer Experience
- **TypeScript**: Full TypeScript implementation with type safety
- **Testing**: Comprehensive E2E and unit tests with Jest
- **Email Mocking**: Automated email service mocking for tests
- **Hot Reload**: Development server with automatic restart on changes
- **API Documentation**: Swagger/OpenAPI integration

### Production Ready
- Environment-based configuration
- Database migrations with Better Auth CLI
- Error handling and logging
- Health check endpoints

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
git clone https://github.com/yourusername/better-auth.git
cd better-auth

# Install dependencies for both projects
cd Api && yarn install
cd ../IdP && yarn install
cd ..
```

### 2. Configure Environment Variables

**IdP Configuration:**
```bash
cd IdP
cp .env.example .env
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
cd IdP

# Generate migration files
yarn cli:generate

# Apply migrations to database
yarn cli:migrate
```

### 4. Start Development Servers

**Start the IdP (Identity Provider):**
```bash
cd IdP
yarn dev
```
- Runs on [http://localhost:3000](http://localhost:3000)
- Handles all `/api/auth/*` endpoints

**Start the API:**
```bash
cd Api
yarn dev
```
- Runs on [http://localhost:3005](http://localhost:3005)
- Provides `/api/health` and `/api/protected` endpoints

---

## IdP (Identity Provider) Details

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

### Dependencies

**Core Dependencies:**
- `better-auth` ^1.2.8 - Authentication framework
- `express` ^4.18.2 - Web server framework
- `cors` ^2.8.5 - CORS middleware
- `pg` ^8.16.0 - PostgreSQL client
- `resend` ^4.6.0 - Email service
- `dotenv` ^16.3.1 - Environment variable loader

**Development Dependencies:**
- `typescript` ^5.3.3 - TypeScript compiler
- `tsx` ^4.7.1 - TypeScript execution engine
- `jest` ^29.7.0 - Testing framework
- `supertest` ^7.1.1 - HTTP testing library
- `@types/*` - TypeScript type definitions

### Authentication Endpoints

All authentication endpoints are handled by Better Auth:

- `POST /api/auth/sign-up/email` - User registration with email verification
- `POST /api/auth/sign-in/email` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/token` - Exchange session for JWT
- `GET /api/auth/jwks` - JSON Web Key Set
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Email Integration

The IdP includes email verification and password reset functionality using Resend:

- **Email Verification**: Automatic email sending on user registration
- **Password Reset**: Email-based password reset flow
- **Test Mode**: Email functions are mocked during testing

### Testing

The project includes comprehensive testing:

**Test Types:**
- **E2E Tests**: Full authentication flow testing
- **Unit Tests**: Email service and configuration testing
- **Integration Tests**: Database and API endpoint testing

**Test Features:**
- Automatic email service mocking
- Environment-based configuration
- Database transaction isolation
- JWT token validation
- Error case coverage

**Run Tests:**
```bash
yarn test                    # Run all tests
yarn test:watch              # Watch mode
yarn test:coverage           # With coverage
```

### Environment Configuration

The IdP supports environment-based configuration:

**Development/Production:**
- Email verification enabled
- Full email sending via Resend
- Debug logging enabled

**Testing:**
- Email verification disabled
- Mock email functions
- Separate test database
- Reduced logging

---

## API Server Details

### Available Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/protected` - Protected endpoint (requires Bearer token)

### API Documentation

Interactive API documentation is available at: [http://localhost:3005/docs](http://localhost:3005/docs)

---

## End-to-End (E2E) Testing

The E2E tests cover the complete authentication flow:

### Test Coverage
- User registration with email verification
- Sign-in and session management
- JWT token exchange and validation
- Protected endpoint access
- Error cases and validation
- JWKS endpoint functionality

### Running E2E Tests

**From API directory:**
```bash
cd Api
yarn test
```

This will:
- Start both IdP and API servers automatically
- Wait for health checks
- Run comprehensive test suite
- Clean up processes

**From IdP directory:**
```bash
cd IdP
yarn test
```

This runs:
- Authentication flow tests
- Email service tests
- Configuration validation tests

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
- Ensure test database exists
- Check NODE_ENV=test configuration
- Verify email mocking setup

### Logs and Debugging

**Development Logs:**
- IdP: Console output with Better Auth debugging
- API: Express server logs

**Test Logs:**
- Jest output with test results
- Mocked email service logs
- Database connection status

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