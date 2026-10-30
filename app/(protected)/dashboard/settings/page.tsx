'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { useRouter } from 'next/navigation'
import {
  User,
  Shield,
  LogOut,
  Trash2,
  Save,
  RefreshCcw,
  Mail,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout, setUser } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })

  // The persisted user arrives after hydration, so sync the form when it does
  useEffect(() => {
    if (user) setFormData({ name: user.name, email: user.email })
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    if (user) setUser({ ...user, ...formData })
    setSaving(false)
    toast.success('Profile saved')
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <PageHeader title="Settings" description="Manage your account security, notifications, and personal preferences." />

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <User className="size-4 text-primary" /> Account Details
        </h2>
        <Card className="gap-0 py-0 shadow-none">
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-5 md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-6">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="size-8 text-primary" />
                </div>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
            </div>
            <div className="mt-6 flex justify-end border-t border-border pt-6">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <RefreshCcw className="size-4 animate-spin" /> : <Save className="size-4" />}
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Shield className="size-4 text-primary" /> Security & Access
        </h2>
        <Card className="gap-0 py-0 shadow-none">
          <CardContent className="space-y-6 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg bg-muted p-4">
              <div className="flex items-center gap-4">
                <Smartphone className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">2FA Authentication</p>
                  <p className="text-xs text-muted-foreground">Status: Inactive</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary">Update Security</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-destructive">
          <Trash2 className="size-4" /> Danger Zone
        </h2>
        <Card className="gap-0 border-destructive/40 py-0 shadow-none">
          <CardContent className="divide-y divide-border p-6">
            <div className="flex flex-col justify-between gap-4 pb-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium text-foreground">Session Management</p>
                <p className="mt-1 text-xs text-muted-foreground">Logout of your account on all devices.</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
                <LogOut className="size-4" />
                Sign Out Everywhere
              </Button>
            </div>
            <div className="flex flex-col justify-between gap-4 pt-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium text-destructive">Account Termination</p>
                <p className="mt-1 text-xs text-muted-foreground">Permanently delete your account and all associated data.</p>
              </div>
              <Button variant="destructive" disabled>Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
