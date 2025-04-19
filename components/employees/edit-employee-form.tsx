"use client"

import type React from "react"
import type { IEmployee } from "@/models/Employee"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateEmployee } from "@/app/actions/employees"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface EditEmployeeFormProps {
  employee: IEmployee
}

export function EditEmployeeForm({ employee }: EditEmployeeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await updateEmployee(employee._id, formData)

      if (result.success) {
        toast({
          title: "Employee updated",
          description: "Employee has been updated successfully.",
        })
        router.push(`/dashboard/employees/${employee._id}`)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update employee",
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
        <CardTitle>Edit Employee</CardTitle>
        <CardDescription>Update the details for {employee.name}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Enter full name" defaultValue={employee.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" placeholder="Enter phone number" defaultValue={employee.phone} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input
                id="aadhar"
                name="aadhar"
                placeholder="Enter Aadhar number"
                defaultValue={employee.aadhar}
                required
              />
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
                defaultValue={employee.dailyWage}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={employee.status}>
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
            {isLoading ? "Updating..." : "Update Employee"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
