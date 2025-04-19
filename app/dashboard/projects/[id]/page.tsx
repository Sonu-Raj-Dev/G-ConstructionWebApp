import { getProjectById } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"
import { ArrowLeft, Edit, IndianRupee, Users } from "lucide-react"

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { success, project, error } = await getProjectById(params.id)

  if (!success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Project Details</h1>
          <Button asChild variant="outline">
            <Link href="/dashboard/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Error loading project: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Project Details</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/projects/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Basic details about the project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Project ID</p>
                <p className="font-medium">{project.projectId}</p>
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

            <div>
              <p className="text-sm text-muted-foreground">Site Name</p>
              <p className="font-medium">{project.siteName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Site Address</p>
              <p className="font-medium">{project.siteAddress}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {project.startDate ? format(new Date(project.startDate), "dd MMM yyyy") : "Not Started"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {project.endDate ? format(new Date(project.endDate), "dd MMM yyyy") : "Not Set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Details about the client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Client Name</p>
              <p className="font-medium">{project.clientName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Client Contact</p>
              <p className="font-medium">{project.clientContact}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
            <CardDescription>Payment details for the project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Payment Agreed</p>
                <p className="font-medium">₹{project.totalPaymentAgreed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Received</p>
                <p className="font-medium">₹{project.paymentReceived.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="font-medium">₹{(project.totalPaymentAgreed - project.paymentReceived).toLocaleString()}</p>
            </div>

            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href={`/dashboard/payments/new?projectId=${params.id}`}>
                  <IndianRupee className="mr-2 h-4 w-4" />
                  Record Payment
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Employees</CardTitle>
            <CardDescription>Employees working on this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center py-4">Employee assignment data will be displayed here.</p>
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href={`/dashboard/projects/${params.id}/employees`}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Employees
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
