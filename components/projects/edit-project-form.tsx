"use client";

import type React from "react"
import type { IProject } from "@/models/Project"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface EditProjectFormProps {
  project: IProject
}

export function EditProjectForm({ project }: EditProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Format dates for input fields
  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return ""
    return format(new Date(dateString), "yyyy-MM-dd")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await updateProject(project._id, formData)

      if (result.success) {
        toast({
          title: "Project updated",
          description: "Project has been updated successfully.",
        })
        router.push(`/dashboard/projects/${project._id}`)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update project",
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
        <CardTitle>Edit Project</CardTitle>
        <CardDescription>Update the details for {project.siteName}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                placeholder="Enter site name"
                defaultValue={project.siteName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                name="clientName"
                placeholder="Enter client name"
                defaultValue={project.clientName}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteAddress">Site Address</Label>
            <Textarea
              id="siteAddress"
              name="siteAddress"
              placeholder="Enter complete site address"
              defaultValue={project.siteAddress}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientContact">Client Contact</Label>
              <Input
                id="clientContact"
                name="clientContact"
                placeholder="Enter client phone/email"
                defaultValue={project.clientContact}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalPaymentAgreed">Total Payment Agreed (₹)</Label>
              <Input
                id="totalPaymentAgreed"
                name="totalPaymentAgreed"
                type="number"
                placeholder="Enter amount"
                min="0"
                step="1000"
                defaultValue={project.totalPaymentAgreed}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={formatDateForInput(project.startDate)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue={formatDateForInput(project.endDate)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={project.status}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(`/dashboard/projects/${project._id}`)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
