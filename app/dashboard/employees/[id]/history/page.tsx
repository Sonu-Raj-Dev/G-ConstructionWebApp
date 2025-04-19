import { getEmployeeById } from "@/app/actions/employees"
import { getEmployeeWorkHistory } from "@/app/actions/employee-history"
import { EmployeeWorkHistory } from "@/components/employees/work-history"

export default async function EmployeeHistoryPage({ params }: { params: { id: string } }) {
  const employeeResult = await getEmployeeById(params.id)
  const historyResult = await getEmployeeWorkHistory(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Employee Work History</h1>
      </div>
      {employeeResult.success && historyResult.success ? (
        <EmployeeWorkHistory employee={employeeResult.employee} history={historyResult.history} />
      ) : (
        <p className="text-red-500">Error: {employeeResult.error || historyResult.error || "Failed to load data"}</p>
      )}
    </div>
  )
}
