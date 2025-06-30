'use client'

import { useActionState } from 'react'
import { loginAction } from './action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {})

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Site Access
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the site password to continue
          </p>
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