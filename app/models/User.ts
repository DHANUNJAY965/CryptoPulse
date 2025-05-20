import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  createdAt?: Date;
  lastLogin?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    emailVerified: { type: Date },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { timestamps: false }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
