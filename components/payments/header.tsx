import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function PaymentsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/dashboard/payments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Record Payment
          </Link>
        </Button>
      </div>
    </div>
  )
}
