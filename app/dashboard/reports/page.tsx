import { ReportsHeader } from "@/components/reports/header"
import { ReportsTabs } from "@/components/reports/tabs"
import { getEmployeeReports, getProjectReports } from "@/app/actions/reports"
import { getPayments } from "@/app/actions/payments"

export default async function ReportsPage() {
  // Fetch all data at the page level
  const employeeReportsData = await getEmployeeReports()
  const projectReportsData = await getProjectReports()
  const paymentsData = await getPayments()

  return (
    <div className="space-y-6">
      <ReportsHeader />
      <ReportsTabs
        employeeReportsData={employeeReportsData}
        projectReportsData={projectReportsData}
        paymentsData={paymentsData}
      />
    </div>
  )
}
