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
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login`,
        {
          username: loginData.username,
          password: loginData.password,
          rememberMe: loginData.rememberMe, // ✅ Kirim rememberMe
        }
      );

      const token = res.data.token;

      // ✅ Simpan berdasarkan rememberMe
      if (loginData.rememberMe) {
        // Remember Me: Simpan di localStorage (persistent)
        localStorage.setItem("authToken", token);
        localStorage.setItem("rememberMe", "true");
      } else {
        // Tidak Remember Me: Simpan di sessionStorage (hilang saat browser ditutup)
        sessionStorage.setItem("authToken", token);
        localStorage.removeItem("rememberMe");
      }

      // Set token ke axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setMessage("Login berhasil!");
      setStatus("success");

      const userAuth = {
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
        token: token,
      };

      setUser(userAuth);
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Terjadi kesalahan";
      setMessage("Login gagal: " + errorMessage);
      setStatus("error");

      setUser(null);
      throw err;
    }
  };

  const handleLogout = () => {
    // Hapus token dari kedua storage
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("rememberMe");

    // Hapus token dari axios headers
    delete axios.defaults.headers.common["Authorization"];

    // Reset user state
    setUser(null);
  };

  useEffect(() => {
    // Cek apakah ada remember me
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    // Load token dari localStorage atau sessionStorage
    const token = rememberMe
      ? localStorage.getItem("authToken")
      : sessionStorage.getItem("authToken");

    if (!token) return;

    // Set token ke axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/me`
        );

        setUser({
          username: res.data.user.username,
          email: res.data.user.email,
          role: res.data.user.role,
          token: token,
        });
      } catch (err) {
        console.log("Token invalid atau expired:", err);

        // Hapus token yang invalid
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("rememberMe");

        setUser(null);
      }
    };

    fetchUser();
  }, []);

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
