import express from "express";
import Campaign from "../models/Campaign.js";

const router = express.Router();

// Add New Campaign
router.post("/", async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json({ message: "Campaign created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to add campaign." });
  }
});

// Get All Campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving campaigns" });
  }
});

export default router;
