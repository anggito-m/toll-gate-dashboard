"use client"

import { useState } from "react"
import LoginPage from "./components/LoginPage"
import Dashboard from "./components/Dashboard"

function App() {
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
    <div className="App">
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
    </div>
  )
}

export default App
