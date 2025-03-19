import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 🔼 "asc" for ascending, "desc" for descending

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/campaigns");
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

  // 🔄 Sorting Function
  const handleSort = () => {
    const sortedCampaigns = [...campaigns].sort((a, b) => {
      return sortOrder === "asc"
        ? a.minDonation - b.minDonation // Ascending
        : b.minDonation - a.minDonation; // Descending
    });

    setCampaigns(sortedCampaigns);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle order
  };

  if (loading) return <p className="text-center text-gray-600">Loading campaigns...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-primary text-center">All Campaigns</h1>

      {/* 🔽 Sort Button */}
      <div className="flex justify-center mt-4">
        <button onClick={handleSort} className="btn btn-primary">
          Sort by Min Donation {sortOrder === "asc" ? "🔼" : "🔽"}
        </button>
      </div>

      {/* 📌 Display Campaigns */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="card w-96 bg-white shadow-lg border rounded-lg">
            <figure>
              <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover rounded-t-lg" />
            </figure>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-primary">{campaign.title}</h2>
              <p className="text-gray-600">{campaign.description}</p>
              <p className="font-bold text-secondary">Goal: ${campaign.goal}</p>
              <p className="font-bold text-green-500">Min Donation: ${campaign.minDonation}</p>
              <Link to={`/campaigns/${campaign._id}`} className="btn btn-primary mt-3 w-full">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
