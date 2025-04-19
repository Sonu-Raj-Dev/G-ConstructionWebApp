import { getEmployeeById } from "@/app/actions/employees"
import { getProjects } from "@/app/actions/projects"
import { TransferEmployeeForm } from "@/components/employees/transfer-employee-form"

export default async function TransferEmployeePage({ params }: { params: { id: string } }) {
  const employeeResult = await getEmployeeById(params.id)
  const projectsResult = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transfer Employee</h1>
      </div>
      {employeeResult.success && projectsResult.success ? (
        <TransferEmployeeForm employee={employeeResult.employee} projects={projectsResult.projects} />
      ) : (
        <p className="text-red-500">Error: {employeeResult.error || projectsResult.error || "Failed to load data"}</p>
      )}
    </div>
  )
}
