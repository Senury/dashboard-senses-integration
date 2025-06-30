'use client'

import { useActionState } from 'react'
import { loginAction } from './action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {})

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <Image
              src="/logo_plus.svg"
              alt="Logo"
              width={160}
              height={160}
              className="h-auto"
            />
          </div>
        </div>
        
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter site password"
              required
              autoFocus
              autoComplete="current-password"
              disabled={isPending}
            />
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Verifying...' : 'Access Site'}
          </Button>
        </form>
      </Card>
    </div>
  )
} 