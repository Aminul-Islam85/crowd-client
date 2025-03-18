import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Get logged-in user

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/campaigns/${id}`);
        if (!response.ok) throw new Error("Failed to fetch campaign details");
        const data = await response.json();
        setCampaign(data);
        setForm(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  // ✅ Handle Edit Campaign
  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userEmail: user.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setCampaign(data.campaign);
      setEditMode(false);
      setMessage("Campaign updated successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // ✅ Handle Delete Campaign
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("Campaign deleted successfully!");
      navigate("/campaigns");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // ✅ Handle Donations
  const handleDonate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!donorName || !donationAmount || !donorEmail) {
      setMessage("All fields are required (amount, donor name, donor email)");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${id}/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donationAmount, donorName, donorEmail }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Donation failed");

      setMessage("Donation successful!");
      setCampaign((prev) => ({
        ...prev,
        donations: [...(prev.donations || []), { amount: donationAmount, donorName, donorEmail }],
      }));

      setDonationAmount("");
      setDonorName("");
      setDonorEmail("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!campaign) return <p className="text-center text-gray-600">Campaign not found</p>;

  return (
    <div className="p-6">
      <div className="card max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        <figure>
          <img src={campaign.image} alt={campaign.title} className="w-full h-60 object-cover rounded-t-lg" />
        </figure>
        <div className="p-6">
          {editMode ? (
            <>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input w-full mb-2" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="textarea w-full mb-2"></textarea>
              <button onClick={handleEdit} className="btn btn-success w-full">Save Changes</button>
              <button onClick={() => setEditMode(false)} className="btn btn-outline w-full mt-2">Cancel</button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-primary">{campaign.title}</h1>
              <p className="text-gray-600">{campaign.description}</p>
              <p><span className="font-bold">Goal:</span> ${campaign.goal}</p>
              <p><span className="font-bold">Min Donation:</span> ${campaign.minDonation}</p>
              <p><span className="font-bold">Deadline:</span> {new Date(campaign.deadline).toDateString()}</p>
            </>
          )}

          {/* ✅ Show Edit & Delete Buttons (Only for Owner) */}
          {user?.email === campaign.userEmail && (
            <div className="mt-4 flex gap-4">
              <button onClick={() => setEditMode(!editMode)} className="btn btn-warning">Edit</button>
              <button onClick={handleDelete} className="btn btn-error">Delete</button>
            </div>
          )}

          {message && <p className={`text-center mt-3 ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>}

          {/* ✅ Donation Form */}
          <form className="mt-6" onSubmit={handleDonate}>
            <input type="text" placeholder="Your Name" className="input input-bordered w-full mb-3" value={donorName} onChange={(e) => setDonorName(e.target.value)} required />
            <input type="email" placeholder="Your Email" className="input input-bordered w-full mb-3" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} required />
            <input type="number" placeholder="Donation Amount" className="input input-bordered w-full mb-3" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} required />
            <button type="submit" className="btn btn-primary w-full">Donate Now</button>
          </form>

          {/* ✅ Display Donations */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-secondary">Donations</h2>
            {campaign.donations?.length > 0 ? (
              <ul className="mt-2">
                {campaign.donations.map((donation, index) => (
                  <li key={index} className="border-b py-2">
                    <span className="font-semibold">{donation.donorName}</span> 
                    {" "}donated ${donation.amount} on {new Date(donation.date).toLocaleDateString()}
                    {" "}({donation.donorEmail})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No donations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
