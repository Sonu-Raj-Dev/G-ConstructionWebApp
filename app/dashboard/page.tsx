import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardStats } from "@/components/dashboard/stats"
import { ProjectsTable } from "@/components/dashboard/projects-table"
import { RecentAttendance } from "@/components/dashboard/recent-attendance"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardStats />
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectsTable />
        <RecentAttendance />
      </div>
    </div>
  )
}
