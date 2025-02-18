import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.validatePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export interface UserDocument extends mongoose.Document {
  username: string;
  password: string;
  validatePassword(password: string): Promise<boolean>;
}

export default mongoose.model<UserDocument>("User", userSchema);
