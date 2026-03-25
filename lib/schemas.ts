import { z } from 'zod'

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Server schemas
export const serverSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.enum(['AWS', 'Digital Ocean', 'Linode', 'Vultr']),
  region: z.string(),
  status: z.enum(['active', 'inactive', 'provisioning']),
  cpuCores: z.number(),
  ram: z.number(),
  storage: z.number(),
  bandwidth: z.number(),
  monthlyPrice: z.number(),
  createdAt: z.string(),
})

// Application schemas
export const applicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  serverId: z.string(),
  type: z.enum(['Node.js', 'PHP', 'Python', 'Static']),
  status: z.enum(['running', 'stopped', 'error']),
  domain: z.string(),
  lastDeployed: z.string(),
  uptimePercentage: z.number(),
})

// Billing schemas
export const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  bandwidth: z.number(),
  serverSlots: z.number(),
  features: z.array(z.string()),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type Server = z.infer<typeof serverSchema>
export type Application = z.infer<typeof applicationSchema>
export type Plan = z.infer<typeof planSchema>
