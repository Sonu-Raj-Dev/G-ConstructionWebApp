import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  username: string
  password: string
  name: string
  role: "Admin" | "Manager" | "Supervisor"
  email?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Supervisor"],
      default: "Supervisor",
    },
    email: { type: String },
    phone: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
