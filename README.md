This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Middleware Authentication

This application implements global authentication using Next.js middleware to protect all routes from unauthorized access.

### Configuration

Set the site password via environment variable:

```bash
# For development
SITE_PASSWORD=your_secret_password npm run dev

# Or create .env.local
echo "SITE_PASSWORD=your_secret_password" > .env.local
```

### How It Works

The middleware (`src/middleware.ts`) runs on every request and:

1. **Checks Authentication**: Validates the `site_auth` cookie against the configured password
2. **Route Protection**: Redirects unauthenticated users to `/login`
3. **Secure Access**: Only allows access to protected routes with valid authentication

### Security Features

- **SHA-256 Password Hashing**: Passwords are hashed using SHA-256
- **Constant-Time Comparison**: Prevents timing attacks during authentication
- **Secure Cookies**: 
  - `HttpOnly` - Prevents XSS access
  - `Secure` - HTTPS only in production
  - `SameSite=Strict` - CSRF protection
  - `Path=/` - Site-wide authentication
  - `30-day expiry` - Persistent sessions
- **Rate Limiting**: Built-in protection against brute force attacks

### Protected Routes

All routes except the following are protected:
- `/login` - Authentication page
- `/api/*` - API routes
- `/_next/static/*` - Static assets
- `/_next/image/*` - Image optimization
- `/favicon.ico` - Favicon

### Route Matcher

```javascript
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
}
```

### Testing Authentication

1. **Test Protection**: Visit any route without authentication → redirects to `/login`
2. **Test Login**: Enter correct password on `/login` → grants access to all routes
3. **Test Persistence**: Refresh page → remains authenticated (30-day cookie)
4. **Test Logout**: Use logout API → clears authentication and redirects to `/login`

### Middleware Logs

The middleware provides console logging for debugging:
- `🔥 MIDDLEWARE EXECUTING for: /path` - Shows middleware execution
- `🍪 Auth cookie present: true/false` - Cookie validation status
- `✅ Valid auth cookie, allowing access` - Successful authentication
- `❌ No auth cookie found, redirecting to login` - Missing authentication

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_PASSWORD` | Yes | The password required to access the site |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
