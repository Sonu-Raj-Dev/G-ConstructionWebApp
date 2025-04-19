import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { getProjects } from "@/app/actions/projects"
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

export async function ProjectsTable() {
  const { success, projects, error } = await getProjects()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Overview of your latest projects</CardDescription>
        </div>
        <Link href="/dashboard/projects" className="ml-auto text-sm underline">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {!success ? (
          <p className="text-red-500">Error loading projects: {error}</p>
        ) : projects && projects.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project ID</TableHead>
                <TableHead>Site Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.slice(0, 4).map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{project.projectId}</TableCell>
                  <TableCell>{project.siteName}</TableCell>
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
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/payments/new?projectId=${project._id}`} passHref>
                          <DropdownMenuItem className="cursor-pointer">Add Payment</DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4">No projects found. Create your first project to get started.</p>
        )}
      </CardContent>
    </Card>
  )
}
