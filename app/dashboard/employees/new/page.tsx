import { NewEmployeeForm } from "@/components/employees/new-employee-form"

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">New Employee</h1>
      </div>
      <NewEmployeeForm />
    </div>
  )
}
