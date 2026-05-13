import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import authReducer from '../store/auth.slice'
import themeReducer from '../store/theme.slice'
import { baseApi } from '../api/base.api'
import '../api/auth.api'
import LoginPage from './LoginPage'

function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  })
}

function renderLoginPage() {
  const store = makeStore()
  const result = render(
    <Provider store={store}>
      <LoginPage />
    </Provider>,
  )
  return { ...result, store }
}

describe('LoginPage', () => {
  it('renders login form by default', () => {
    renderLoginPage()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('outer container has dark mode background class', () => {
    const { container } = renderLoginPage()
    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv.className).toContain('dark:bg-gray-900')
  })

  it('outer container has light mode background class', () => {
    const { container } = renderLoginPage()
    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv.className).toContain('bg-gray-100')
  })

  it('switches to register mode on toggle click', async () => {
    renderLoginPage()
    await userEvent.click(screen.getByRole('button', { name: /create one/i }))
    expect(screen.getByText('Create a new account')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('switches back to login mode from register mode', async () => {
    renderLoginPage()
    await userEvent.click(screen.getByRole('button', { name: /create one/i }))
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
  })
})
