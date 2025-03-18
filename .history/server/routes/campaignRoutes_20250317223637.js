import express from "express";
import Campaign from "../models/Campaign.js";

const router = express.Router();

// ✅ Add New Campaign with Debugging
router.post("/", async (req, res) => {
  try {
    console.log("🔹 Incoming campaign data:", req.body);

    const campaign = new Campaign(req.body);
    await campaign.save();

    console.log("✅ Campaign created successfully:", campaign);
    res.status(201).json({ message: "Campaign created successfully!", campaign });
  } catch (error) {
    console.error("❌ Error adding campaign:", error.message);
    res.status(500).json({ message: "Server error, failed to add campaign.", error: error.message });
  }
});

// ✅ Get All Campaigns with Debugging
router.get("/", async (req, res) => {
  try {
    console.log("📌 Fetching all campaigns...");
    const campaigns = await Campaign.find();
    console.log("✅ Campaigns retrieved:", campaigns.length);
    
    res.json(campaigns);
  } catch (error) {
    console.error("❌ Error retrieving campaigns:", error.message);
    res.status(500).json({ message: "Error retrieving campaigns", error: error.message });
  }
});

// ✅ Get a Single Campaign by ID with Debugging
router.get("/:id", async (req, res) => {
  try {
    console.log(`📌 Fetching campaign with ID: ${req.params.id}`);
    
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      console.warn(`⚠️ Campaign not found: ${req.params.id}`);
      return res.status(404).json({ message: "Campaign not found" });
    }

    console.log("✅ Campaign found:", campaign);
    res.json(campaign);
  } catch (error) {
    console.error("❌ Error fetching campaign:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Add a Donation to a Campaign with Debugging
router.post("/:id/donate", async (req, res) => {
  try {
    const { amount, donorName, donorEmail } = req.body;

    console.log("🔹 Incoming donation data:", req.body);
    
    if (!amount || !donorName || !donorEmail) {
      console.warn("⚠️ Missing fields in donation request:", req.body);
      return res.status(400).json({ message: "All fields are required (amount, donorName, donorEmail)" });
    }

    console.log(`📌 Looking for campaign with ID: ${req.params.id}`);
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      console.warn(`⚠️ Campaign not found: ${req.params.id}`);
      return res.status(404).json({ message: "Campaign not found" });
    }

    console.log("✅ Campaign found:", campaign.title);

    // Ensure donations array exists
    if (!campaign.donations) {
      campaign.donations = [];
    }

    // Add the new donation
    const newDonation = { amount, donorName, donorEmail, date: new Date() };
    campaign.donations.push(newDonation);
    await campaign.save();

    console.log("✅ Donation added successfully:", newDonation);
    res.status(201).json({ message: "Donation added successfully!", campaign });
  } catch (error) {
    console.error("❌ Error adding donation:", error.message);
    res.status(500).json({ message: "Server error, failed to add donation.", error: error.message });
  }
});

export default router;
