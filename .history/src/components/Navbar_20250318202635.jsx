import { Link } from "react-router-dom"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { FaUserCircle } from "react-icons/fa"; // Import User Icon

const Navbar = () => {
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <nav className="flex flex-wrap justify-between items-center p-4 bg-base-300 shadow-md">
      {/* Website Name/Logo */}
      <Link to="/" className="text-xl font-bold text-primary">
        Crowdcube
      </Link>

      {/* Navbar Links */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="btn btn-secondary">Home</Link>
        <Link to="/campaigns" className="btn btn-primary">All Campaigns</Link>

        {/* Protected Routes: Show only when user is logged in */}
        {user && (
          <>
            <Link to="/add-campaign" className="btn btn-outline btn-primary">Add Campaign</Link>
            <Link to="/my-campaigns" className="btn btn-outline btn-secondary">My Campaigns</Link>
            <Link to="/my-donations" className="btn btn-outline btn-primary">My Donations</Link>

            {/* User Icon with Hover Details */}
            <div className="relative group flex items-center">
              <FaUserCircle className="text-3xl text-primary cursor-pointer" />
              <div className="absolute hidden group-hover:block bg-white p-2 rounded shadow-md right-0 mt-2">
                <p className="text-sm font-semibold">{user.displayName || "User"}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Log Out Button */}
            <button onClick={handleLogout} className="btn btn-error">Log Out</button>
          </>
        )}

        {/* Conditional Login/Register */}
        {!user && (
          <>
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-outline btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
