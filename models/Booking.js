import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  facultyInterest: String,
  studyLevel: String,
  goalText: String,
  aiSummary: String,
  aiRecommendation: String,
  preferredDates: [String],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "pending" }
});

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
