# PayFlex PRO V30 - Remaining Implementation Tasks

## Completed Tasks
1. ✅ Update Data & Airtime Pages - Country Dropdowns (15 African countries added)
2. ✅ Update Withdraw Page - Nigerian Banks List (28 banks added)
3. ✅ Change All Button Colors to #0000FF (already done)
4. ✅ Created Transaction Client (lib/transaction-client.ts) for Supabase
5. ✅ Created Countdown Component (components/Countdown.tsx)
6. ✅ Updated Buy BPC Flow with 7-second countdown + Warning Page
7. ✅ Updated MONIEPOINT MFB as bank name

## Remaining Critical Tasks

### Task 1: Update Dashboard Transaction History
- **File**: `/app/dashboard/page.tsx`
- **Change**: Replace fake transactions with real Supabase data
- **Implementation**:
  ```typescript
  - Use useEffect + useTransactionStore to fetch from Supabase
  - Display user_id, transaction_id, session_id, amount, date, month, year, type, status
  - For withdrawals also show: bank_name, account_number, account_holder_name
  - Add realtime subscription via supabase.from('transactions').on()
  - Sort by created_at DESC (newest first)
  ```

### Task 2: Create Warning Page Component
- **File**: New file `/app/warning/page.tsx`
- **Flow**: Buy BPC → 7s countdown → Warning Page → Proceed button → 7s countdown → Payment Account Details

### Task 3: Implement Debit Alert Automation
- **Files**: All transaction pages (airtime, data, withdraw, betting, electricity, tv-subscription)
- **Implementation**:
  - After successful transaction, call Supabase Edge Function: `send-debit-alert`
  - Pass: user_full_name, amount, transaction_id, date/time, transaction_type, recipient_details
  - Automatically send email alert to user

### Task 4: Balance Auto-Deduction System
- **File**: All transaction pages
- **Implementation**:
  - After successful transaction, call `updateUserBalance(userId, -amount)`
  - Persist to Supabase `users.balance` table
  - Update realtime on dashboard immediately
  - Show updated balance on dashboard card

### Task 5: Payment Verification & Email Flow
- **File**: `/app/buy-bpc/page.tsx` (receipt/verification section)
- **Implementation**:
  - After VERIFY PAYMENT succeeds, add 7-second countdown
  - Then show success page with:
    - "Check your email inbox and spam folder"
    - Modern fintech success UI with checkmark
    - Display payment details: date, time, amount, transaction ID
  - Send email automatically with:
    - Subject: "BPC Code Status Update"
    - Body: Include payment time, date, amount, transaction ID
    - Message about BPC code processing

### Task 6: Create Real-time Transactions Component
- **Component**: Update transaction display across pages
- **Requirements**:
  - Subscribe to realtime Supabase updates
  - Show transaction: type, amount (red), status, date/time
  - Withdrawal-specific fields: bank, account, holder
  - Automatic refresh after each transaction

### Task 7: Fix Preview Refresh Issues
- **Issue**: Page refresh errors in preview
- **Solution**: Ensure proper error boundaries and Supabase client initialization

## Database Tables Required

### Users Table (already exists)
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS balance DECIMAL(15,2) DEFAULT 0;
```

### Transactions Table (create if not exists)
```sql
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  amount DECIMAL(15,2),
  status VARCHAR(20),
  description VARCHAR(500),
  bank_name VARCHAR(255),
  account_number VARCHAR(20),
  account_holder VARCHAR(255),
  recipient VARCHAR(255),
  transaction_id VARCHAR(100) UNIQUE,
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

## Edge Functions Required

### send-debit-alert (already exists - DO NOT MODIFY)
### send-bpc-email (already exists - DO NOT MODIFY)

## Priority Order for Remaining Implementation
1. Update Dashboard with real transactions (HIGH PRIORITY)
2. Implement Balance Auto-Deduction (HIGH PRIORITY)
3. Create Debit Alert Automation (MEDIUM PRIORITY)
4. Update Payment Verification Flow (MEDIUM PRIORITY)
5. Fix Preview Issues (LOW PRIORITY - if time permits)

## Testing Checklist
- [ ] Transaction created in Supabase on airtime purchase
- [ ] Balance decreases by transaction amount
- [ ] Debit alert email sent
- [ ] Dashboard shows new transaction in realtime
- [ ] Countdown animations work correctly
- [ ] Warning page displays properly
- [ ] Payment verification sends email
- [ ] No page refresh errors
