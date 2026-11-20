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
        token: { colorPrimary: '#7c3aed' },
        components: {
          Button: {
            // Yellow buttons; dark text keeps WCAG contrast on yellow
            colorPrimary: '#facc15',
            colorPrimaryHover: '#fde047',
            colorPrimaryActive: '#eab308',
            primaryColor: '#1f2937',
            primaryShadow: '0 2px 0 rgba(234, 179, 8, 0.2)',
            defaultHoverColor: '#a16207',
            defaultHoverBorderColor: '#eab308',
            defaultActiveColor: '#854d0e',
            defaultActiveBorderColor: '#ca8a04',
          },
        },
      }}
    >
      {accessToken ? <DashboardPage /> : <LoginPage />}
    </ConfigProvider>
  )
}
