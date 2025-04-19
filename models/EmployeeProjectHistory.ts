import mongoose, { Schema, type Document } from "mongoose"

export interface IEmployeeProjectHistory extends Document {
  employee: mongoose.Types.ObjectId
  project: mongoose.Types.ObjectId
  assignedDate: Date
  removedDate: Date | null
  createdAt: Date
  updatedAt: Date
  isActive:boolean
}

const EmployeeProjectHistorySchema: Schema = new Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedDate: { type: Date, required: true },
    removedDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true },
)

export default mongoose.models.EmployeeProjectHistory ||
  mongoose.model<IEmployeeProjectHistory>("EmployeeProjectHistory", EmployeeProjectHistorySchema)
