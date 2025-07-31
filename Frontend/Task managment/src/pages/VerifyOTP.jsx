import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/input";
import api from "../api/axios";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/verify", { email, otp });
      alert("Account verified! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 shadow-md rounded w-96" onSubmit={handleVerify}>
        <h2 className="text-2xl mb-4">Verify OTP</h2>
        <p className="text-gray-600 mb-2">Check your email: {email}</p>
        <Input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Verify
        </button>
      </form>
    </div>
  );
}
