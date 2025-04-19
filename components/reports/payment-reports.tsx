"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface PaymentReportsProps {
  data: {
    success: boolean
    payments?: any[]
    error?: string
  }
}

export function PaymentReports({ data }: PaymentReportsProps) {
  const { success, payments, error } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Transactions Report</CardTitle>
        <CardDescription>All payment transactions for the current month</CardDescription>
      </CardHeader>
      <CardContent>
        {!success ? (
          <p className="text-red-500">Error loading payments: {error}</p>
        ) : payments && payments.length > 0 ? (
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{format(new Date(payment.date), "dd MMM yyyy")}</TableCell>
                  <TableCell className="font-medium">{payment.transactionId}</TableCell>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>
                    {payment.project
                      ? payment.project.siteName
                      : payment.employee
                        ? payment.employee.name
                        : payment.description}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4">No payment transactions found. Record payments to see data here.</p>
        )}
      </CardContent>
    </Card>
  )
}
