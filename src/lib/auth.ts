export const COOKIE_NAME = 'site_auth'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

// Rate limiting storage (in-memory for Edge compatibility)
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>()

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

export function createAuthCookie(hashedPassword: string): string {
  const maxAge = COOKIE_MAX_AGE
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString()
  
  return `${COOKIE_NAME}=${hashedPassword}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}; Expires=${expires}`
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown'
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = `login_${ip}`
  const limit = rateLimitStore.get(key)
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, { attempts: 1, resetTime: now + 10 * 60 * 1000 }) // 10 minutes
    return true
  }
  
  if (limit.attempts >= 5) {
    return false
  }
  
  limit.attempts++
  return true
}

export function getCookieValue(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const cookie = cookies.find(c => c.startsWith(`${name}=`))
  
  return cookie ? cookie.substring(name.length + 1) : null
}

export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })
  
  if (response.redirected) {
    window.location.href = response.url
  }
} 