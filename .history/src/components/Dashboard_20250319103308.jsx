import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth(); 
  const [campaigns, setCampaigns] = useState([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserCampaigns = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/campaigns/user/${user.email}`);
        if (!response.ok) throw new Error("Failed to fetch your campaigns");
        const data = await response.json();
        setCampaigns(data);

        
        const total = data.reduce((sum, campaign) => {
          return sum + (campaign.donations?.reduce((dSum, d) => dSum + d.amount, 0) || 0);
        }, 0);
        setTotalFunds(total);

        
        const active = data.filter((campaign) => new Date(campaign.deadline) > new Date()).length;
        setActiveCampaigns(active);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCampaigns();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary text-center mb-6">My Dashboard</h1>

      
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">Total Campaigns</h2>
          <p className="text-3xl font-bold text-primary">{campaigns.length}</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">Total Funds Raised</h2>
          <p className="text-3xl font-bold text-pink-500">${totalFunds}</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">Active Campaigns</h2>
          <p className="text-3xl font-bold text-green-500">{activeCampaigns}</p>
        </div>
      </div>

      
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-2xl font-bold text-primary">My Campaigns</h2>
        <div className="flex gap-4">
          <Link to="/campaigns" className="btn btn-outline btn-primary">
            Browse Campaigns
          </Link>
          <Link to="/add-campaign" className="btn btn-primary">
            Create Campaign
          </Link>
        </div>
      </div>

      
      {loading && <p className="text-center text-gray-600 mt-6">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}

      <div className="mt-6">
        {campaigns.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="card w-96 bg-white shadow-md rounded-lg">
                <figure>
                  <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover rounded-t-lg" />
                </figure>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-primary">{campaign.title}</h2>
                  <p className="text-gray-600">{campaign.description}</p>
                  <p className="text-secondary font-bold">Goal: ${campaign.goal}</p>
                  <p className="text-secondary font-bold">Min Donation: ${campaign.minDonation}</p>
                  <p className="text-secondary font-bold">Deadline: {new Date(campaign.deadline).toDateString()}</p>
                  <Link to={`/campaigns/${campaign._id}`} className="btn btn-primary mt-4 w-full">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">No campaigns created yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
