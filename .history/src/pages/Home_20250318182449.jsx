import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick"; // Import Carousel
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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

  // Carousel Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

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

          {/* Carousel for Recent Campaigns */}
          <h2 className="text-2xl font-bold text-primary mt-8 text-center">Recent Campaigns</h2>
          <Slider {...sliderSettings} className="mt-4">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="card w-96 bg-white shadow-lg border rounded-lg mx-auto">
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
          </Slider>

          {/* Extra Sections */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-secondary text-white rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold">Start Your Own Campaign</h2>
              <p className="mt-2">Take the first step towards making a difference.</p>
              <Link to="/add-campaign" className="btn btn-light mt-4">Create Campaign</Link>
            </div>

            <div className="p-6 bg-primary text-white rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold">Join Our Community</h2>
              <p className="mt-2">Stay updated with the latest campaigns and success stories.</p>
              <Link to="/register" className="btn btn-light mt-4">Join Now</Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Home;
