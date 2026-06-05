import React from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import TrackerPage from './pages/tracker/TrackerPage.jsx'
import DashboardPage from './pages/dashboard/DashboardPage.jsx'

export const router = createHashRouter([
  { path: '/',          element: <LandingPage /> },
  { path: '/tracker',   element: <TrackerPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '*',          element: <Navigate to="/" replace /> },
])
