import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/campaigns/${id}`); // Backend API endpoint
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

          <button className="btn btn-primary mt-6 w-full">Donate Now</button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
