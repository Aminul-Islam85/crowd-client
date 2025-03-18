import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between p-4 bg-base-300 shadow-md">
      <Link to="/" className="text-xl font-bold text-primary">Crowdcube</Link>
      <div className="space-x-4">
        <Link to="/" className="btn btn-secondary">Home</Link>
        <Link to="/campaigns" className="btn btn-primary">View Campaigns</Link>
      </div>
    </nav>
  );
};

export default Navbar;
