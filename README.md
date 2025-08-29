
 # InvoicePay

 InvoicePay is a production-ready fintech backend built with NestJS, TypeORM, and PostgreSQL. It provides secure, scalable, and auditable APIs for business onboarding, invoicing, payments, wallet management, withdrawals, and admin operations, with full compliance and monitoring.

 ## Features

 - **Authentication & Authorization**: JWT-based, secure endpoints for users and admins.
 - **Business Onboarding**: KYC-compliant onboarding, encrypted data, and business management.
 - **Invoice Management**: Create, send, and track invoices with PDF generation.
 - **Payment Processing**: Virtual account creation, payment webhooks, and external API integration (Interswitch).
 - **Wallet System**: Transactional wallet updates, withdrawal requests, and fund transfers.
 - **Admin Panel**: Approve/reject withdrawals, manage businesses, monitor system health.
 - **Audit Logging**: All critical actions are logged for compliance and traceability.
 - **Rate Limiting & Monitoring**: Global exception filter, Prometheus metrics, and request guards.
 - **Error Handling**: Centralized error management for robust API responses.

 ## Tech Stack

 - **NestJS** (v11+)
 - **TypeORM**
 - **PostgreSQL**
 - **SendGrid** (email)
 - **pdfkit** (PDF generation)
 - **prom-client** (Prometheus metrics)
 - **axios** (external API calls)

 ## Folder Structure

 ```
 src/
	 ├── app.*                # Main app bootstrap
	 ├── auth/                # Authentication module
	 ├── user/                # User management
	 ├── business/            # Business onboarding & management
	 ├── invoice/             # Invoice creation & tracking
	 ├── payment/             # Payment processing & virtual accounts
	 ├── wallet/              # Wallet, transactions, withdrawals
	 ├── admin/               # Admin panel & operations
	 ├── audit/               # Audit logging
	 ├── common/              # Filters, guards, monitoring
	 ├── config/              # Database & helpers
	 └── ...
 ```

 ## Getting Started

 ### Prerequisites
 - Node.js v18+
 - PostgreSQL

 ### Installation
 ```bash
 # Clone the repository
 git clone https://github.com/hibee-code/InvoicePay.git
 cd InvoicePay

 # Install dependencies
 npm install

 # Configure environment variables
 cp .env.example .env
 # Edit .env with your database and API keys
 ```

 ### Database Setup
 ```bash
 # Run migrations (if using TypeORM CLI)
 yarn typeorm migration:run
 ```

 ### Running the Application
 ```bash
 # Start the server
 yarn start:dev
 ```

 ### Testing
 ```bash
 # Run unit and e2e tests
 yarn run test
 yarn run test:e2e
 ```

 ## API Documentation
 - See `api-specification.md` for detailed endpoint documentation.
 - All endpoints follow RESTful standards and return consistent error formats.

 ## Compliance & Security
 - All sensitive operations are logged in the audit module.
 - KYC data is encrypted at rest.
 - Rate limiting and monitoring are enabled by default.
 - External API integrations are validated and secure.

 ## Monitoring
 - Prometheus metrics available at `/metrics` endpoint.

 ## Contributing
 Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

 ## License
 [MIT](LICENSE)

 ## Maintainers
 - hibee-code

