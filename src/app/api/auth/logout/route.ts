import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url))
  
  // Clear the authentication cookie
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  })
  
  return response
}

export async function GET(request: NextRequest) {
  return POST(request)
} 