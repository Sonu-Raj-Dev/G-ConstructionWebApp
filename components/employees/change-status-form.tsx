"use client"

import type React from "react"
import type { IEmployee } from "@/models/Employee"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateEmployee } from "@/app/actions/employees"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface ChangeEmployeeStatusFormProps {
  employee: IEmployee
}

export function ChangeEmployeeStatusForm({ employee }: ChangeEmployeeStatusFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(employee.status)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("status", status)
      formData.append("name", employee.name)
      formData.append("aadhar", employee.aadhar)
      formData.append("phone", employee.phone)
      formData.append("dailyWage", employee.dailyWage.toString())

      const result = await updateEmployee(employee._id, formData)

      if (result.success) {
        toast({
          title: "Status updated",
          description: `Employee status has been changed to ${status}.`,
        })
        router.push(`/dashboard/employees/${employee._id}`)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update status",
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
        <CardTitle>Change Employee Status</CardTitle>
        <CardDescription>Update the status for {employee.name}</CardDescription>
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
              <p className="text-sm text-muted-foreground">Current Status</p>
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

          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
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
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
