# BLUEPAY DIGITAL - Quick Start Guide

Get BLUEPAY DIGITAL up and running in 5 minutes!

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd bluepay-digital

# Install dependencies
pnpm install
```

## Step 2: Set Up Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
RESEND_API_KEY=your_resend_key_here
EMAIL_FROM=noreply@bluepay.com
OTP_SECRET=your_secret_here
```

## Step 3: Get API Keys

### Supabase (Free Tier Available)
1. Go to [supabase.com](https://supabase.com)
2. Click "Sign Up" and create account
3. Create a new project
4. Go to Settings → API
5. Copy `Project URL` and `anon key`
6. Paste into `.env.local`

### Resend (Free Tier Available)
1. Go to [resend.com](https://resend.com)
2. Click "Sign Up"
3. Create account and verify email
4. Go to API Keys
5. Create new API key
6. Copy and paste into `RESEND_API_KEY`

## Step 4: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the App

1. **Welcome Screen**: You'll see the BLUEPAY DIGITAL splash screen
2. **Click "GET STARTED"**: Navigate to signup page
3. **Fill Form**: 
   - Full Name: John Doe
   - Email: test@example.com
   - Password: TestPassword123 (8+ chars)
   - Confirm: TestPassword123
4. **Click "CREATE ACCOUNT"**: Triggers OTP send (check email)
5. **Enter OTP**: Check terminal/console for simulated OTP code
6. **Security Setup**: Choose PIN or Biometric
7. **Dashboard**: View your wallet and transactions!

## Available Test Accounts

Since this is a demo, you can test with any email:

```
Email: test@example.com
Password: TestPassword123
```

The OTP will be logged to the browser console in development mode.

## Project Commands

```bash
# Development
pnpm dev          # Start dev server on port 3000

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm type-check   # Check TypeScript types

# Database (if using Supabase)
pnpm db:push      # Push schema to Supabase
pnpm db:seed      # Seed database with test data
```

## File Structure Overview

```
├── app/
│   ├── page.tsx               # Welcome screen
│   ├── signup/page.tsx        # Signup form
│   ├── signin/page.tsx        # Sign in form
│   ├── verify-email/page.tsx  # OTP verification
│   ├── setup-security/page.tsx # Security setup
│   ├── dashboard/page.tsx     # Main dashboard
│   └── api/auth/              # Authentication APIs
├── lib/
│   ├── utils.ts              # Utility functions
│   └── supabase.ts           # Supabase client
├── tailwind.config.ts         # Tailwind CSS config
└── package.json               # Dependencies
```

## Customize Theme

The app uses a blue (#0000FF) primary color. To change it:

1. Edit `app/globals.css`:
   ```css
   :root {
     --primary: #your-color;
     /* ... */
   }
   ```

2. Edit `tailwind.config.ts`:
   ```js
   colors: {
     primary: '#your-color',
   }
   ```

3. Update component classes from `blue-600` to your new color

## Enable Dark Mode

Dark mode is already configured! Users can:
- Set system preference (macOS/Linux/Windows)
- Browser DevTools → toggle dark mode

## Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Then add environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add all variables from `.env.local`
- Redeploy

## Common Issues & Solutions

### "OTP not sending"
- ✅ Check `RESEND_API_KEY` in `.env.local`
- ✅ Verify email address is valid
- ✅ Check Resend API has credits

### "Supabase connection error"
- ✅ Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- ✅ Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- ✅ Ensure Supabase project is active

### "Port 3000 already in use"
```bash
# Use different port
PORT=3001 pnpm dev

# Or kill the process
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

### "Module not found errors"
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev
```

## Next Steps

1. **Customize**: Update colors, fonts, and branding
2. **Database**: Set up Supabase database tables
3. **Add Features**: Implement actual payment processing
4. **Deploy**: Push to production on Vercel
5. **Monitor**: Set up error tracking with Sentry

## Resources

- 📚 [Next.js Documentation](https://nextjs.org/docs)
- 🎨 [TailwindCSS Documentation](https://tailwindcss.com)
- 🔐 [Supabase Documentation](https://supabase.com/docs)
- 📧 [Resend Documentation](https://resend.com/docs)
- 💙 [BLUEPAY Docs](./README.md)

## Get Help

- Check [README.md](./README.md) for full documentation
- Review [troubleshooting section](./README.md#🐛-troubleshooting)
- Create GitHub issue for bugs
- Contact support team

---

**Happy coding! 🚀**

Built with ❤️ using Next.js + React + TailwindCSS + Supabase
