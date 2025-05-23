'use client'

import { Suspense } from "react"
import { PaymentForm } from "@/components/payments/payment-form"

export default function NewPaymentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Record Payment</h1>
      </div>
      <Suspense fallback={<div>Loading payment form...</div>}>
        <PaymentForm />
      </Suspense>
    </div>
  )
}
