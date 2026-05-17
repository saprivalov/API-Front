import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ConfigProvider, theme as antTheme } from 'antd'
import type { RootState } from './store'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const isDark = useSelector((state: RootState) => state.theme.isDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: { colorPrimary: '#16a34a' },
      }}
    >
      {accessToken ? <DashboardPage /> : <LoginPage />}
    </ConfigProvider>
  )
}
