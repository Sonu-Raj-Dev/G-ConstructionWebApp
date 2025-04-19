import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getProjects } from "@/app/actions/projects"
import { format } from "date-fns"
import Link from "next/link"

export async function ProjectsList() {
  const { success, projects, error } = await getProjects()

  if (!success) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading projects: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No projects found. Create your first project to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project ID</TableHead>
              <TableHead>Site Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Payment</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell className="font-medium">{project.projectId}</TableCell>
                <TableCell>{project.siteName}</TableCell>
                <TableCell>{project.clientName}</TableCell>
                <TableCell>
                  {project.startDate ? format(new Date(project.startDate), "dd MMM yyyy") : "Pending"}
                </TableCell>
                <TableCell>{project.endDate ? format(new Date(project.endDate), "dd MMM yyyy") : "Pending"}</TableCell>
                <TableCell>₹{project.totalPaymentAgreed.toLocaleString()}</TableCell>
                <TableCell>₹{project.paymentReceived.toLocaleString()}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link href={`/dashboard/projects/${project._id}`} passHref>
                        <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                      </Link>
                      <Link href={`/dashboard/projects/${project._id}/edit`} passHref>
                        <DropdownMenuItem className="cursor-pointer">Edit Project</DropdownMenuItem>
                      </Link>
                      <Link href={`/dashboard/projects/${project._id}/employees`} passHref>
                        <DropdownMenuItem className="cursor-pointer">Manage Employees</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/payments/new?projectId=${project._id}`} passHref>
                        <DropdownMenuItem className="cursor-pointer">Add Payment</DropdownMenuItem>
                      </Link>
                      <Link href={`/dashboard/projects/${project._id}/complete`} passHref>
                        <DropdownMenuItem className="cursor-pointer">Mark as Complete</DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
