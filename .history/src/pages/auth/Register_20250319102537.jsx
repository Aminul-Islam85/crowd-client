import { useState } from "react";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const validatePassword = (password) => {
    return /[A-Z]/.test(password) && /[a-z]/.test(password) && password.length >= 6;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      toast.error("Password must have uppercase, lowercase, and at least 6 characters!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" onChange={handleChange} required />
        <button type="submit" className="btn btn-primary w-full">Register</button>
      </form>
    </div>
  );
};

export default Register;
