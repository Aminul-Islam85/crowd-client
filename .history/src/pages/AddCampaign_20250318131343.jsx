import { useState } from "react";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const AddCampaign = () => {
  const [user] = useAuthState(auth); // Get logged-in user
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    goal: "",  // ✅ Added goal field
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

    // Ensure goal is provided
    if (!form.goal || form.goal <= 0) {
      alert("Please enter a valid goal amount.");
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
        setForm({
          title: "",
          type: "",
          description: "",
          goal: "", // ✅ Reset goal field after submission
          minDonation: "",
          deadline: "",
          image: "",
        });
      } else {
        alert(data.message || "Failed to add campaign.");
      }
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">Add New Campaign</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Campaign Title" className="input input-bordered w-full" onChange={handleChange} required />

        <select name="type" className="select select-bordered w-full" onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Personal">Personal</option>
          <option value="Startup">Startup</option>
          <option value="Business">Business</option>
          <option value="Creative">Creative</option>
        </select>

        <textarea name="description" placeholder="Description" className="textarea textarea-bordered w-full" onChange={handleChange} required />

        <input type="number" name="goal" placeholder="Goal Amount" className="input input-bordered w-full" onChange={handleChange} required />

        <input type="number" name="minDonation" placeholder="Minimum Donation Amount" className="input input-bordered w-full" onChange={handleChange} required />

        <input type="date" name="deadline" className="input input-bordered w-full" onChange={handleChange} required />

        <input type="text" name="image" placeholder="Image URL" className="input input-bordered w-full" onChange={handleChange} required />

        <button type="submit" className="btn btn-primary w-full">Add Campaign</button>
      </form>
    </div>
  );
};

export default AddCampaign;
