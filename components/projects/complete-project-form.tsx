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
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { AlertTriangle } from "lucide-react"

interface CompleteProjectFormProps {
  project: IProject
}

export function CompleteProjectForm({ project }: CompleteProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("status", "Completed")
      formData.append("siteName", project.siteName)
      formData.append("siteAddress", project.siteAddress)
      formData.append("clientName", project.clientName)
      formData.append("clientContact", project.clientContact)
      formData.append("totalPaymentAgreed", project.totalPaymentAgreed.toString())

      if (project.startDate) {
        formData.append("startDate", new Date(project.startDate).toISOString().split("T")[0])
      }

      const result = await updateProject(project._id, formData)

      if (result.success) {
        toast({
          title: "Project completed",
          description: "Project has been marked as completed successfully.",
        })
        router.push(`/dashboard/projects/${project._id}`)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to complete project",
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

  const pendingPayment = project.totalPaymentAgreed - project.paymentReceived

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Project</CardTitle>
        <CardDescription>Mark {project.siteName} as completed</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Project ID</p>
              <p className="font-medium">{project.projectId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Site Name</p>
              <p className="font-medium">{project.siteName}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Payment Agreed</p>
              <p className="font-medium">₹{project.totalPaymentAgreed.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Received</p>
              <p className="font-medium">₹{project.paymentReceived.toLocaleString()}</p>
            </div>
          </div>

          {pendingPayment > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Pending Payment</p>
                <p className="text-sm text-yellow-700">
                  There is a pending payment of ₹{pendingPayment.toLocaleString()} for this project. Consider collecting
                  all payments before marking the project as complete.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="endDate">Completion Date</Label>
            <Input id="endDate" name="endDate" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} required />
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
            {isLoading ? "Processing..." : "Mark as Complete"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
