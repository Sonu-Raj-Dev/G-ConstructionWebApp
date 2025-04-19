import { AttendanceHeader } from "@/components/attendance/header"
import { AttendanceForm } from "@/components/attendance/form"
import { AttendanceList } from "@/components/attendance/list"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <AttendanceHeader />
      <AttendanceForm />
      <AttendanceList />
    </div>
  )
}
