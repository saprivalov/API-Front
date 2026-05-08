import { useSelector } from 'react-redux'
import type { RootState } from './store'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  return accessToken ? <DashboardPage /> : <LoginPage />
}
