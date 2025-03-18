import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-12 p-6 bg-gray-800 text-white text-center">
      <h2 className="text-2xl font-bold">Crowdcube</h2>
      <p className="mt-2">Empowering change, one campaign at a time.</p>

      <div className="flex justify-center space-x-4 mt-4">
        <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
        <Link to="/campaigns" className="text-gray-400 hover:text-white">All Campaigns</Link>
        <Link to="/about" className="text-gray-400 hover:text-white">About</Link>
        <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
      </div>

      <p className="mt-4 text-gray-400">&copy; {new Date().getFullYear()} Crowdcube. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
