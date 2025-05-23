"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CalendarCheck2, IndianRupee, Users } from "lucide-react"
import { getDashboardStats } from "@/app/actions/projects"
import { getEmployeeCount } from "@/app/actions/employees"
import { getTodayAttendanceCount } from "@/app/actions/attendance"
import { Loader } from "@/components/ui/loader"
import Link from "next/link"

export function DashboardStats() {
  const [isLoading, setIsLoading] = useState(true)
  const [projectStats, setProjectStats] = useState<any>(null)
  const [employeeStats, setEmployeeStats] = useState<any>(null)
  const [attendanceStats, setAttendanceStats] = useState<any>(null)

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      try {
        const [projectStatsResult, employeeStatsResult, attendanceStatsResult] = await Promise.all([
          getDashboardStats(),
          getEmployeeCount(),
          getTodayAttendanceCount(),
        ])

        setProjectStats(projectStatsResult)
        setEmployeeStats(employeeStatsResult)
        setAttendanceStats(attendanceStatsResult)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center p-6">
              <Loader size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Link href="/dashboard/projects" className="block transition-transform hover:scale-105">
        <Card className="cursor-pointer hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectStats?.success ? projectStats.stats.activeProjects : "Error"}
            </div>
            <p className="text-xs text-muted-foreground">
              {projectStats?.success ? `${projectStats.stats.totalProjects} total projects` : "Failed to load stats"}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/employees" className="block transition-transform hover:scale-105">
        <Card className="cursor-pointer hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeStats?.success ? employeeStats.totalEmployees : "Error"}</div>
            <p className="text-xs text-muted-foreground">
              {employeeStats?.success ? `${employeeStats.activeEmployees} active employees` : "Failed to load stats"}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/attendance" className="block transition-transform hover:scale-105">
        <Card className="cursor-pointer hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceStats?.success
                ? attendanceStats.presentAttendance + attendanceStats.halfDayAttendance / 2
                : "Error"}
            </div>
            <p className="text-xs text-muted-foreground">
              {attendanceStats?.success && employeeStats?.success
                ? `${Math.round(
                    ((attendanceStats.presentAttendance + attendanceStats.halfDayAttendance / 2) /
                      employeeStats.activeEmployees) *
                      100,
                  )}% of active employees`
                : "Failed to load stats"}
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/payments" className="block transition-transform hover:scale-105">
        <Card className="cursor-pointer hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectStats?.success ? `₹${(projectStats.stats.totalPaymentReceived / 100000).toFixed(1)}L` : "Error"}
            </div>
            <p className="text-xs text-muted-foreground">
              {projectStats?.success ? `From ${projectStats.stats.totalProjects} projects` : "Failed to load stats"}
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
