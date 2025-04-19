import { getEmployeeById } from "@/app/actions/employees"
import { EditEmployeeForm } from "@/components/employees/edit-employee-form"

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const { success, employee, error } = await getEmployeeById(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Employee</h1>
      </div>
      {success ? <EditEmployeeForm employee={employee} /> : <p className="text-red-500">Error: {error}</p>}
    </div>
  )
}
