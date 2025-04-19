"use client"

import type React from "react"
import type { IProject } from "@/models/Project"
import type { IEmployee } from "@/models/Employee"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createPayment } from "@/app/actions/payments"
import { getProjects } from "@/app/actions/projects"
import { getEmployees } from "@/app/actions/employees"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

export function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentType, setPaymentType] = useState("Received")
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [projects, setProjects] = useState<IProject[]>([])
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Fetch projects and employees when component mounts
  useEffect(() => {
    async function fetchData() {
      const projectsResult = await getProjects()
      const employeesResult = await getEmployees()

      if (projectsResult.success) {
        setProjects(projectsResult.projects)
      }

      if (employeesResult.success) {
        setEmployees(employeesResult.employees)
      }

      // Check if projectId is provided in the URL
      const projectId = searchParams.get("projectId")
      if (projectId) {
        setSelectedProject(projectId)
      }
    }

    fetchData()
  }, [searchParams])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("type", paymentType)

      const result = await createPayment(formData)

      if (result.success) {
        toast({
          title: "Payment recorded",
          description: `Transaction ${result.transactionId} has been recorded successfully.`,
        })
        router.push("/dashboard/reports")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to record payment",
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

  // Filter employees based on selected project if payment type is "Paid"
  const filteredEmployees =
    paymentType === "Paid" && selectedProject
      ? employees.filter((employee) => employee.currentProject && employee.currentProject._id === selectedProject)
      : employees

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
        <CardDescription>Enter the details for the payment transaction</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <RadioGroup
              defaultValue="Received"
              className="flex gap-4"
              value={paymentType}
              onValueChange={setPaymentType}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Received" id="received" />
                <Label htmlFor="received">Payment Received</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Paid" id="paid" />
                <Label htmlFor="paid">Payment Made</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentType === "Received" ? (
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
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectId">Project (Optional)</Label>
                <Select name="projectId" value={selectedProject} onValueChange={setSelectedProject}>
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
                <Label htmlFor="employeeId">Employee (Optional)</Label>
                <Select name="employeeId" value={selectedEmployee} onValueChange={setSelectedEmployee}>
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
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" name="amount" type="number" placeholder="Enter amount" min="0" step="100" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select name="paymentMode" defaultValue="Cash">
              <SelectTrigger id="paymentMode">
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Enter payment details" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Record Payment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
