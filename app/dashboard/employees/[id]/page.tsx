import { getEmployeeById } from "@/app/actions/employees"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Edit, CalendarClock } from "lucide-react"

export default async function EmployeeDetailsPage({ params }: { params: { id: string } }) {
  const { success, employee, error } = await getEmployeeById(params.id)

  if (!success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Employee Details</h1>
          <Button asChild variant="outline">
            <Link href="/dashboard/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Employees
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Error loading employee: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Employee Details</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Employees
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/employees/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Basic details about the employee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{employee.employeeId}</p>
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
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{employee.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aadhar Number</p>
                <p className="font-medium">{employee.aadhar}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Daily Wage</p>
              <p className="font-medium">₹{employee.dailyWage}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Assignment</CardTitle>
            <CardDescription>Current project assignment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.currentProject ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Project</p>
                  <p className="font-medium">{employee.currentProject.siteName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Project ID</p>
                  <p className="font-medium">{employee.currentProject.projectId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Project Status</p>
                  <Badge
                    className={
                      employee.currentProject.status === "Active"
                        ? "bg-green-500 hover:bg-green-600"
                        : employee.currentProject.status === "Completed"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : employee.currentProject.status === "Pending"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-red-500 hover:bg-red-600"
                    }
                  >
                    {employee.currentProject.status}
                  </Badge>
                </div>
                <div className="pt-2">
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/employees/${params.id}/transfer`}>Transfer to Another Project</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-center py-4">Not currently assigned to any project.</p>
                <div className="pt-2">
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/employees/${params.id}/transfer`}>Assign to Project</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Recent attendance records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center py-4">Attendance history will be displayed here.</p>
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href={`/dashboard/attendance?employeeId=${params.id}`}>
                  <CalendarClock className="mr-2 h-4 w-4" />
                  View Full Attendance
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
