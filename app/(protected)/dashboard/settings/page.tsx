'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Shield, 
  Key, 
  LogOut, 
  Trash2, 
  Save, 
  RefreshCcw,
  Mail,
  Lock,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  // Initialize form with user data when available
  useState(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      })
    }
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setSaving(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 pt-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">
          Manage your account security, notifications, and personal preferences.
        </p>
      </div>

      {/* Account Profile */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <User className="size-4 text-muted-foreground/70" />
          <h2 className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">Account Details</h2>
        </div>
        <Card className="border-border/40 shadow-none bg-card/30">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 h-10 rounded-lg bg-muted/20 border-border/40 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 h-10 rounded-lg bg-muted/20 border-border/40 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center p-6 border border-border/40 rounded-xl bg-muted/10">
                <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                  <User className="size-8 text-primary/70" />
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold px-4 rounded-lg">Change Photo</Button>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border/40 flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="h-10 px-6 rounded-lg gap-2 text-xs font-bold">
                {saving ? <RefreshCcw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Security */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Shield className="size-4 text-muted-foreground/70" />
          <h2 className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">Security & Access</h2>
        </div>
        <Card className="border-border/40 shadow-none bg-card/30">
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pl-10 h-10 rounded-lg bg-muted/20 border-border/40 focus:ring-primary/20 text-sm"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Confirm</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pl-10 h-10 rounded-lg bg-muted/20 border-border/40 focus:ring-primary/20 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/10 border border-border/40">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-background border border-border/20 flex items-center justify-center">
                  <Smartphone className="size-4 text-muted-foreground/60" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">2FA Authentication</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Status: Inactive</p>
                </div>
              </div>
              <Button variant="outline" className="h-8 text-xs font-bold px-4 rounded-lg">Enable</Button>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" className="h-10 px-6 rounded-lg text-xs font-bold">Update Security</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Trash2 className="size-4 text-destructive/70" />
          <h2 className="text-sm font-bold text-destructive/60 uppercase tracking-widest">Danger Zone</h2>
        </div>
        <Card className="border-destructive/20 bg-destructive/[0.02] shadow-none">
          <CardContent className="p-6 divide-y divide-destructive/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
              <div>
                <p className="text-sm font-bold text-foreground">Session Management</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Logout of your account on all devices.</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="rounded-lg h-9 text-xs font-bold px-5 border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all gap-2">
                <LogOut className="size-3.5" />
                Sign Out Everywhere
              </Button>
            </div>

            <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-destructive">Account Termination</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Permanently delete your account and all associated data.</p>
              </div>
              <Button variant="destructive" disabled className="rounded-lg h-9 text-xs font-bold px-6 opacity-50 grayscale">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
