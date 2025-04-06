import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/domain/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// In-memory store for login attempts
const loginAttempts = {};

// Rate limiting parameters
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Helper function to extract IP from request headers
function getClientIP(request: Request) {
  // Try common headers used in proxied environments
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const currentTime = Date.now();

  // Initialize or reset login attempt record for the IP if necessary
  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 0, firstAttempt: currentTime };
  } else if (currentTime - loginAttempts[ip].firstAttempt > WINDOW_MS) {
    // Reset count if the time window has passed
    loginAttempts[ip] = { count: 0, firstAttempt: currentTime };
  }

  // If max attempts reached, return a 429 response
  if (loginAttempts[ip].count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again later." },
      { status: 429 },
    );
  }

  try {
    // Connect to the database
    await dbConnect();

    // Parse the incoming JSON
    const { username, password } = await request.json();

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      // Increment failed attempt count
      loginAttempts[ip].count += 1;
      return NextResponse.json(
        { message: "Check your credentials" },
        { status: 401 },
      );
    }

    // Validate the password
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      // Increment failed attempt count
      loginAttempts[ip].count += 1;
      return NextResponse.json(
        { message: "Check your credentials" },
        { status: 401 },
      );
    }

    // Reset attempt count on successful login
    loginAttempts[ip] = { count: 0, firstAttempt: currentTime };

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
