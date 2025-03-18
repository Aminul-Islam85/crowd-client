import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Ensure you have AuthContext for user data

const Dashboard = () => {
  const { user } = useAuth(); // Get logged-in user info
  const [campaigns, setCampaigns] = useState([]);
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
      <h1 className="text-3xl font-bold text-primary text-center">My Dashboard</h1>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mt-6">
        <h2 className="text-xl font-bold text-secondary">My Campaigns</h2>
        {campaigns.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="card w-96 bg-white shadow-xl border rounded-lg">
                <figure>
                  <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover rounded-t-lg" />
                </figure>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-primary">{campaign.title}</h2>
                  <p className="text-gray-600">{campaign.description}</p>
                  <p className="text-secondary font-bold">Goal: ${campaign.goal}</p>
                  <p className="text-secondary font-bold">Min Donation: ${campaign.minDonation}</p>
                  <p className="text-secondary font-bold">Deadline: {new Date(campaign.deadline).toDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No campaigns created yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
