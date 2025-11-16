"use client";

import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error"

  // const handleLogin = async (loginData) => {
  //   try {
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login`,
  //       {
  //         username: loginData.username,
  //         password: loginData.password,
  //       }
  //     );

  //     setMessage(`Login success! Token: ${res.data.token}`);
  //     setStatus("success");
  //     console.log(res.data);

  //     const userAuth = {
  //       username: loginData.username,
  //       role: res.data.role,
  //     };
  //     setUser(userAuth);
  //   } catch (err) {
  //     setMessage("Login failed: " + (err.response?.data?.error || "Error"));
  //     setStatus("error");
  //     console.error(err);
  //   }
  // };

  // const handleLogin = async (loginData) => {
  //   try {
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login`,
  //       {
  //         username: loginData.username,
  //         password: loginData.password,
  //       }
  //     );

  //     const token = res.data.token;
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //     setMessage("Login berhasil!");
  //     setStatus("success");

  //     const userAuth = {
  //       username: loginData.username,
  //       role: res.data.role,
  //       token: token,
  //     };
  //     setUser(userAuth);
  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.error || err.message || "Terjadi kesalahan";
  //     setMessage("Login gagal: " + errorMessage);
  //     setStatus("error");
  //     console.error(err);

  //     // PENTING: Throw error lagi agar LoginPage tahu login gagal
  //     throw err;
  //   }
  // };

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

      console.log("Response status:", res.status);
      console.log("Response data:", res.data);

      // Validasi response - PENTING!
      if (!res.data || !res.data.token || !res.data.role) {
        console.log("Response tidak valid!");
        throw new Error("Invalid response from server");
      }

      const token = res.data.token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setMessage("Login berhasil!");
      setStatus("success");

      const userAuth = {
        username: loginData.username,
        role: res.data.role,
        token: token,
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
    <div className="App">
      {message && (
        <Alert
          variant={status === "error" ? "destructive" : "default"}
          className="fixed top-4 right-4 w-96 z-50"
        >
          <AlertTitle>{status === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
