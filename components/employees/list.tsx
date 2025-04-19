import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getEmployees } from "@/app/actions/employees"
import Link from "next/link"

export async function EmployeesList() {
  const { success, employees, error } = await getEmployees()

  if (!success) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading employees: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!employees || employees.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No employees found. Add your first employee to get started.</p>
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Aadhar</TableHead>
              <TableHead>Current Project</TableHead>
              <TableHead>Daily Wage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell className="font-medium">{employee.employeeId}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.aadhar}</TableCell>
                <TableCell>{employee.currentProject ? employee.currentProject.siteName : "Not Assigned"}</TableCell>
                <TableCell>₹{employee.dailyWage}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link href={`/dashboard/employees/${employee._id}`} passHref>
                        <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                      </Link>
                      <Link href={`/dashboard/employees/${employee._id}/edit`} passHref>
                        <DropdownMenuItem className="cursor-pointer">Edit Employee</DropdownMenuItem>
                      </Link>
                      <Link href={`/dashboard/employees/${employee._id}/history`} passHref>
                        <DropdownMenuItem className="cursor-pointer">View Work History</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/employees/${employee._id}/transfer`} passHref>
                        <DropdownMenuItem className="cursor-pointer">Transfer Employee</DropdownMenuItem>
                      </Link>
                      <Link href={`/dashboard/employees/${employee._id}/status`} passHref>
                        <DropdownMenuItem className="cursor-pointer">
                          {employee.status === "Active" ? "Deactivate Employee" : "Activate Employee"}
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
