import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import type { Role } from '../schemas/user.schemas'

interface AuthPayload {
  userId: string
  role: Role
}

export function useAuth(): AuthPayload | null {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  if (!accessToken) return null
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    return { userId: payload.sub, role: payload.role }
  } catch {
    return null
  }
}
