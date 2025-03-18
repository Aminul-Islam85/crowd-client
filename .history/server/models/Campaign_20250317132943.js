import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  minDonation: { type: Number, required: true },
  deadline: { type: Date, required: true },
  image: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Campaign", campaignSchema);
