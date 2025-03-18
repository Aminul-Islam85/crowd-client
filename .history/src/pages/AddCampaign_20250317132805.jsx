import { useState } from "react";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const AddCampaign = () => {
  const [user] = useAuthState(auth); // Get logged-in user
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    minDonation: "",
    deadline: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to create a campaign.");
      return;
    }

    const newCampaign = {
      ...form,
      userEmail: user.email,
      userName: user.displayName || "Anonymous",
    };

    try {
      const response = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Campaign added successfully!");
        setForm({ title: "", type: "", description: "", minDonation: "", deadline: "", image: "" });
      } else {
        alert(data.message || "Failed to add campaign.");
      }
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  return (
    <div>
      <h2>Add New Campaign</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Campaign Title" onChange={handleChange} required />
        <select name="type" onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Personal">Personal</option>
          <option value="Startup">Startup</option>
          <option value="Business">Business</option>
          <option value="Creative">Creative</option>
        </select>
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="number" name="minDonation" placeholder="Minimum Donation Amount" onChange={handleChange} required />
        <input type="date" name="deadline" onChange={handleChange} required />
        <input type="text" name="image" placeholder="Image URL" onChange={handleChange} required />
        <button type="submit">Add Campaign</button>
      </form>
    </div>
  );
};

export default AddCampaign;
