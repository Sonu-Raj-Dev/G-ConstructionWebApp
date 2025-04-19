"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EmployeeReportsProps {
  data: {
    success: boolean
    reports?: any[]
    error?: string
  }
}

export function EmployeeReports({ data }: EmployeeReportsProps) {
  const { success, reports, error } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Performance Report</CardTitle>
        <CardDescription>Attendance and payment summary for the current month</CardDescription>
      </CardHeader>
      <CardContent>
        {!success ? (
          <p className="text-red-500">Error loading employee reports: {error}</p>
        ) : reports && reports.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Days Present</TableHead>
                <TableHead>Days Absent</TableHead>
                <TableHead>Half Days</TableHead>
                <TableHead>Total Payments</TableHead>
                <TableHead>Avg. Daily Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.employee._id}>
                  <TableCell className="font-medium">{report.employee.name}</TableCell>
                  <TableCell>{report.project ? report.project.siteName : "Not Assigned"}</TableCell>
                  <TableCell>{report.daysPresent}</TableCell>
                  <TableCell>{report.daysAbsent}</TableCell>
                  <TableCell>{report.halfDays}</TableCell>
                  <TableCell>₹{report.totalPayments.toLocaleString()}</TableCell>
                  <TableCell>₹{report.avgDailyRate.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4">No employee reports found. Mark attendance to see data here.</p>
        )}
      </CardContent>
    </Card>
  )
}
