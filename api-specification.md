# API Specification – InvoicePay

## Authentication
- **POST /auth/register**: Register new user
- **POST /auth/login**: Login user
- **POST /auth/verify-otp**: Verify OTP
- **POST /auth/reset-password**: Reset password

## Business
- **POST /business/onboard**: Onboard new business (KYC)
- **GET /business/profile**: Get business profile

## Invoice
- **POST /invoice**: Create invoice
- **GET /invoice/:id**: Get invoice by ID
- **GET /invoice/business/:businessId**: List invoices for business
- **POST /invoice/:id/send**: Send invoice (email/link)
- **GET /invoice/:id/pdf**: Download invoice PDF

## Payment
- **POST /payment/virtual-account**: Generate virtual account
- **POST /payment/webhook**: Handle payment notification
- **GET /payment/status/:invoiceId**: Get payment status for invoice

## Wallet
- **GET /wallet**: Get wallet balance
- **GET /wallet/transactions**: List wallet transactions
- **POST /wallet/withdraw**: Request withdrawal

## Admin
- **GET /admin/businesses**: List all businesses
- **PATCH /admin/business/:id/suspend**: Suspend business
- **PATCH /admin/business/:id/reactivate**: Reactivate business
- **GET /admin/logs**: View system logs

## Authentication
- JWT required for all endpoints except /auth/* and /payment/webhook

## Response Format
```
{
  "success": true,
  "data": { ... },
  "message": "..."
}
``` 

Once you have created this file, your code and environment variables will be in sync for database connectivity. If you need help with the next step (such as running migrations or creating entities), let me know!