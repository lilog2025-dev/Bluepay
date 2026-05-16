# BLUEPAY DIGITAL - API Documentation

Complete API reference for BLUEPAY DIGITAL backend endpoints.

## Base URL

```
http://localhost:3000/api
```

In production, replace `localhost:3000` with your domain.

## Authentication

All requests should include:
```
Content-Type: application/json
```

## Endpoints

### 1. Send OTP

**Endpoint**: `POST /auth/send-otp`

**Purpose**: Send 6-digit OTP code to user's email

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "maskedEmail": "us***@example.com"
}
```

**Error Responses**:
- 400: Invalid email address
- 500: Failed to send OTP email

**Example cURL**:
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Example JavaScript**:
```javascript
const response = await fetch('/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
});
const data = await response.json();
console.log(data);
```

---

### 2. Verify OTP

**Endpoint**: `POST /auth/verify-otp`

**Purpose**: Verify the 6-digit OTP code sent to email

**Request**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Responses**:
- 400: Invalid OTP code
- 400: OTP has expired (after 5 minutes)
- 500: Internal server error

**Requirements**:
- OTP code must be exactly 6 digits
- OTP must not be expired (5-minute window)
- Email must match the OTP request

**Example cURL**:
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "code":"123456"
  }'
```

**Example JavaScript**:
```javascript
const response = await fetch('/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    code: '123456'
  })
});
const data = await response.json();
if (data.success) {
  console.log('OTP verified!');
} else {
  console.error('Invalid OTP:', data.error);
}
```

---

### 3. Signup / Create Account

**Endpoint**: `POST /auth/signup`

**Purpose**: Create a new user account with Supabase Auth

**Request**:
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "SecurePassword123",
  "referralCode": "BP12345ABC"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

**Error Responses**:
- 400: Invalid email address
- 400: Full name is required
- 400: Password must be at least 8 characters
- 400: Email already registered
- 400: Auth provider error (from Supabase)
- 500: Internal server error

**Validation Rules**:
- **Email**: Must be valid format (user@domain.com)
- **Full Name**: Minimum 2 characters, required
- **Password**: Minimum 8 characters, required
- **Referral Code**: Optional, alphanumeric

**Example cURL**:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@example.com",
    "fullName":"Jane Smith",
    "password":"SecurePass123",
    "referralCode":"FRIEND123"
  }'
```

**Example JavaScript**:
```javascript
async function signupUser() {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'newuser@example.com',
      fullName: 'Jane Smith',
      password: 'SecurePass123',
      referralCode: 'FRIEND123'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('Account created:', data.user);
    // Redirect to OTP verification
  } else {
    console.error('Signup failed:', data.error);
  }
}
```

---

## Request/Response Format

### Standard Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Standard Error Response
```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Endpoint doesn't exist |
| 500 | Server Error - Internal error |

## Rate Limiting

Currently no rate limiting is implemented. For production:

```javascript
// Recommended: Maximum 5 OTP requests per email per hour
// Recommended: Maximum 10 signup attempts per IP per hour
```

## Error Handling

All endpoints return consistent error format:

```json
{
  "error": "Descriptive error message",
  "details": "Optional additional details"
}
```

**Never expose**:
- Database errors
- Server stack traces
- Sensitive configuration
- User password information

## Security Best Practices

### Input Validation
✅ All inputs are validated before processing
✅ Email format validation
✅ Password strength requirements
✅ SQL injection prevention via Supabase

### Password Security
✅ Minimum 8 characters required
✅ Hashed with bcryptjs before storage
✅ Never logged or exposed in responses

### OTP Security
✅ 6-digit codes with time expiry (5 minutes)
✅ Single-use tokens (deleted after verification)
✅ Sent via secure Resend API
✅ Email delivery confirmed

### Environment Security
✅ API keys in environment variables only
✅ Never commit `.env.local` to git
✅ Use `.env.example` for template
✅ Rotate keys regularly in production

## Integration Examples

### Complete Signup Flow

```javascript
async function completeSignup(email, fullName, password) {
  try {
    // Step 1: Create account
    const signupRes = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        fullName,
        password
      })
    });

    const signupData = await signupRes.json();
    if (!signupData.success) {
      throw new Error(signupData.error);
    }

    // Step 2: Send OTP
    const otpRes = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const otpData = await otpRes.json();
    if (!otpData.success) {
      throw new Error(otpData.error);
    }

    // Step 3: User enters OTP (in UI)
    const userEnteredOTP = '123456'; // From user input

    // Step 4: Verify OTP
    const verifyRes = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        code: userEnteredOTP
      })
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      throw new Error(verifyData.error);
    }

    // Success! Proceed to security setup
    return { success: true, user: signupData.user };

  } catch (error) {
    console.error('Signup flow error:', error);
    return { success: false, error: error.message };
  }
}
```

### Error Handling Best Practices

```javascript
async function safeApiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      method: options.method || 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options.body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API error');
    }

    return { success: true, data };

  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error'
    };
  }
}
```

## Testing API Endpoints

### Using Postman

1. Create new POST request
2. Set URL: `http://localhost:3000/api/auth/send-otp`
3. Set Headers: `Content-Type: application/json`
4. Set Body (raw JSON):
   ```json
   {
     "email": "test@example.com"
   }
   ```
5. Click Send

### Using Insomnia

Similar steps as Postman.

### Using cURL

```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "fullName":"John Doe",
    "password":"Password123"
  }'
```

## Future Endpoints

These endpoints are planned for future releases:

- `POST /auth/signin` - Sign in with email/password
- `POST /auth/refresh` - Refresh authentication token
- `POST /auth/logout` - Logout current user
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `POST /wallet/transfer` - Send money to another user
- `GET /wallet/balance` - Get current balance
- `GET /transactions` - Get transaction history
- `POST /transactions/airtime` - Buy airtime

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 2026 | Initial release with auth endpoints |

---

**Need Help?** Check [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md)
