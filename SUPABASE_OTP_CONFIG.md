# Supabase Email OTP Configuration Guide

## Important: Fix Magic Link Issue

If users are receiving **Magic Links** instead of **6-digit OTP codes**, you need to disable Magic Link authentication in Supabase and enable Email OTP only.

### Steps to Fix in Supabase Dashboard:

1. **Go to Supabase Dashboard** → Your Project

2. **Navigate to Authentication → Providers**

3. **Find "Email" Provider** and click to configure

4. **Email Configuration Settings:**
   - ✅ **Enable Email Provider**: Toggle ON
   - ✅ **Confirm Email**: Toggle ON (required for OTP)
   - ✅ **Email OTP**: Toggle ON
   - ✅ **Email OTP Expiration**: Set to 600 seconds (10 minutes)
   - ✅ **Email OTP Length**: Set to 6 digits
   - ❌ **Magic Link**: Toggle OFF (IMPORTANT - disable this!)
   - ❌ **Disable email confirmations**: Do NOT enable this

5. **Save Changes**

### Email Template Configuration:

The Email OTP template should be set to send a 6-digit code. Supabase provides a default template, but you can customize it if needed.

**Default Supabase Email OTP message includes:**
- Email address confirmation request
- 6-digit verification code
- Code expiration time
- Link to confirm (for fallback)

### Testing the OTP Flow:

1. Go to your app's signup page
2. Enter email and name
3. Click "CREATE ACCOUNT"
4. Wait for "Creating Your Account" animation
5. You should land on "Verify Your Email" page
6. Check your email inbox for a message from Supabase with a 6-digit code
7. Enter the code in the OTP input fields
8. On success, redirects to dashboard

### Common Issues & Solutions:

**Issue**: Still receiving Magic Links
- **Solution**: Verify that Magic Link is actually disabled in Supabase settings. Clear browser cache and try again.

**Issue**: OTP code not arriving
- **Solution**: Check spam/junk folder. Ensure "Confirm email" is enabled in Supabase settings.

**Issue**: Code expires too quickly
- **Solution**: Increase OTP expiration time in Supabase (default is 600 seconds = 10 minutes)

**Issue**: "shouldCreateUser: true" not working
- **Solution**: Ensure Email Provider is enabled AND "Confirm email" is toggled ON in Supabase Authentication → Email Provider settings.

### Current App Configuration:

- **API Route**: `/api/auth/send-otp` - Uses `supabase.auth.signInWithOtp()`
- **Verification Route**: `/api/auth/verify-otp` - Uses `supabase.auth.verifyOtp()`
- **OTP Format**: 6 numeric digits
- **Expiration**: 300 seconds (5 minutes, can be adjusted)
- **Email Field**: Supports any valid email address
- **User Creation**: Automatic on first OTP signup

### Email Flow Diagram:

```
User → Signup Form
     ↓
/api/auth/signup (validate form)
     ↓
/api/auth/send-otp (calls supabase.auth.signInWithOtp)
     ↓
Supabase sends email with 6-digit code
     ↓
Creating Your Account (animation)
     ↓
Verify Your Email (OTP input page)
     ↓
/api/auth/verify-otp (calls supabase.auth.verifyOtp)
     ↓
Session created, user profile inserted
     ↓
Dashboard
```

### Supabase Auth URLs:

For reference, if you need to configure custom URLs:
- **Confirm email redirect**: `/auth/callback`
- **Invitation link**: `/auth/callback`
- **Password recovery**: `/auth/reset-password`

The app's middleware automatically handles these with the environment variable: `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (for preview/development)

### Environment Variables Needed:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (for server operations)
```

All should be set in your Vercel project settings under "Environment Variables".

### Disable Magic Link Permanently:

If Magic Link keeps re-enabling, check:
1. Supabase project settings (might have a different configuration per branch)
2. Ensure you're in the correct environment (dev/staging/prod)
3. Contact Supabase support if the issue persists

---

**Note**: The app uses **Email OTP only** - no password authentication. Magic Links are disabled for security and UX consistency.
