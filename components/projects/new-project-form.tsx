"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"

export function NewProjectForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await createProject(formData)

      if (result.success) {
        toast({
          title: "Project created",
          description: `Project ${result.projectId} has been created successfully.`,
        })
        router.push("/dashboard/projects")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create project",
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
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>Enter the details for the new construction project</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" name="siteName" placeholder="Enter site name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" name="clientName" placeholder="Enter client name" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteAddress">Site Address</Label>
            <Textarea id="siteAddress" name="siteAddress" placeholder="Enter complete site address" required />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientContact">Client Contact (Optional)</Label>
              <Input id="clientContact" name="clientContact" placeholder="Enter client phone/email" />
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
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Expected Start Date</Label>
              <Input id="startDate" name="startDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Expected End Date</Label>
              <Input id="endDate" name="endDate" type="date" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader size="sm" />
                <span>Creating...</span>
              </div>
            ) : (
              "Create Project"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
