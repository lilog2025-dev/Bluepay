# PayFlex DIGITAL - Modern Fintech Application

A premium, production-ready fintech application built with Next.js, React, TailwindCSS, and Supabase. PayFlex DIGITAL provides secure digital payments, airtime purchases, data subscriptions, bill payments, and transfers.

## 🎨 Features

### User Authentication & Security
- **Email OTP Verification**: 6-digit codes sent via Resend API (5-minute expiry)
- **Security PIN**: 6-digit personal identification number
- **Biometric Authentication**: Fingerprint scanning with animated feedback
- **Supabase Auth Integration**: Secure user management and authentication

### Dashboard & Features
- **Premium Wallet Card**: Balance visibility with toggle feature
- **Quick Actions**: Transfer, Buy Airtime, Buy Data, Pay Bills, Rewards, Referrals
- **Transaction History**: Recent activities with timestamps and amounts
- **Bottom Navigation**: Easy navigation between Home, Wallet, Transactions, and Profile

### Design & UX
- **Blue Gradient Theme**: #0000FF primary color throughout
- **Responsive Mobile-First Design**: Optimized for all screen sizes
- **Glass Morphism Cards**: Modern glassmorphic design elements
- **Dark Mode Support**: Full dark mode theming
- **Smooth Animations**: Loading states, transitions, and interactive effects

### Technical Excellence
- **Next.js 16**: App Router, Server Components, and optimal performance
- **TypeScript**: Full type safety across the application
- **TailwindCSS**: Utility-first CSS for rapid UI development
- **Supabase**: PostgreSQL database with authentication and storage
- **API Routes**: RESTful endpoints for OTP, verification, and signup
- **Form Validation**: Email, password, and input validation
- **Error Handling**: Comprehensive error messages and user feedback

## 📋 Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── globals.css                # Global styles and design tokens
│   ├── page.tsx                   # Welcome/Splash screen
│   ├── signup/
│   │   └── page.tsx               # Signup form page
│   ├── signin/
│   │   └── page.tsx               # Sign in page
│   ├── verify-email/
│   │   └── page.tsx               # OTP verification page
│   ├── setup-security/
│   │   └── page.tsx               # Security PIN & Biometric setup
│   ├── dashboard/
│   │   └── page.tsx               # Main dashboard with bottom nav
│   └── api/
│       └── auth/
│           ├── send-otp/
│           │   └── route.ts       # Send OTP email endpoint
│           ├── verify-otp/
│           │   └── route.ts       # Verify OTP code endpoint
│           └── signup/
│               └── route.ts       # Create account endpoint
├── lib/
│   ├── utils.ts                   # Utility functions & validators
│   └── supabase.ts                # Supabase client configuration
├── public/                        # Static assets
├── tailwind.config.ts             # Tailwind configuration
└── package.json                   # Dependencies & scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm/npm/yarn
- Supabase account (free tier available)
- Resend account for email OTP (free tier available)

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Email OTP (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@PayFlex.com
OTP_SECRET=your_otp_secret

# Optional: OTP Token Secret (for encryption)
OTP_SECRET=your_secret_key_here
```

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up Supabase database** (optional):
   - Create tables for users, otp_tokens, and transactions
   - Enable Supabase Auth
   - Set up RLS policies for security

3. **Run development server**:
   ```bash
   pnpm dev
   ```

4. **Open browser**:
   ```
   http://localhost:3000
   ```

## 📱 User Flow

```
Welcome Screen
    ↓
Signup (Email, Name, Password)
    ↓
Email OTP Verification (6-digit code)
    ↓
Security Setup (PIN + Fingerprint)
    ↓
Profile Setup (Optional photo upload)
    ↓
Dashboard (Wallet, Transactions, Actions)
```

## 🎯 Pages Overview

### 1. Welcome Page (`/`)
- Premium splash screen with animated text
- Blue gradient background
- CTA button to start signup
- Sign in link for existing users

### 2. Signup Page (`/signup`)
- Full name, email, password inputs
- Password strength validation
- Eye toggle for password visibility
- Optional referral code
- Social login buttons (Google, Apple)
- Form validation and error messages

### 3. OTP Verification Page (`/verify-email`)
- 6 OTP input boxes with auto-focus
- 5-minute countdown timer
- Resend OTP functionality
- Success/error states
- Back navigation

### 4. Security Setup Page (`/setup-security`)
- PIN creation with confirmation
- Biometric scanning with animation
- Fingerprint glow effect
- Profile picture upload
- Skip options for each step

### 5. Dashboard Page (`/dashboard`)
- Wallet balance card with visibility toggle
- Quick action buttons (Transfer, Airtime, Data, Bills, Rewards, Referrals)
- Recent transaction history
- Bottom navigation (Home, Wallet, Transactions, Profile)
- Notifications indicator
- Logout functionality

### 6. Sign In Page (`/signin`)
- Email and password inputs
- Remember me checkbox
- Forgot password link
- Social login options
- Sign up link

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **OTP Security**: Time-limited 6-digit codes
- **Supabase Auth**: Managed authentication service
- **API Validation**: Input validation on all endpoints
- **Error Handling**: No sensitive data in error messages
- **HTTPS Ready**: Production-ready for deployment

## 🎨 Design System

### Colors
- **Primary**: #0000FF (Blue)
- **Background**: #FFFFFF (Light) / #0F172A (Dark)
- **Secondary**: #F8F9FF (Light Blue)
- **Text**: #111111 (Dark) / #F1F5F9 (Light)
- **Success**: #16A34A (Green)
- **Error**: #DC2626 (Red)

### Typography
- **Font Family**: Geist (sans-serif)
- **Font Mono**: Geist Mono
- **Heading Size**: 1.5rem - 3rem
- **Body Size**: 0.875rem - 1rem

### Spacing Scale
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 12px (0.75rem)
- **lg**: 16px (1rem)
- **xl**: 24px (1.5rem)
- **2xl**: 32px (2rem)

## 📦 Dependencies

```json
{
  "@supabase/supabase-js": "^2.105.4",
  "@supabase/auth-helpers-nextjs": "^0.15.0",
  "resend": "^6.12.3",
  "bcryptjs": "^3.0.3",
  "jose": "^6.2.3",
  "crypto-js": "^4.2.0",
  "lucide-react": "^latest",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0"
}
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial PayFlex DIGITAL deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Set Environment Variables on Vercel**:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy

### Deploy to Other Platforms

- **Netlify**: Supported with Node.js runtime
- **Railway**: Recommended for Supabase integration
- **AWS Amplify**: Full managed deployment
- **DigitalOcean App Platform**: Docker-based deployment

## 🧪 Testing

### Manual Testing Checklist

- [ ] Welcome page loads and displays correctly
- [ ] Signup form validates inputs
- [ ] OTP is sent to email
- [ ] OTP verification works with countdown
- [ ] PIN setup stores securely
- [ ] Fingerprint scanning animates
- [ ] Dashboard displays correctly
- [ ] Bottom navigation switches tabs
- [ ] Balance toggle works
- [ ] Logout clears session

## 📊 API Endpoints

### POST `/api/auth/send-otp`
Sends OTP code to user email.

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "maskedEmail": "us***@example.com"
}
```

### POST `/api/auth/verify-otp`
Verifies the OTP code.

**Request**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### POST `/api/auth/signup`
Creates a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "SecurePassword123",
  "referralCode": "OPTIONAL123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

## 🔧 Customization

### Change Brand Color
1. Update `tailwind.config.ts`
2. Update `app/globals.css` CSS variables
3. Replace `#0000FF` with your color in all components

### Add New Pages
1. Create folder in `/app`
2. Add `page.tsx` component
3. Add route to navigation if needed

### Modify Dashboard Actions
Edit `/app/dashboard/page.tsx` quick actions grid to add/remove buttons.

## 🐛 Troubleshooting

### OTP Not Sending
- Check `RESEND_API_KEY` environment variable
- Verify `EMAIL_FROM` is a valid email
- Check Resend account has sufficient credits

### Supabase Connection Error
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure Supabase project is active

### Styling Issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `pnpm build`
- Check TailwindCSS config includes all file paths

## 📝 License

MIT License - Feel free to use for commercial projects.

## 🤝 Contributing

Contributions welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check existing GitHub issues
- Create a new GitHub issue with details
- Contact support team

## 🎉 Credits

Built with:
- Next.js
- React
- TailwindCSS
- Supabase
- Resend

---

**PayFlex DIGITAL** - Smart Payments for the Digital Age 💙
