import { getEmployeeById } from "@/app/actions/employees"
import { ChangeEmployeeStatusForm } from "@/components/employees/change-status-form"

export default async function ChangeEmployeeStatusPage({ params }: { params: { id: string } }) {
  const { success, employee, error } = await getEmployeeById(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Change Employee Status</h1>
      </div>
      {success ? <ChangeEmployeeStatusForm employee={employee} /> : <p className="text-red-500">Error: {error}</p>}
    </div>
  )
}
