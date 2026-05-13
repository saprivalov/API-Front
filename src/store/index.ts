import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth.slice'
import themeReducer from './theme.slice'
import { baseApi } from '../api/base.api'

// import side-effects so endpoints are registered before the store is used
import '../api/auth.api'
import '../api/users.api'
import '../api/interview-tasks.api'
import '../api/submissions.api'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
