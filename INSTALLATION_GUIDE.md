# PayFlex DIGITAL - Complete Installation & Setup Guide

Welcome to PayFlex DIGITAL! This guide will walk you through everything you need to deploy and run the application.

## 📋 Requirements

Before you start, make sure you have:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **pnpm** (or npm/yarn) - Package manager
- **Git** - For version control
- **Supabase Account** - For database ([Sign up free](https://supabase.com))
- **Resend Account** - For email OTP ([Sign up free](https://resend.com))

## ✅ Quick Start (5 Minutes)

### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd PayFlex-digital
```

### Step 2: Install Dependencies
```bash
pnpm install
# or: npm install / yarn install
```

### Step 3: Create Environment File
```bash
cp .env.example .env.local
```

### Step 4: Get Your API Keys

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Go to **Settings → API**
5. Copy **Project URL** and **anon key**
6. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
   ```

#### Resend Setup
1. Go to [resend.com](https://resend.com)
2. Sign up or log in
3. Go to **API Keys**
4. Create new API key (or copy existing)
5. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxx
   ```

### Step 5: Run Development Server
```bash
pnpm dev
```

### Step 6: Open Browser
Navigate to: **http://localhost:3000**

## 🎯 Your `.env.local` File Should Look Like:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Resend Email
RESEND_API_KEY=re_your_resend_key_here
EMAIL_FROM=noreply@PayFlex.com

# OTP Secret (for encryption)
OTP_SECRET=your_secret_key_here

# Optional
NODE_ENV=development
```

## 🧪 Test the Application

1. **Home Page**: Click "GET STARTED" button
2. **Signup Page**: Fill in test data:
   - Name: John Doe
   - Email: test@example.com
   - Password: TestPassword123
   - Confirm: TestPassword123
3. **OTP Verification**: Check your email for OTP code
4. **Security Setup**: Choose PIN or Fingerprint
5. **Dashboard**: View your premium wallet interface

## 📦 What's Included

### Pages Built
- ✅ Welcome/Splash Screen (`/`)
- ✅ Signup Page (`/signup`)
- ✅ Sign In Page (`/signin`)
- ✅ OTP Verification (`/verify-email`)
- ✅ Security Setup (`/setup-security`)
- ✅ Dashboard (`/dashboard`)

### API Endpoints
- ✅ POST `/api/auth/send-otp` - Send OTP to email
- ✅ POST `/api/auth/verify-otp` - Verify OTP code
- ✅ POST `/api/auth/signup` - Create account

### Features
- ✅ Email OTP verification (6-digit codes)
- ✅ Security PIN setup
- ✅ Biometric fingerprint scanning
- ✅ Profile picture upload
- ✅ Premium wallet card
- ✅ Transaction history
- ✅ Bottom navigation
- ✅ Dark mode support
- ✅ Responsive design

## 🚀 Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Option 2: Using GitHub

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Vercel auto-deploys on push
4. Add environment variables in Vercel dashboard

### Set Environment Variables in Vercel

1. Go to **Project Settings → Environment Variables**
2. Add each variable from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `OTP_SECRET`
3. Click "Save" and redeploy

## 🔧 Development Commands

```bash
# Start dev server (port 3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type check
pnpm type-check

# Format code
pnpm format
```

## 📁 Project Structure

```
PayFlex-digital/
├── app/                           # Next.js app directory
│   ├── api/auth/                  # Authentication APIs
│   ├── signup/                    # Signup page
│   ├── signin/                    # Sign in page
│   ├── verify-email/              # OTP verification
│   ├── setup-security/            # Security setup
│   ├── dashboard/                 # Main dashboard
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles
│   └── page.tsx                   # Welcome page
├── lib/                           # Utilities
│   ├── utils.ts                   # Helper functions
│   └── supabase.ts                # Supabase client
├── public/                        # Static files
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
├── README.md                      # Full documentation
├── QUICKSTART.md                  # Quick start guide
├── API.md                         # API documentation
└── .env.example                   # Environment template
```

## 🎨 Customization Guide

### Change Brand Color

1. Open `app/globals.css`
2. Find `:root` section
3. Change `--primary: #0000ff;` to your color
4. Update all `#0000ff` references

Example: Change to green (#00FF00)
```css
:root {
  --primary: #00ff00;
}
```

### Change Application Name

1. Edit `app/layout.tsx` - Update `<title>`
2. Edit `app/page.tsx` - Change "PayFlex DIGITAL" text
3. Update `package.json` - Change "name" field

### Modify Dashboard Content

1. Edit `app/dashboard/page.tsx`
2. Change quick actions buttons
3. Modify transaction data
4. Update wallet balance display

## 🐛 Troubleshooting

### "Module not found" Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

### "Port 3000 already in use"
```bash
# Use a different port
PORT=3001 pnpm dev

# Or kill the process
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "OTP not sending"
- ✅ Check `RESEND_API_KEY` in `.env.local`
- ✅ Verify email address format
- ✅ Check Resend account has credits
- ✅ Verify `EMAIL_FROM` is set

### "Supabase connection error"
- ✅ Check URL format: `https://xxxxx.supabase.co`
- ✅ Verify anon key is correct
- ✅ Ensure Supabase project is active
- ✅ Check no typos in `.env.local`

### Build Failing
```bash
# Full clean build
rm -rf .next node_modules
pnpm install
pnpm build
```

## 📚 Additional Resources

| Resource | Link |
|----------|------|
| Next.js Docs | https://nextjs.org/docs |
| React Docs | https://react.dev |
| TailwindCSS Docs | https://tailwindcss.com/docs |
| Supabase Docs | https://supabase.com/docs |
| Resend Docs | https://resend.com/docs |

## 🔒 Security Tips

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Rotate API keys** - Every 3-6 months
3. **Use HTTPS** - Always in production
4. **Enable RLS** - In Supabase for database tables
5. **Validate inputs** - On frontend and backend
6. **Keep dependencies updated** - Run `pnpm update`

## 📊 Performance Tips

1. **Enable CDN** - Cloudflare, Vercel Edge
2. **Optimize images** - Use next/image
3. **Code splitting** - Automatic with Next.js
4. **Caching** - Configure in next.config.js
5. **Monitoring** - Set up Sentry or similar

## 🎯 Next Steps

After successful setup:

1. **Customize** - Update colors, fonts, branding
2. **Database** - Set up Supabase tables (optional)
3. **Testing** - Test all pages and flows
4. **Deploy** - Push to production
5. **Monitor** - Set up error tracking

## 📞 Getting Help

1. Check [README.md](./README.md) - Full documentation
2. Review [QUICKSTART.md](./QUICKSTART.md) - Quick setup
3. Check [API.md](./API.md) - API reference
4. Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Overview

## ✨ You're All Set!

Your PayFlex DIGITAL application is ready to use. Start building amazing fintech features!

```bash
# Happy coding! 🚀
pnpm dev
```

---

**Need Help?**
- 📧 Email: support@PayFlex.com (update with your contact)
- 💬 Discord: [Join our community](your-discord-link)
- 🐛 GitHub Issues: Report bugs
- 📖 Docs: Check documentation files

Built with ❤️ using Next.js + React + TailwindCSS + Supabase
