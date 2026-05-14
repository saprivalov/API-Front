import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, theme as antTheme } from 'antd'
import type { RootState } from './store'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

function AppRoutes() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={accessToken ? <DashboardPage /> : <LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const isDark = useSelector((state: RootState) => state.theme.isDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <ConfigProvider
      theme={{ algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm }}
    >
      <AppRoutes />
    </ConfigProvider>
  )
}
