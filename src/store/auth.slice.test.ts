import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { setTokens, clearTokens } from './auth.slice'

function makeStore() {
  return configureStore({ reducer: { auth: authReducer } })
}

describe('auth slice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initial state has null tokens when localStorage is empty', () => {
    const store = makeStore()
    expect(store.getState().auth.accessToken).toBeNull()
    expect(store.getState().auth.refreshToken).toBeNull()
  })

  it('setTokens stores tokens in state and localStorage', () => {
    const store = makeStore()
    store.dispatch(setTokens({ accessToken: 'acc', refreshToken: 'ref' }))

    expect(store.getState().auth.accessToken).toBe('acc')
    expect(store.getState().auth.refreshToken).toBe('ref')
    expect(localStorage.getItem('access_token')).toBe('acc')
    expect(localStorage.getItem('refresh_token')).toBe('ref')
  })

  it('clearTokens removes tokens from state and localStorage', () => {
    const store = makeStore()
    store.dispatch(setTokens({ accessToken: 'acc', refreshToken: 'ref' }))
    store.dispatch(clearTokens())

    expect(store.getState().auth.accessToken).toBeNull()
    expect(store.getState().auth.refreshToken).toBeNull()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })
})
