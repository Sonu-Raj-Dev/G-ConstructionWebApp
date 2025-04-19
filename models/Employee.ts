import mongoose, { Schema, type Document } from "mongoose"

export interface IEmployee extends Document {
  employeeId: string
  name: string
  aadhar: string
  phone: string
  dailyWage: number
  status: "Active" | "Inactive" | "On Leave"
  currentProject: mongoose.Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

const EmployeeSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    aadhar: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dailyWage: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave"],
      default: "Active",
    },
    currentProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema)
