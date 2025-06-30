'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { hashPassword, constantTimeEquals, getClientIP, checkRateLimit, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth'

type ActionState = {
  error?: string
}

export async function loginAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const password = formData.get('password') as string
  
  if (!password) {
    return { error: 'Password is required' }
  }
  
  // Get client IP for rate limiting
  const headersList = await headers()
  const request = new Request('http://localhost', {
    headers: headersList
  })
  const clientIP = getClientIP(request)
  
  // Check rate limiting
  if (!checkRateLimit(clientIP)) {
    return { error: 'Too many login attempts. Please try again in 10 minutes.' }
  }
  
  // Get the stored password from environment
  const storedPassword = process.env.SITE_PASSWORD
  if (!storedPassword) {
    return { error: 'Site password not configured' }
  }
  
  // Hash the submitted password
  const submittedHash = await hashPassword(password)
  
  // Hash the stored password for comparison
  const storedHash = await hashPassword(storedPassword)
  
  // Constant-time comparison
  if (!constantTimeEquals(submittedHash, storedHash)) {
    return { error: 'Invalid password' }
  }
  
  // Set the authentication cookie
  const cookieStore = await cookies()
  cookieStore.set({
    name: COOKIE_NAME,
    value: submittedHash,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE
  })
  
  redirect('/')
} 