import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/campaigns");
        if (!response.ok) throw new Error("Failed to fetch campaigns");
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-primary text-center">Welcome to Crowdcube</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading campaigns...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="card w-96 bg-white shadow-lg border rounded-lg">
              <figure>
                <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover rounded-t-lg" />
              </figure>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-primary">{campaign.title}</h2>
                <p className="text-gray-600">{campaign.description}</p>
                <Link to={`/campaigns/${campaign._id}`} className="btn btn-primary mt-3 w-full">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
