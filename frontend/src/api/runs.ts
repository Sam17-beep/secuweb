"use server";
import Run from "@/domain/models/Run";
import dbConnect from "../lib/mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function addRun(time: string, distance: string, token: string) {
  await dbConnect();

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const run = new Run({
      userId,
      time,
      distance,
    });

    await run.save();
    const serializedRun = {
      ...run.toObject(),
      userId: run.userId.toString(),
      _id: run._id.toString(),
    };

    return serializedRun;
  } catch (error) {
    console.error("Error in addRun:", error);
    throw new Error("Failed to add new run");
  }
}

export async function fetchRuns(token: string) {
  await dbConnect();

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const runs = await Run.find({ userId }).sort({ date: -1 });

    const serializedRuns = runs.map((run) => ({
      ...run.toObject(),
      userId: run.userId.toString(),
      _id: run._id.toString(),
    }));

    return serializedRuns;
  } catch (error) {
    console.error("Error in fetchRuns:", error);
    throw new Error("Failed to fetch runs");
  }
}
