import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          try {
            await loginWithGoogle(credential);
            navigate("/");
          } catch {
            alert("Login failed. Please try again.");
          }
        },
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        { theme: "outline", size: "large", width: 280 }
      );
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [loginWithGoogle, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">📋</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Inventory Manager</h1>
        <p className="text-gray-500 text-sm mb-8">Sign in to manage your inventory</p>
        <div id="google-btn" className="flex justify-center" />
      </div>
    </div>
  );
}
