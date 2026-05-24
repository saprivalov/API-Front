import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ProjectState {
  selectedProjectId: string | null
}

const initialState: ProjectState = { selectedProjectId: null }

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload
    },
  },
})

export const { setSelectedProject } = projectSlice.actions
export default projectSlice.reducer
