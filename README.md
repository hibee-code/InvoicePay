
# InvoicePay – Backend API

InvoicePay is a modular, production-ready backend for smart invoicing, payments, and wallet management for SMEs and freelancers. Built with NestJS, PostgreSQL, and scalable best practices.

## Features
- User registration/login (email, phone, OTP)
- Password reset, email verification
- Business onboarding with KYC
- Invoice creation, sending, PDF generation
- Interswitch Virtual Account API integration
- Payment webhook handling
- Wallet system (balance, transaction tracking)
- Admin panel (monitoring, business management)
- JWT authentication, modular architecture

## Getting Started

### Prerequisites
- Node.js v16+
- PostgreSQL
- Redis (optional, for queues)

### Installation
```bash
yarn install
```

### Environment Setup
Create a `.env` file in the project root:
```
NODE_ENV=development
PORT=3000
DB_NAME=invoicepay
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@invoicepay.com
FROM_NAME=InvoicePay
INTERSWITCH_CLIENT_ID=your_interswitch_client_id
INTERSWITCH_CLIENT_SECRET=your_interswitch_client_secret
INTERSWITCH_VBA_URL=https://sandbox.interswitchng.com/api/vba
INTERSWITCH_WEBHOOK_SECRET=your_webhook_secret
JWT_SECRET=your_jwt_secret
```

### Database Setup
Create the database and run migrations:
```bash
yarn migration:up
```

### Running the App
```bash
yarn start:dev
```

## API Endpoints

### Authentication
- `POST /auth/register` – Register new user
- `POST /auth/login` – Login user
- `POST /auth/verify-otp` – Verify OTP
- `POST /auth/reset-password` – Reset password

### Business
- `POST /business/onboard` – Onboard new business (KYC)
- `GET /business/profile/:id` – Get business profile

### Invoice
- `POST /invoice` – Create invoice
- `GET /invoice/:id` – Get invoice by ID
- `GET /invoice/business/:businessId` – List invoices for business
- `POST /invoice/:id/send` – Send invoice (email/PDF)
- `GET /invoice/:id/pdf` – Download invoice PDF

### Payment
- `POST /payment/virtual-account` – Generate virtual account
- `POST /payment/webhook` – Handle payment notification

### Wallet
- `GET /wallet/:businessId` – Get wallet balance
- `GET /wallet/transactions/:walletId` – List wallet transactions

### Admin
- `GET /admin/businesses` – List all businesses
- `PATCH /admin/business/:id/suspend` – Suspend business
- `PATCH /admin/business/:id/reactivate` – Reactivate business
- `GET /admin/logs` – View system logs

## Testing
```bash
yarn test
yarn test:e2e
yarn test:cov
```

## Deployment
- Build: `yarn build`
- Start: `yarn start:prod`
- Use Docker or CI/CD for production deployment

## Security & Production
- All sensitive endpoints require JWT
- Webhook requests validated by secret
- Environment variables for all credentials
- Modular, scalable codebase

## Contributing
PRs and issues welcome! See the code for modular structure and best practices.

## License
MIT
