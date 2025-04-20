import { PaymentsHeader } from "@/components/payments/header"
import { PaymentsList } from "@/components/payments/list"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PaymentsHeader />
      <PaymentsList />
    </div>
  )
}
