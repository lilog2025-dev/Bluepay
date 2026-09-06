# Supabase Setup Guide for PayFlex

This guide helps you set up Supabase for transaction logging and debit alerts in the PayFlex application.

## Prerequisites

- Supabase account (https://supabase.com)
- Project created in Supabase
- Environment variables configured in Vercel

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Add Environment Variables

Add these to your Vercel project settings (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app
```

## Step 3: Create Database Tables

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `supabase/migrations/001_create_transactions_table.sql`
5. Click "Run"

### Option B: Using Supabase CLI

```bash
supabase db push
```

## Step 4: Set Up Row Level Security (RLS)

For security, enable RLS on the tables:

### For `transactions` table:

1. Go to Authentication → Policies
2. Create a policy:
   - **Name**: `Allow users to view own transactions`
   - **Action**: SELECT
   - **For Role**: authenticated
   - **Policy Expression**: `(SELECT auth.uid())::text = email`

### For `debit_alerts` table:

1. Create a policy:
   - **Name**: `Allow users to view own alerts`
   - **Action**: SELECT
   - **For Role**: authenticated
   - **Policy Expression**: `(SELECT auth.uid())::text = email`

## Step 5: Verify Integration

After setup, test the integration:

1. Navigate to any transaction page (Withdraw, Betting, TV Subscription, etc.)
2. Complete a transaction
3. Check the Supabase SQL Editor:
   ```sql
   SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;
   SELECT * FROM debit_alerts ORDER BY sent_at DESC LIMIT 10;
   ```

## Troubleshooting

### Transactions not being logged?

1. Check environment variables are set correctly
2. Verify Supabase URL and key are valid
3. Check browser console for errors
4. Ensure tables exist in Supabase

### Debit alerts not being sent?

1. The system currently logs alerts to console
2. To send actual emails, integrate an email service:
   - **Resend**: `npm install resend`
   - **SendGrid**: `npm install @sendgrid/mail`
   - Update `/app/api/send-debit-alert/route.ts` with your email service

## Email Service Integration (Optional)

### Using Resend

1. Install: `npm install resend`
2. Get API key from https://resend.com
3. Add `RESEND_API_KEY` to environment variables
4. Update `send-debit-alert/route.ts`:

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// In your POST handler:
const { data, error } = await resend.emails.send({
  from: 'noreply@PayFlex.com',
  to: email,
  subject: `PayFlex Transaction Alert - ₦${parseFloat(amount).toLocaleString()}`,
  html: `<h2>Transaction Alert</h2><p>Amount: ₦${amount}</p>`,
})
```

## API Endpoints

### Log Transaction

**POST** `/api/transactions`

```json
{
  "userEmail": "user@example.com",
  "fullName": "John Doe",
  "amount": "5000",
  "type": "withdraw",
  "description": "Withdrawal to bank account"
}
```

### Get Transaction History

**GET** `/api/transactions?email=user@example.com`

Returns array of transactions for the user.

### Send Debit Alert

**POST** `/api/send-debit-alert`

```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "amount": "5000",
  "type": "withdraw",
  "transactionCode": "BPC2026_PRO_V30_650"
}
```

## Next Steps

1. Integrate transaction logging into each service page
2. Create a transaction history view on the dashboard
3. Add real email service integration
4. Implement transaction filters and search

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs
- PayFlex GitHub Issues: [your-repo-url]
