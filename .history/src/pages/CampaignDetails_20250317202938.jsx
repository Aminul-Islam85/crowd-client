import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donorEmail, setDonorEmail] = useState(""); // New State for Email
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/campaigns/${id}`);
        if (!response.ok) throw new Error("Failed to fetch campaign details");
        const data = await response.json();
        setCampaign(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleDonation = async () => {
    setError(null);
    setSuccessMessage("");

    if (!donorName || !donationAmount || !donorEmail) {
      setError("All fields are required (amount, donorName, donorEmail)");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${id}/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: donationAmount, 
          donorName, 
          donorEmail,  // Include donorEmail 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setCampaign(data.campaign);
      setSuccessMessage("Donation successful!");
      setDonorName("");
      setDonationAmount("");
      setDonorEmail(""); // Reset fields after success
    } catch (err) {
      setError(err.message);
    }
  };

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

          {/* ✅ Add the missing donor email field */}
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
              placeholder="Your Email" 
              className="input input-bordered w-full mb-2" 
              value={donorEmail} 
              onChange={(e) => setDonorEmail(e.target.value)} 
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

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 text-center mt-2">{successMessage}</p>}

          {/* Display Donations */}
          <h2 className="text-xl font-bold text-primary mt-6">Donations</h2>
          {campaign.donations.length > 0 ? (
            <ul className="mt-2">
              {campaign.donations.map((donation, index) => (
                <li key={index} className="border p-2 rounded-lg my-1">
                  <span className="font-bold">{donation.donorName}</span> donated ${donation.amount}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No donations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
