import type { IEmployee } from "@/models/Employee"
import type { IEmployeeProjectHistory } from "@/models/EmployeeProjectHistory"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface EmployeeWorkHistoryProps {
  employee: IEmployee
  history: IEmployeeProjectHistory[]
}

export function EmployeeWorkHistory({ employee, history }: EmployeeWorkHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href={`/dashboard/employees/${employee._id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employee
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>Basic details about the employee</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Employee ID</p>
              <p className="font-medium">{employee.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{employee.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                className={
                  employee.status === "Active"
                    ? "bg-green-500 hover:bg-green-600"
                    : employee.status === "Inactive"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-yellow-500 hover:bg-yellow-600"
                }
              >
                {employee.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Wage</p>
              <p className="font-medium">₹{employee.dailyWage}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Assignment History</CardTitle>
          <CardDescription>Record of all project assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Removed Date</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => {
                  const assignedDate = new Date(record.assignedDate)
                  const removedDate = record.removedDate ? new Date(record.removedDate) : null

                  // Calculate duration in days
                  const durationDays = removedDate
                    ? Math.ceil((removedDate.getTime() - assignedDate.getTime()) / (1000 * 60 * 60 * 24))
                    : Math.ceil((new Date().getTime() - assignedDate.getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <TableRow key={record._id}>
                      <TableCell className="font-medium">
                        {record.project.siteName} ({record.project.projectId})
                      </TableCell>
                      <TableCell>{format(assignedDate, "dd MMM yyyy")}</TableCell>
                      <TableCell>{removedDate ? format(removedDate, "dd MMM yyyy") : "Current Assignment"}</TableCell>
                      <TableCell>
                        {durationDays} day{durationDays !== 1 ? "s" : ""}
                        {!removedDate && " (ongoing)"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No project assignment history found for this employee.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
