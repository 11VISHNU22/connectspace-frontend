import { useNavigate, NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
export default function SignupPage() {
  const { handleMessage, setLogin } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    async function handleReload() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLogin(data.user, data.consultationDetails);
        }
      } catch (e) {
        console.log(e);
      }
    }
    handleReload();
  }, []);
  async function handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const userName = formData.get("userName");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            userName: userName,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        handleMessage(data.message);
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  }
  const handleGoogleLogin = (credentialResponse) => {
    console.log("Google login response:", credentialResponse);
    // You can send the token to your backend for verification if needed
    // After handling the response, navigate to the homepage
    navigate("/");
  };
  return (
    <div
      className="h-screen flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-800 sm:pt-0"
      style={{ height: "calc(100vh - 74.6px)" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-7">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h1>
        <GoogleOAuthProvider clientId="904667711062-sbqj8330jo8nc9da84a5s68kieul9o2t.apps.googleusercontent.com">
            <GoogleLogin
              text="signin_with"
              onSuccess={(credentialResponse) => {
                handleGoogleLogin(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </GoogleOAuthProvider>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              User Name
            </label>
            <input
              required={true}
              type="text"
              id="userName"
              name="userName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              required={true}
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              required={true}
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          >
            Sign Up
          </button>
          <div className="text-right">
            Account Exists?{" "}
            <NavLink to="/login" className="underline">
              Login
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
