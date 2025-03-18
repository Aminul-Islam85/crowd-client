import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ Correct path


const MyDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchDonations = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/campaigns/donations/${user.email}`);
        if (!response.ok) throw new Error("Failed to fetch donations");
        const data = await response.json();
        setDonations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary text-center mb-6">My Donations</h1>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mt-6">
        {donations.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {donations.map((donation, index) => (
              <div key={index} className="p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold text-primary">{donation.campaignTitle}</h2>
                <p className="text-gray-600">
                  <strong>Amount:</strong> ${donation.amount}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong> {new Date(donation.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">No donations made yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyDonations;
