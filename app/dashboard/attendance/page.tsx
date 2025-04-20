import { AttendanceHeader } from "@/components/attendance/header"
import { AttendanceForm } from "@/components/attendance/form"
import { AttendanceList } from "@/components/attendance/list"
import { Suspense } from "react"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading header...</div>}>
        <AttendanceHeader />
      </Suspense>

      <Suspense fallback={<div>Loading form...</div>}>
        <AttendanceForm />
      </Suspense>

      <Suspense fallback={<div>Loading attendance list...</div>}>
        <AttendanceList />
      </Suspense>
    </div>
  )
}
