"use client"

import { useState } from "react"
import LoginPage from "../src/components/LoginPage"
import Dashboard from "../src/components/Dashboard"
import "../src/index.css"

export default function Page() {
  const [user, setUser] = useState(null)

  const handleLogin = (loginData) => {
    // Simulate authentication
    const mockUser = {
      username: loginData.username,
      role: loginData.username === "admin" ? "admin" : "operator",
    }
    setUser(mockUser)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <div className="min-h-screen">
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
    </div>
  )
}
