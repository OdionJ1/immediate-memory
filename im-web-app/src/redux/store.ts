import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import userReducer from './user/user.reducer'
import { RunMode, globalConstants } from '../global-constants'

const store = configureStore({
  reducer: {
    user: userReducer
  },
  //@ts-ignore
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(globalConstants.runMode === RunMode.local ? [logger] : []),
})


export type RootState = ReturnType<typeof store.getState>
export default store