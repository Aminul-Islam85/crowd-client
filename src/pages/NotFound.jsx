import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
      <p className="text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary mt-6">Go Back Home</Link>
    </div>
  );
};

export default NotFound;
