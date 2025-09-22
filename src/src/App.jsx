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

  const handleLogin = async (loginData) => {
    try {
      const res = await axios.post(
        `${process.env.SERVER_ENDPOINT}/api/auth/login/error`,
        {
          username: loginData.username,
          password: loginData.password,
        }
      );

      setMessage(`Login success! Token: ${res.data.token}`);
      setStatus("success");
      console.log(res.data);

      const userAuth = {
        username: loginData.username,
        role: res.data.role,
      };
      setUser(userAuth);
    } catch (err) {
      setMessage("Login failed: " + (err.response?.data?.error || "Error"));
      setStatus("error");
      console.error(err);
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
        <Alert variant={status === "error" ? "destructive" : "default"}>
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
