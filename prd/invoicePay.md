# InvoicaPay – Smart Invoicing & Payment Gateway for SMEs and Freelancers

## Introduction
InvoicaPay is a platform designed to help businesses and freelancers create, send, and manage professional invoices, accept payments, and manage their earnings through a secure wallet system. The platform leverages Interswitch APIs for account creation, fund transfer, and payment processing.

## Features
- **User Management**: Register/login with email and phone (OTP verification), password reset, email verification, business onboarding with KYC.
- **Invoice Management**: Create/manage invoices, add line items, set due dates, generate shareable links, downloadable PDFs (Puppeteer), track status (Draft, Sent, Paid, Overdue, Cancelled).
- **Payment Handling**: Generate virtual accounts (Interswitch VBA API), receive/reconcile payments via webhooks.
- **Wallet System**: Maintain wallet balances, track transactions, allow withdrawals (Transfer API).
- **Admin Panel**: Monitor businesses, transactions, invoices, suspend/reactivate businesses, view system logs.

## Requirements
### Functional
- User registration/login with OTP
- Business onboarding with KYC
- Invoice creation, sharing, and PDF generation
- Payment collection and reconciliation
- Wallet management and withdrawals
- Admin monitoring and controls

### Non-Functional
- Scalability: 10k+ users, queue-based webhook handling
- Performance: API < 300ms, Webhook < 2s
- Security: JWT + 2FA, HTTPS, Data encryption
- Maintainability: Modular NestJS, environment-configurable
- Monitoring: Prometheus + Grafana

## Architecture Overview
- **Backend**: NestJS (modular, scalable)
- **Database**: PostgreSQL (secure, production-ready)
- **Queue**: For webhook/event handling
- **PDF Rendering**: Puppeteer (HTML to PDF)
- **Monitoring**: Prometheus, Grafana
- **Deployment**: CI/CD, Redis, HTTPS, environment configs

## API & Integrations
- **Interswitch APIs**:
  - Virtual Account Creation
  - Transfer API
  - Webhook (Transaction Notification)
- **Optional**:
  - Email (SendGrid)
  - PDF Generation (Puppeteer)

## Database Schema (ERD Summary)
- **User**: id, email, password, role, business_id
- **Business**: id, name, rc_number, vba_account_number, ...
- **Invoice**: id, ref, business_id, amount, status, due_date, ...
- **InvoiceItem**: id, invoice_id, name, qty, price, tax
- **Wallet**: id, business_id, balance
- **WalletTransaction**: id, type, amount, ref, status
- **PayoutRequest**: id, business_id, amount, bank_details, status

## Setup & Deployment
- **Development**: `.env.development`, sandbox keys
- **Production**: `.env.production`, CI/CD, Redis, PostgreSQL, HTTPS

## Testing
- Unit tests (90%+ coverage)
- Integration tests (webhook, transfers)
- Manual UAT (edge cases: failed payout, double invoice, etc.)

## Roadmap (Agile Phases)
- **Phase 1 (2 weeks)**: Auth, Business Onboarding, Invoice UI
- **Phase 2 (2 weeks)**: Payment Integration, Wallet Setup
- **Phase 3 (1 week)**: Withdrawal Flow, Admin Panel
- **Phase 4 (1 week)**: Testing, Optimization, Deployment

## Success Metrics
- 1,000+ invoices sent in first 30 days
- 95% successful invoice payment match rate
- <1% failed payout rate
- Business activation time < 10 mins
