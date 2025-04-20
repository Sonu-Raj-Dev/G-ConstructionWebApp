import mongoose, { Schema, type Document } from "mongoose"

export interface IProject extends Document {
  projectId: string
  siteName: string
  siteAddress: string
  clientName: string
  clientContact?: string
  totalPaymentAgreed: number
  paymentReceived: number
  startDate: Date | null
  endDate: Date | null
  status: "Pending" | "Active" | "Completed" | "Cancelled"
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema: Schema = new Schema(
  {
    projectId: { type: String, required: true, unique: true },
    siteName: { type: String, required: true },
    siteAddress: { type: String, required: true },
    clientName: { type: String, required: true },
    clientContact: { type: String, required: false },
    totalPaymentAgreed: { type: Number, required: true },
    paymentReceived: { type: Number, default: 0 },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Pending", "Active", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
)

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
