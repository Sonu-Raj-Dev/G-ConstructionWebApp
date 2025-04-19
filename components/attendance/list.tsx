import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { getAttendanceByDate } from "@/app/actions/attendance"
import { format } from "date-fns"

export async function AttendanceList() {
  const today = new Date().toISOString().split("T")[0]
  const { success, attendance, error } = await getAttendanceByDate(today)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!success ? (
          <p className="text-red-500">Error loading attendance: {error}</p>
        ) : attendance && attendance.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Marked By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record._id}>
                  <TableCell className="font-medium">{record.employee.name}</TableCell>
                  <TableCell>{record.project.siteName}</TableCell>
                  <TableCell>
                    {record.status === "Present" ? (
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span>Present</span>
                      </div>
                    ) : record.status === "Absent" ? (
                      <div className="flex items-center">
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        <span>Absent</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Half Day</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{record.paymentGiven ? `₹${record.paymentAmount}` : "-"}</TableCell>
                  <TableCell>{record.paymentGiven ? record.paymentType : "-"}</TableCell>
                  <TableCell>{format(new Date(record.createdAt), "hh:mm a")}</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4">No attendance records for today. Mark attendance to see data here.</p>
        )}
      </CardContent>
    </Card>
  )
}
