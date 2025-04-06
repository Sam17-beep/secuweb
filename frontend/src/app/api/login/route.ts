import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/domain/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the incoming JSON
    const { username, password } = await request.json();

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Validate the password
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 },
      );
    }

    // Create a JWT token on successful login
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
