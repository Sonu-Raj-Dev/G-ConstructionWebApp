"use client"

import type { IProject } from "@/models/Project"
import type { IEmployee } from "@/models/Employee"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { removeEmployeeFromProject,employeeProjectMapping } from "@/app/actions/employee-actions"

interface ProjectEmployeesManagerProps {
  project: IProject
  employees: IEmployee[]
}

export function ProjectEmployeesManager({ project, employees }: ProjectEmployeesManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Filter employees that are not assigned to any project or assigned to this project
  const availableEmployees = employees.filter(
    (employee) => !employee.currentProject || employee.currentProject._id === project._id,
  )
  const assignedEmployees = employees.filter(
    (employee) => employee.currentProject && employee.currentProject._id === project._id,
  )

  async function handleAssignEmployee() {
    if (!selectedEmployee) return
  
    setIsLoading(true)
  
    try {
      const response = await employeeProjectMapping(selectedEmployee, project._id)
  
      if (response.success) {
        toast({
          title: "Employee assigned",
          description: "Employee has been assigned to the project successfully.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to assign employee",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Assignment failed:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSelectedEmployee("")
    }
  }
  

  async function handleRemoveEmployee(employeeId: string) {
    setIsLoading(true)
    debugger;
    try {
      const result = await removeEmployeeFromProject(employeeId)

      if (result.success) {
        toast({
          title: "Employee removed",
          description: "Employee has been removed from the project successfully.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove employee",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unexpected error while removing employee",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Details about {project.siteName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Project ID</p>
              <p className="font-medium">{project.projectId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Site Name</p>
              <p className="font-medium">{project.siteName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                className={
                  project.status === "Active"
                    ? "bg-green-500 hover:bg-green-600"
                    : project.status === "Completed"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : project.status === "Pending"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-red-500 hover:bg-red-600"
                }
              >
                {project.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assign Employee</CardTitle>
          <CardDescription>Add a new employee to this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="employee">Select Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {availableEmployees
                    .filter((employee) => !employee.currentProject)
                    .map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.name} ({employee.employeeId})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssignEmployee} disabled={isLoading || !selectedEmployee} className="sm:self-end">
              <PlusCircle className="mr-2 h-4 w-4" />
              Assign Employee
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Employees</CardTitle>
          <CardDescription>Employees currently working on this project</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedEmployees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Daily Wage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell className="font-medium">{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEmployee(employee._id)}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No employees assigned to this project yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


