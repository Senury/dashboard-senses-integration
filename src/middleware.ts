import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCookieValue, hashPassword, constantTimeEquals, COOKIE_NAME } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  console.log('🔥 MIDDLEWARE EXECUTING for:', request.nextUrl.pathname)
  
  // Add header to prove middleware is running
  const response = NextResponse.next()
  response.headers.set('x-middleware-executed', 'true')
  
  // Skip authentication for login page and API routes
  const { pathname } = request.nextUrl
  
  if (pathname === '/login') {
    console.log('✅ Allowing access to login page')
    return response
  }
  
  // Get the auth cookie
  const authCookie = getCookieValue(request, COOKIE_NAME)
  console.log('🍪 Auth cookie present:', !!authCookie)
  
  if (!authCookie) {
    console.log('❌ No auth cookie found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Validate the cookie by comparing with the stored password hash
  const storedPassword = process.env.SITE_PASSWORD
  if (!storedPassword) {
    console.log('❌ No SITE_PASSWORD configured, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  try {
    // Hash the stored password and compare with cookie value
    const storedHash = await hashPassword(storedPassword)
    
    if (!constantTimeEquals(authCookie, storedHash)) {
      console.log('❌ Invalid auth cookie, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    console.log('✅ Valid auth cookie, allowing access')
    return response
  } catch (error) {
    console.error('❌ Error validating auth cookie:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
} 