## PayFlex PRO V30 - Supabase Integration Implementation Roadmap

### COMPLETED TASKS

1. **Balance Formatting Utility** ✅
   - Created `/lib/format-balance.ts` with:
     - `formatBalance(amount)` - Converts 250000 → "NGN250,000.00"
     - `parseBalance(formatted)` - Reverse conversion
   - Ensures consistent NGN format across all pages without spaces

2. **Wallet Utilities** ✅
   - Created `/lib/wallet.ts` with:
     - `ensureWalletExists(userId)` - Auto-creates wallet with 250K balance
     - `getWalletBalance(userId)` - Fetches current balance from Supabase
     - `deductWalletBalance(userId, amount)` - Deducts with balance check
     - `addWalletBalance(userId, amount)` - Adds balance (for rewards)
     - `recordTransaction()` - Records transaction to Supabase

3. **Dashboard Balance Display** ✅
   - Updated `/app/dashboard/page.tsx`:
     - Added `formatBalance` import
     - Updated both balance displays to use proper formatter
     - Removed spacing issues ("NGN " → "NGN250,000.00")

4. **Withdraw Page Integration** (IN PROGRESS)
   - Added imports: `formatBalance`, `deductWalletBalance`, `recordTransaction`
   - Added state: `userId`, `balance`

### REMAINING TASKS (PRIORITY ORDER)

1. **Complete Withdraw Page Integration**
   - Add useEffect to load userId and balance
   - Update handleConfirm to use Supabase wallet system
   - Update balance display to use formatBalance
   - Verify PayFlex Code validation and transaction recording

2. **Fix Airtime Purchase System**
   - `/app/airtime/page.tsx`:
     - Add `ensureWalletExists` on mount
     - Update handleConfirm to deduct from wallet
     - Record transaction in Supabase
     - Use formatBalance for displays

3. **Fix Data Purchase System**
   - `/app/data/page.tsx`:
     - Ensure selectedPlan validation
     - Deduct balance on success
     - Record transaction
     - Format balance displays

4. **Fix Betting System**
   - `/app/betting/page.tsx`:
     - Add wallet integration
     - Deduct balance on bet
     - Record transaction
     - Update Recent Transactions

5. **Fix Electricity System**
   - `/app/electricity/page.tsx`:
     - Add additional providers (Enugu EEDC, IKEDC, AEDC, EEDC, IBEDC, KAEDCO)
     - Add wallet deduction
     - Record transaction

6. **Fix TV Subscription**
   - `/app/tv/page.tsx`:
     - Verify PayFlex Code CODE is hidden (already done)
     - Add "BUY PayFlex Code" button linking to `/buy-PayFlex Code`
     - Deduct balance on subscription
     - Record transaction

7. **Fix Recent Transactions**
   - `/app/transactions/page.tsx`:
     - Fetch from Supabase transactions table
     - Order by created_at DESC
     - Display: type, amount, status, description, date

8. **Fix Earn More Page**
   - `/app/earn/page.tsx`:
     - Verify wallet loads correctly
     - Add reward to balance on claim
     - Record reward transaction
     - Make withdrawable immediately

9. **Auto-create Wallet on Login/Signup**
   - Update auth flow to call `ensureWalletExists`
   - Add to signup completion
   - Add to dashboard initial load

10. **Real-time Sync**
    - Implement Supabase subscriptions for:
      - Balance changes
      - Transaction updates
    - Update dashboard instantly

### KEY FILES TO UPDATE

```
/app/withdraw/page.tsx          - In progress
/app/airtime/page.tsx           - TODO
/app/data/page.tsx              - TODO
/app/betting/page.tsx           - TODO
/app/electricity/page.tsx       - TODO
/app/tv/page.tsx                - TODO (only add PayFlex Code button)
/app/earn/page.tsx              - TODO
/app/transactions/page.tsx      - TODO
/app/dashboard/page.tsx         - ✅ DONE
/lib/format-balance.ts          - ✅ DONE
/lib/wallet.ts                  - ✅ DONE
/app/api/auth/callback/route.ts - TODO (add ensureWalletExists)
```

### NEXT STEPS

1. Complete withdraw page with Supabase integration
2. Systematically update each transaction page (airtime, data, betting, etc.)
3. Update authentication callbacks to auto-create wallets
4. Implement real-time subscriptions
5. Build and test all functionality

### BALANCE FORMATTING EXAMPLES

Correct Format: `NGN250,000.00`
- No space between NGN and amount ✅
- Comma separators for thousands ✅
- Exactly 2 decimal places (.00) ✅

Incorrect Formats (AVOID):
- `NGN 250,000.00` ❌ (has space)
- `NGN250,000.00.00` ❌ (double decimals)
- `₦250000` ❌ (missing format)
- `N250000.00` ❌ (wrong currency symbol)
