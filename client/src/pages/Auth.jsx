import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Auth = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/api/auth/google", {
        token: credentialResponse.credential,
      });

      console.log("Login Success:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/"); 
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 sm:p-10 w-full max-w-md text-center">
        
        {/* Logo */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Text<span className="text-indigo-500">Learn</span>
        </h1>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 mb-8">
          Sign in to create and save your courses.
        </p>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
