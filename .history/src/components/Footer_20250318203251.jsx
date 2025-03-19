import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-800 text-white text-center md:text-left">
      <p className="text-gray-400">© {new Date().getFullYear()} Crowdcube. All rights reserved.</p>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2 md:mt-0">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/campaigns" className="hover:text-gray-300">All Campaigns</Link>
        <Link to="/about" className="hover:text-gray-300">About</Link>
        <Link to="/contact" className="hover:text-gray-300">Contact</Link>
      </div>
    </footer>
  );
};

export default Footer;
