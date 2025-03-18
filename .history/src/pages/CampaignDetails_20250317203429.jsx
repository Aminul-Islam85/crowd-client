import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState(""); // Track donation amount
  const [donorName, setDonorName] = useState(""); // Track donor's name
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/campaigns/${id}`);
        if (!response.ok) throw new Error("Failed to fetch campaign details");
        const data = await response.json();
        setCampaign(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (!donationAmount || donationAmount <= 0) {
      setMessage("Please enter a valid donation amount.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${id}/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donationAmount, donorName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Donation failed");

      setMessage("Donation successful!");
      setCampaign((prev) => ({
        ...prev,
        donations: [...(prev.donations || []), { amount: donationAmount, donorName }],
      }));

      setDonationAmount("");
      setDonorName("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!campaign) return <p className="text-center text-gray-600">Campaign not found</p>;

  return (
    <div className="p-6">
      <div className="card max-w-2xl mx-auto bg-white shadow-xl border rounded-lg">
        <figure>
          <img src={campaign.image} alt={campaign.title} className="w-full h-60 object-cover rounded-t-lg" />
        </figure>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-primary">{campaign.title}</h1>
          <p className="text-gray-600">{campaign.description}</p>

          <div className="mt-4">
            <p><span className="font-bold text-secondary">Type:</span> {campaign.type}</p>
            <p><span className="font-bold text-secondary">Goal:</span> ${campaign.goal}</p>
            <p><span className="font-bold text-secondary">Min Donation:</span> ${campaign.minDonation}</p>
            <p><span className="font-bold text-secondary">Deadline:</span> {new Date(campaign.deadline).toDateString()}</p>
          </div>

          {/* ✅ Donation Form */}
          <div className="mt-6">
  <input 
    type="text" 
    placeholder="Your Name" 
    className="input input-bordered w-full mb-2" 
    value={donorName} 
    onChange={(e) => setDonorName(e.target.value)} 
  />

  <input 
    type="email" 
    placeholder="Enter your email address" // ✅ Updated Placeholder
    className="input input-bordered w-full mb-2" 
    value={donorEmail} 
    onChange={(e) => setDonorEmail(e.target.value)} 
    required // ✅ Ensures email is required before submitting
  />

  <input 
    type="number" 
    placeholder="Donation Amount" 
    className="input input-bordered w-full mb-2" 
    value={donationAmount} 
    onChange={(e) => setDonationAmount(e.target.value)} 
  />

  <button 
    className="btn btn-primary w-full" 
    onClick={handleDonation}
  >
    Donate Now
  </button>
</div>


          {message && <p className={`text-center mt-3 ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>}

          {/* ✅ Display Donations */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-secondary">Donations</h2>
            {campaign.donations?.length > 0 ? (
              <ul className="mt-2">
                {campaign.donations.map((donation, index) => (
                  <li key={index} className="border-b py-2">
                    <span className="font-semibold">{donation.donorName}</span>: ${donation.amount} on {new Date(donation.date).toLocaleDateString()}
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
