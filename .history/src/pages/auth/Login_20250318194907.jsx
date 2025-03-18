import { useState } from "react";
import { auth, googleProvider } from "../../config/firebase"; // ✅ Import Google Provider
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // Get intended route or default to "/"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate(from, { replace: true }); // Redirect to intended route
      }, 2000);
    } catch (err) {
      console.error("Firebase Login Error:", err.code, err.message);
      setError(`Login failed: ${err.message}`);
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);

    try {
      await signInWithPopup(auth, googleProvider);
      setSuccess("Google Login successful! Redirecting...");
      setTimeout(() => {
        navigate(from, { replace: true }); // Redirect to intended route
      }, 2000);
    } catch (err) {
      console.error("Google Login Error:", err.code, err.message);
      setError(`Google login failed: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" onChange={handleChange} required />
        <button type="submit" className="btn btn-primary w-full">Login</button>
      </form>

      <div className="mt-4">
        <p className="text-gray-600">or</p>
        <button onClick={handleGoogleLogin} className="btn btn-secondary w-full mt-2">
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
