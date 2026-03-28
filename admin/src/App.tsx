import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Users from './pages/Users'
import Clients from './pages/Clients'
import Notifications from './pages/Notifications'
import ProjectMembers from './pages/ProjectMembers'
import CustomFields from './pages/CustomFields'
import SalesKit from './pages/SalesKit'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加載中...</div>
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLogout={() => setIsLoggedIn(false)} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/users" element={<Users />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/project-members" element={<ProjectMembers />} />
            <Route path="/custom-fields" element={<CustomFields />} />
            <Route path="/sales-kit" element={<SalesKit />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
