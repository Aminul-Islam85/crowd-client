import express from "express";
import Campaign from "../models/Campaign.js";

const router = express.Router();

// ✅ Add New Campaign
router.post("/", async (req, res) => {
  try {
    console.log("📌 Creating a new campaign:", req.body);

    const campaign = new Campaign(req.body);
    await campaign.save();

    console.log("✅ Campaign created successfully:", campaign);
    res.status(201).json({ message: "Campaign created successfully!", campaign });
  } catch (error) {
    console.error("❌ Error adding campaign:", error.message);
    res.status(500).json({ message: "Server error, failed to add campaign.", error: error.message });
  }
});

// ✅ Get All Campaigns
router.get("/", async (req, res) => {
  try {
    console.log("📌 Fetching all campaigns...");
    const campaigns = await Campaign.find();
    
    console.log(`✅ Retrieved ${campaigns.length} campaigns`);
    res.json(campaigns);
  } catch (error) {
    console.error("❌ Error retrieving campaigns:", error.message);
    res.status(500).json({ message: "Error retrieving campaigns", error: error.message });
  }
});

// ✅ Get a Single Campaign by ID
router.get("/:id", async (req, res) => {
  try {
    console.log(`📌 Fetching campaign with ID: ${req.params.id}`);
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      console.log("❌ Campaign not found");
      return res.status(404).json({ message: "Campaign not found" });
    }

    console.log("✅ Campaign found:", campaign.title);
    res.json(campaign);
  } catch (error) {
    console.error("❌ Error retrieving campaign:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Fetch Campaigns by User Email
router.get("/user/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    console.log(`📌 Fetching campaigns for user: ${userEmail}`);

    const campaigns = await Campaign.find({ userEmail });

    console.log(`✅ Campaigns found: ${campaigns.length}`);
    res.json(campaigns);
  } catch (error) {
    console.error("❌ Error fetching user campaigns:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Add a Donation to a Campaign
router.post("/:id/donate", async (req, res) => {
  try {
    const { amount, donorName, donorEmail } = req.body;
    console.log("🔹 Incoming donation data:", req.body);

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      console.log("❌ Campaign not found");
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Ensure all required fields are provided
    if (!amount || !donorName || !donorEmail) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "All fields are required (amount, donorName, donorEmail)" });
    }

    // Add the new donation
    campaign.donations.push({ amount, donorName, donorEmail, date: new Date() });
    await campaign.save();

    console.log("✅ Donation added successfully!");
    res.status(201).json({ message: "Donation added successfully!", campaign });
  } catch (error) {
    console.error("❌ Error adding donation:", error.message);
    res.status(500).json({ message: "Server error, failed to add donation.", error: error.message });
  }
});

export default router;
