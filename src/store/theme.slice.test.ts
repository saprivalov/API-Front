import { describe, it, expect, beforeEach, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer, { toggleTheme } from './theme.slice'

function makeStore(preloadedIsDark?: boolean) {
  return configureStore({
    reducer: { theme: themeReducer },
    preloadedState:
      preloadedIsDark !== undefined ? { theme: { isDark: preloadedIsDark } } : undefined,
  })
}

describe('theme slice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to light mode when localStorage is empty', () => {
    const store = makeStore()
    expect(store.getState().theme.isDark).toBe(false)
  })

  it('initializes to dark mode when localStorage has theme=dark', async () => {
    localStorage.setItem('theme', 'dark')
    vi.resetModules()
    const { default: freshReducer } = await import('./theme.slice')
    const store = configureStore({ reducer: { theme: freshReducer } })
    expect(store.getState().theme.isDark).toBe(true)
  })

  it('initializes to light mode when localStorage has theme=light', () => {
    localStorage.setItem('theme', 'light')
    const store = makeStore()
    expect(store.getState().theme.isDark).toBe(false)
  })

  it('toggleTheme switches from light to dark', () => {
    const store = makeStore()
    store.dispatch(toggleTheme())
    expect(store.getState().theme.isDark).toBe(true)
  })

  it('toggleTheme switches from dark to light', () => {
    const store = makeStore(true)
    store.dispatch(toggleTheme())
    expect(store.getState().theme.isDark).toBe(false)
  })

  it('toggleTheme persists dark theme to localStorage', () => {
    const store = makeStore()
    store.dispatch(toggleTheme())
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggleTheme persists light theme to localStorage', () => {
    const store = makeStore(true)
    store.dispatch(toggleTheme())
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('two toggles return to original state', () => {
    const store = makeStore()
    store.dispatch(toggleTheme())
    store.dispatch(toggleTheme())
    expect(store.getState().theme.isDark).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
