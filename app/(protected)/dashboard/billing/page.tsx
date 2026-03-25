'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockPlans, mockServers } from '@/lib/mockData'

export default function BillingPage() {
  const currentPlan = mockPlans[1] // Professional plan
  const nextInvoiceDate = '2024-04-15'
  const totalMonthlyUsage = mockServers.reduce((sum, s) => sum + s.monthlyPrice, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and payments</p>
      </div>

      {/* Current Plan */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{currentPlan.name}</h3>
              <p className="text-muted-foreground mt-2">
                ${currentPlan.price}/month • {currentPlan.serverSlots} servers • {currentPlan.bandwidth}TB bandwidth
              </p>
              <ul className="mt-4 space-y-2">
                {currentPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">This Month's Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${totalMonthlyUsage.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">Based on current servers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${(currentPlan.price + totalMonthlyUsage).toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">Due {nextInvoiceDate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Credits Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$50.00</div>
            <p className="text-sm text-muted-foreground mt-2">Promotional credit</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="h-10 w-16 bg-primary/20 rounded flex items-center justify-center font-semibold text-primary text-sm">
                VISA
              </div>
              <div>
                <p className="font-medium text-foreground">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: '2024-03-15', amount: '$874.99', status: 'Paid' },
              { date: '2024-02-15', amount: '$874.99', status: 'Paid' },
              { date: '2024-01-15', amount: '$824.99', status: 'Paid' },
            ].map((invoice, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50 transition rounded">
                <div>
                  <p className="font-medium text-foreground">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">Monthly subscription</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-foreground">{invoice.amount}</p>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-accent/20 text-accent">
                    {invoice.status}
                  </span>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Other Plans */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Other Plans</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {mockPlans.filter(p => p.id !== currentPlan.id).map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground mb-4">${plan.price}/month</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.serverSlots} servers • {plan.bandwidth}TB bandwidth
                </p>
                <Button className="w-full" variant="outline">Switch Plan</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
