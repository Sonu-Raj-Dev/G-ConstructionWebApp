import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getPayments } from "@/app/actions/payments"
import { format } from "date-fns"
import Link from "next/link"

export async function PaymentsList() {
  const { success, payments, error } = await getPayments()

  if (!success) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading payments: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No payments found. Record your first payment to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Project/Employee</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>{format(new Date(payment.date), "dd MMM yyyy")}</TableCell>
                <TableCell className="font-medium">{payment.transactionId}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      payment.type === "Received" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                    }
                  >
                    {payment.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.project ? (
                    <Link href={`/dashboard/projects/${payment.project._id}`} className="hover:underline">
                      {payment.project.siteName}
                    </Link>
                  ) : payment.employee ? (
                    <Link href={`/dashboard/employees/${payment.employee._id}`} className="hover:underline">
                      {payment.employee.name}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell>{payment.paymentMode}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      payment.status === "Completed"
                        ? "bg-green-500 hover:bg-green-600"
                        : payment.status === "Pending"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-red-500 hover:bg-red-600"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{payment.description || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
