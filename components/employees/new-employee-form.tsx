"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createEmployee } from "@/app/actions/employees"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getProjects } from "@/app/actions/projects"

export function NewEmployeeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>()
  // Fetch projects when component mounts
  useEffect(() => {
    async function fetchProjects() {
      const result = await getProjects()
      if (result.success) {
        setProjects(result.projects)
      }
    }
    fetchProjects()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await createEmployee(formData)
      debugger;
      if (result.success) {
        toast({
          title: "Employee created",
          description: `Employee ${result.employeeId} has been created successfully.`,
        })
        router.push("/dashboard/employees")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create employee",
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
        <CardTitle>Create New Employee</CardTitle>
        <CardDescription>Enter the details for the new employee</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Enter full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" placeholder="Enter phone number" required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input id="aadhar" name="aadhar" placeholder="Enter Aadhar number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyWage">Daily Wage (₹)</Label>
              <Input
                id="dailyWage"
                name="dailyWage"
                type="number"
                placeholder="Enter daily wage"
                min="0"
                step="50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">Assign to Project (Optional)</Label>
            <Select name="projectId">
              <SelectTrigger id="projectId">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.siteName} ({project.projectId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="projectId" value={selectedProjectId || ""} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Employee"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
