import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

const Navbar = () => {
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-base-300 shadow-md">
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
            <Link to="/add-campaign" className="btn btn-outline btn-secondary">Add Campaign</Link>
            <Link to="/my-campaigns" className="btn btn-outline btn-secondary">My Campaigns</Link>
            <Link to="/my-donations" className="btn btn-outline btn-primary">My Donations</Link>
          </>
        )}

        {/* Conditional Login/Register */}
        {!user ? (
          <>
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-outline btn-primary">Register</Link>
          </>
        ) : (
          // If logged in, show user avatar & log out button
          <div className="flex items-center gap-3">
            <div className="relative group">
              {/* User Avatar with Hover Tooltip */}
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 shadow-sm"
              />
              <div className="absolute left-0 mt-1 bg-white text-gray-800 text-sm px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="font-semibold">{user.displayName || "User"}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-error">Log Out</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
