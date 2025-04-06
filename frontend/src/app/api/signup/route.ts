import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/domain/models/User";

export async function POST(request: Request) {
  try {
    // Connect to your database
    await dbConnect();

    // Parse the incoming JSON request body
    const { username, password } = await request.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // Return a 400 Bad Request if the username already exists
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 },
      );
    }

    // Create and save the new user
    const user = new User({ username, password });
    await user.save();

    // Return a success response with a 201 status code
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
