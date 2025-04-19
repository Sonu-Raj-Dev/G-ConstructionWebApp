"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeReports } from "@/components/reports/employee-reports"
import { ProjectReports } from "@/components/reports/project-reports"
import { PaymentReports } from "@/components/reports/payment-reports"

interface ReportsTabsProps {
  employeeReportsData: any
  projectReportsData: any
  paymentsData: any
}

export function ReportsTabs({ employeeReportsData, projectReportsData, paymentsData }: ReportsTabsProps) {
  return (
    <Tabs defaultValue="employees" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 md:w-auto">
        <TabsTrigger value="employees">Employees</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>
      <TabsContent value="employees" className="space-y-4">
        <EmployeeReports data={employeeReportsData} />
      </TabsContent>
      <TabsContent value="projects" className="space-y-4">
        <ProjectReports data={projectReportsData} />
      </TabsContent>
      <TabsContent value="payments" className="space-y-4">
        <PaymentReports data={paymentsData} />
      </TabsContent>
    </Tabs>
  )
}
