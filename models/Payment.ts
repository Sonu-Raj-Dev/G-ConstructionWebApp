import mongoose, { Schema, type Document } from "mongoose"

export interface IPayment extends Document {
  transactionId: string
  type: "Received" | "Paid"
  project: mongoose.Types.ObjectId | null
  employee: mongoose.Types.ObjectId | null
  amount: number
  paymentMode: "Cash" | "Bank Transfer" | "Cheque" | "UPI" | "Other"
  description: string
  date: Date
  status: "Pending" | "Completed" | "Failed"
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema: Schema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["Received", "Paid"],
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    amount: { type: Number, required: true },
    paymentMode: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Cheque", "UPI", "Other"],
      required: true,
    },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Completed",
    },
  },
  { timestamps: true },
)

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)
