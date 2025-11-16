"use client"

import { useEffect, useState } from "react";
import LoginPage from "../src/components/LoginPage"
import Dashboard from "../src/components/Dashboard"
import "../src/index.css"
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";


export default function Page() {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error"


  // const handleLogin = (loginData) => {
  //   // Simulate authentication
  //   const mockUser = {
  //     username: loginData.username,
  //     role: loginData.username === "admin" ? "admin" : "operator",
  //   }
  //   setUser(mockUser)
  // }

  const handleLogin = async (loginData) => {
    try {
      console.log("=== MULAI LOGIN ===");

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login`,
        {
          username: loginData.username,
          password: loginData.password,
        }
      );
      console.log("Username:", loginData.username);
      console.log("Password:", loginData.password);

      console.log("Response status:", res.status);
      console.log("Response data:", res.data);

      // Validasi response
      if (!res.data || !res.data.token) {
        console.log("Response tidak valid!");
        throw new Error("Invalid response from server");
      }

      const token = res.data.token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setMessage("Login berhasil!");
      setStatus("success");

      const userAuth = {
        username: loginData.username,
        token: token,
        email: res.data.email,

      };

      console.log("Setting user:", userAuth);
      setUser(userAuth);

      // Return success
      return { success: true };
    } catch (err) {
      console.log("=== ERROR LOGIN ===");
      console.error("Full error:", err);
      console.error("Error response:", err.response);

      const errorMessage =
        err.response?.data?.error || err.message || "Terjadi kesalahan";
      setMessage("Login gagal: " + errorMessage);
      setStatus("error");

      // PENTING: Pastikan user null saat error
      setUser(null);

      // Throw error agar LoginPage tahu
      throw err;
    }
  };


  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen">
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
    </div>
  )
}
