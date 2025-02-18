import mongoose from "mongoose"

const runSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: Number, required: true },
  distance: { type: Number, required: true },
  date: { type: Date, default: Date.now },
})

export interface RunDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  time: number
  distance: number
  date: Date
}

export default mongoose.models.Run || mongoose.model<RunDocument>("Run", runSchema)

