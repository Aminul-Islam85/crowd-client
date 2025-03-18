import { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import toast CSS

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // Redirect after login

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Password validation function
  const validatePassword = (password) => {
    return /[A-Z]/.test(password) && /[a-z]/.test(password) && password.length >= 6;
  };

  // ✅ Handle Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      toast.error("Password must have uppercase, lowercase, and at least 6 characters!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate(from, { replace: true }), 2000);
    } catch (err) {
      toast.error(`Login failed: ${err.message}`);
    }
  };

  // ✅ Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Google Login successful! Redirecting...");
      setTimeout(() => navigate(from, { replace: true }), 2000);
    } catch (err) {
      toast.error(`Google login failed: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
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
