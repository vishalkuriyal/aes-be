import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for User document
export interface IUser extends Document {
  password: string;
  email: string;
}
// Create the User schema
const UserSchema: Schema = new Schema(
  {
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
