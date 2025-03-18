import { useEffect, useState } from "react";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/campaigns"); // Replace with your actual backend URL
        if (!response.ok) throw new Error("Failed to fetch campaigns");
        const data = await response.json();
        setCampaigns(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary text-center">All Campaigns</h1>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="card w-96 bg-white shadow-xl border rounded-lg">
            <figure>
              <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover rounded-t-lg" />
            </figure>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-primary">{campaign.title}</h2>
              <p className="text-gray-600">{campaign.description}</p>

              <div className="mt-3">
                <p><span className="font-bold text-secondary">Type:</span> {campaign.type}</p>
                <p><span className="font-bold text-secondary">Goal:</span> ${campaign.goal}</p>
                <p><span className="font-bold text-secondary">Min Donation:</span> ${campaign.minDonation}</p>
                <p><span className="font-bold text-secondary">Deadline:</span> {new Date(campaign.deadline).toDateString()}</p>
              </div>

              <button className="btn btn-primary mt-4 w-full">Donate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
