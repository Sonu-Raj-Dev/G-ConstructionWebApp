"use client";
import type React from "react"
import type { IEmployee } from "@/models/Employee"
import type { IProject } from "@/models/Project"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { markAttendance } from "@/app/actions/attendance"
import { getProjects } from "@/app/actions/projects"
import { getEmployees } from "@/app/actions/employees"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"

export function AttendanceForm() {
  const [paymentGiven, setPaymentGiven] = useState(false)
  const [status, setStatus] = useState("Present")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [projects, setProjects] = useState<IProject[]>([])
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Fetch projects and employees when component mounts
  useEffect(() => {
    async function fetchData() {
      setIsLoadingData(true)
      try {
        const projectsResult = await getProjects()
        const employeesResult = await getEmployees()

        if (projectsResult.success) {
          setProjects(projectsResult.projects)
        }

        if (employeesResult.success) {
          setEmployees(employeesResult.employees)
        }

        // Check if employeeId is provided in the URL
        if (searchParams) {
          const employeeId = searchParams.get("employeeId")
          if (employeeId) {
            setSelectedEmployee(employeeId)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [searchParams])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("date", new Date().toISOString())
      formData.append("paymentGiven", paymentGiven.toString())
      formData.append("markedBy", "admin") // Placeholder for now, would be user ID in real auth system

      const result = await markAttendance(formData)

      if (result.success) {
        toast({
          title: "Attendance marked",
          description: "Attendance has been marked successfully.",
        })
        router.refresh()
        // Reset form
        setPaymentGiven(false)
        setStatus("Present")
        setSelectedProject("")
        setSelectedEmployee("")
        event.currentTarget.reset()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark attendance",
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

  // Filter employees based on selected project
  const filteredEmployees = selectedProject
    ? employees.filter((employee) => employee.currentProject && employee.currentProject._id === selectedProject)
    : employees

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Select an employee and mark their attendance for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader text="Loading data..." />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
        <CardDescription>Select an employee and mark their attendance for today</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectId">Project</Label>
              <Select name="projectId" value={selectedProject} onValueChange={setSelectedProject} required>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee</Label>
              <Select name="employeeId" value={selectedEmployee} onValueChange={setSelectedEmployee} required>
                <SelectTrigger id="employeeId">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEmployees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.name} ({employee.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attendance Status</Label>
            <RadioGroup
              name="status"
              defaultValue="Present"
              className="flex gap-4"
              value={status}
              onValueChange={setStatus}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Present" id="present" />
                <Label htmlFor="present">Present</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Absent" id="absent" />
                <Label htmlFor="absent">Absent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Half Day" id="half-day" />
                <Label htmlFor="half-day">Half Day</Label>
              </div>
            </RadioGroup>
          </div>

          {status !== "Absent" && (
            <div className="flex items-center space-x-2">
              <Switch id="payment" checked={paymentGiven} onCheckedChange={setPaymentGiven} />
              <Label htmlFor="payment">Payment Given Today</Label>
            </div>
          )}

          {paymentGiven && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount (₹)</Label>
                <Input id="paymentAmount" name="paymentAmount" type="number" placeholder="Enter amount" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select name="paymentType" defaultValue="Cash" required>
                  <SelectTrigger id="paymentType">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader size="sm" />
                <span>Marking attendance...</span>
              </div>
            ) : (
              "Mark Attendance"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
