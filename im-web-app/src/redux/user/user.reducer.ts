import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../models/user'


interface IUserAction {
  type: string
  payload: User | null
}

interface IUserState {
  currentUser: User | null
}

const INITIAL_STATE: IUserState = {
  currentUser: null
}


const userSlice = createSlice({
  name: 'user',
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentUser (state: IUserState, action: IUserAction) {
      state.currentUser = action.payload
    }
  }
})

export const { setCurrentUser } = userSlice.actions
export default userSlice.reducer