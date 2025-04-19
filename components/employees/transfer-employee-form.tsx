"use client"

import type React from "react"
import type { IEmployee } from "@/models/Employee"
import type { IProject } from "@/models/Project"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { transferEmployee } from "@/app/actions/employees"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface TransferEmployeeFormProps {
  employee: IEmployee
  projects: IProject[]
}

export function TransferEmployeeForm({ employee, projects }: TransferEmployeeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Filter out completed and cancelled projects
  const availableProjects = projects.filter(
    (project) => project.status !== "Completed" && project.status !== "Cancelled",
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("projectId", selectedProject)

      const result = await transferEmployee(employee._id, formData)

      if (result.success) {
        toast({
          title: "Employee transferred",
          description: "Employee has been transferred successfully.",
        })
        router.push(`/dashboard/employees/${employee._id}`)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to transfer employee",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Employee</CardTitle>
        <CardDescription>Assign {employee.name} to a different project</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Information</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{employee.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{employee.name}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Project</p>
              <p className="font-medium">
                {employee.currentProject ? (
                  <>
                    {employee.currentProject.siteName} ({employee.currentProject.projectId})
                    <Badge className="ml-2 bg-green-500 hover:bg-green-600">{employee.currentProject.status}</Badge>
                  </>
                ) : (
                  "Not assigned to any project"
                )}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">New Project Assignment</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject} required>
              <SelectTrigger id="projectId">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remove">Remove from current project</SelectItem>
                {availableProjects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.siteName} ({project.projectId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(`/dashboard/employees/${employee._id}`)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Transfer Employee"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
