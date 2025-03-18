import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRaised, setTotalRaised] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/campaigns");
        if (!response.ok) throw new Error("Failed to fetch campaigns");
        const data = await response.json();

        setCampaigns(data);
        setLoading(false);

        // Calculate total donations raised
        const raised = data.reduce((sum, campaign) => {
          return sum + (campaign.donations?.reduce((donationSum, donation) => donationSum + donation.amount, 0) || 0);
        }, 0);
        setTotalRaised(raised);

        // Count active campaigns
        const now = new Date();
        setActiveCampaigns(data.filter(campaign => new Date(campaign.deadline) > now).length);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-primary text-center">Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading dashboard...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div>
          {/* Key Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mt-6 text-center">
            <div className="p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-bold">Total Campaigns</h2>
              <p className="text-3xl text-primary font-bold">{campaigns.length}</p>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-bold">Total Funds Raised</h2>
              <p className="text-3xl text-secondary font-bold">${totalRaised}</p>
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-bold">Active Campaigns</h2>
              <p className="text-3xl text-green-500 font-bold">{activeCampaigns}</p>
            </div>
          </div>

          {/* Recent Campaigns */}
          <h2 className="text-2xl font-bold text-primary mt-8">Recent Campaigns</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            {campaigns.slice(0, 3).map((campaign) => (
              <div key={campaign._id} className="card w-96 bg-white shadow-lg border rounded-lg">
                <figure>
                  <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover rounded-t-lg" />
                </figure>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-primary">{campaign.title}</h2>
                  <p className="text-gray-600">{campaign.description}</p>
                  <p className="font-bold text-secondary">Goal: ${campaign.goal}</p>
                  <Link to={`/campaigns/${campaign._id}`} className="btn btn-primary mt-3 w-full">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default Home;
