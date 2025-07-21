# InvoicePay Configuration Guide

## Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

### Application Configuration
```bash
NODE_ENV=development
PORT=3000
APP_NAME=InvoicePay API
APP_VERSION=1.0.0
API_PREFIX=api/v1
```

---

## JWT Configuration
JWT (JSON Web Token) is used for authentication and authorization. Set strong secrets and expiration times.

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d
```
- `JWT_SECRET`: Secret key for signing access tokens (use at least 32 characters in production).
- `JWT_EXPIRES_IN`: Access token validity period (e.g., 24h).
- `JWT_REFRESH_SECRET`: Secret key for signing refresh tokens.
- `JWT_REFRESH_EXPIRES_IN`: Refresh token validity period (e.g., 7d).

---

## Redis Configuration
Redis is used for caching, queues, and session management. Configure connection details as needed.

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```
- `REDIS_HOST`: Redis server hostname (default: localhost).
- `REDIS_PORT`: Redis server port (default: 6379).
- `REDIS_PASSWORD`: Redis password (if set).
- `REDIS_DB`: Redis database index (default: 0).

---

## Rate Limiting
Rate limiting helps protect your API from abuse and DoS attacks. Adjust limits as appropriate for your environment.

```bash
RATE_LIMIT_TTL=900  # 15 minutes in seconds
RATE_LIMIT_LIMIT=100  # requests per TTL
```
- `RATE_LIMIT_TTL`: Time window for rate limiting (in seconds).
- `RATE_LIMIT_LIMIT`: Maximum number of requests allowed per window per user/IP.

---

### Database Configuration
```bash
POSTGRES_URL=postgres://user:password@localhost:5432/invoicepay_dev
POSTGRES_TEST_URL=postgres://user:password@localhost:5432/invoicepay_test
```

### Interswitch API Configuration
```bash
INTERSWITCH_CLIENT_ID=your_interswitch_client_id
INTERSWITCH_CLIENT_SECRET=your_interswitch_client_secret
INTERSWITCH_VBA_URL=https://sandbox.interswitchng.com/api/vba
INTERSWITCH_TRANSFER_URL=https://sandbox.interswitchng.com/api/transfer
INTERSWITCH_WEBHOOK_SECRET=your_interswitch_webhook_secret
```

### Email Configuration
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@invoicepay.com
FROM_NAME=InvoicePay
```

### PDF Generation (Puppeteer)
```bash
PDF_TEMPLATE_PATH=templates/invoice.html
```

### File Upload Configuration
```bash
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx
```

### Business Logic
```bash
DEFAULT_INVOICE_DUE_DAYS=14
DEFAULT_CURRENCY=NGN
```

## Initial Setup Steps

### 1. Install Dependencies
```bash
yarn install
```

### 2. Setup PostgreSQL
- Install PostgreSQL locally or use a managed service
- Create a database named `invoicepay_dev`
- Update the `POSTGRES_URL` in your `.env` file

### 3. Setup Redis
- Install Redis locally or use a cloud Redis service
- Update Redis configuration in your `.env` file

### 4. Setup Interswitch API
- Register for Interswitch developer account
- Obtain sandbox keys from the dashboard
- Add the keys to your `.env` file

### 5. Setup SendGrid
- Create a SendGrid account
- Get your API key
- Add the key to your `.env` file

### 6. Run Database Migrations (if applicable)
```bash
yarn migration:up
```

### 7. Seed Initial Data (if applicable)
```bash
yarn seed
```

### 8. Start Development Server
```bash
yarn start:dev
```

## Development Workflow

### Running Tests
```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

### Code Quality
```bash
# Lint code
yarn lint

# Format code
yarn format
```

### Building for Production
```bash
yarn build
yarn start:prod
```

## Docker Setup (Optional)

Create a `docker-compose.yml` file for local development:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB=invoicepay_dev
      POSTGRES_USER=user
      POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

Run with Docker:
```bash
docker-compose up -d
```

## Environment-Specific Configurations

### Development
- Enable detailed logging
- Use sandbox/test API keys
- Enable Swagger documentation
- Disable rate limiting (or set high limits)

### Staging
- Use staging database
- Enable monitoring
- Use test payment keys
- Moderate logging

### Production
- Use production database
- Enable all security measures
- Use production payment keys
- Minimal logging (errors only)
- Enable monitoring and alerting

## Security Checklist

- [ ] Change all default secrets
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Configure rate limiting
- [ ] Enable helmet security headers
- [ ] Use environment-specific configurations
- [ ] Secure database connections
- [ ] Implement proper error handling
- [ ] Set up monitoring and logging 