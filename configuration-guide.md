# Configuration Guide – InvoicePay

## Overview
This guide describes how to configure InvoicePay for development and production environments.

## Environment Variables
Create a `.env` file in the project root with the following variables:

```
# Common
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/invoicepay
JWT_SECRET=your_jwt_secret
INVOICEPAY_API_KEY=your_api_key

# Interswitch
INTERSWITCH_CLIENT_ID=your_client_id
INTERSWITCH_CLIENT_SECRET=your_client_secret
INTERSWITCH_VBA_URL=https://sandbox.interswitchng.com/api/vba
INTERSWITCH_TRANSFER_URL=https://sandbox.interswitchng.com/api/transfer

# Email
SENDGRID_API_KEY=your_sendgrid_key
```

## Development Setup
- Use `.env.development` for sandbox/testing keys
- Run database locally (PostgreSQL)
- Use local Redis for queues

## Production Setup
- Use `.env.production` with production keys
- Secure PostgreSQL instance
- Redis for queues
- Enable HTTPS
- Set up CI/CD for deployment

## Dependencies
- Node.js (v16+)
- PostgreSQL
- Redis
- Puppeteer (for PDF generation)
- SendGrid (for email)

## Monitoring
- Prometheus and Grafana for metrics and alerting 