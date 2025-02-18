"use server";
import dbConnect from "../lib/mongoose";
import User from "../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function signup(username: string, password: string) {
  await dbConnect();

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const user = new User({ username, password });
  await user.save();
}

export async function login(username: string, password: string) {
  await dbConnect();

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  return token;
}
