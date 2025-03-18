import express from "express";
import Campaign from "../models/Campaign.js";

const router = express.Router();

// ✅ Add New Campaign
router.post("/", async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json({ message: "Campaign created successfully!", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to add campaign." });
  }
});

// ✅ Get All Campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving campaigns" });
  }
});

// ✅ Get a Single Campaign by ID
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Add a Donation to a Campaign
router.post("/:id/donate", async (req, res) => {
  try {
    const { amount, donorName } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Ensure the campaign has a donations array
    if (!campaign.donations) {
      campaign.donations = [];
    }

    // Add the new donation
    campaign.donations.push({ amount, donorName, date: new Date() });
    await campaign.save();

    res.status(201).json({ message: "Donation added successfully!", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to add donation.", error: error.message });
  }
});

export default router;
