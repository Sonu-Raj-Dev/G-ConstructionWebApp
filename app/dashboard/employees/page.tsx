import { EmployeesHeader } from "@/components/employees/header"
import { EmployeesList } from "@/components/employees/list"

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <EmployeesHeader />
      <EmployeesList />
    </div>
  )
}
