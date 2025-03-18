import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AddCampaign from "./pages/AddCampaign";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";
import MyDonations from "./pages/MyDonations";


const PrivateRoute = ({ children }) => {
  const [user] = useAuthState(auth);
  const location = useLocation();

  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-campaign" element={<PrivateRoute><AddCampaign /></PrivateRoute>} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          <Route path="/my-donations" element={<PrivateRoute><MyDonations /></PrivateRoute>} />
        </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
