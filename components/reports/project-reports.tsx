"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

interface ProjectReportsProps {
  data: {
    success: boolean
    reports?: any[]
    error?: string
  }
}

export function ProjectReports({ data }: ProjectReportsProps) {
  const { success, reports, error } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status Report</CardTitle>
        <CardDescription>Financial and progress summary for all projects</CardDescription>
      </CardHeader>
      <CardContent>
        {!success ? (
          <p className="text-red-500">Error loading project reports: {error}</p>
        ) : reports && reports.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Employees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => {
                const progressPercentage = Math.round((report.paymentReceived / report.totalPaymentAgreed) * 100)

                return (
                  <TableRow key={report.project._id}>
                    <TableCell className="font-medium">{report.project.siteName}</TableCell>
                    <TableCell>{report.project.clientName}</TableCell>
                    <TableCell>₹{report.totalPaymentAgreed.toLocaleString()}</TableCell>
                    <TableCell>₹{report.paymentReceived.toLocaleString()}</TableCell>
                    <TableCell>₹{(report.totalPaymentAgreed - report.paymentReceived).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={progressPercentage} className="h-2 w-full" />
                        <span className="text-sm">{progressPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{report.employeeCount}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4">No project reports found. Create projects to see data here.</p>
        )}
      </CardContent>
    </Card>
  )
}
