import React, { useEffect, useState, useRef } from 'react';
import { auth  } from './firebase/firebase.utils';
import { Routes, Route, Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { User } from './models/user';
import { getUserByToken } from './services/user.service';
import { AuthAxiosInstance, withAuthApi } from './common/components/auth/withAuthApi';
import { Toaster } from 'react-hot-toast';
import useSessionHandler from './common/components/auth/useSessionHandler';
import Game from './pages/game/Game';
import './App.css';

interface Props extends AuthAxiosInstance {}

function App({ authApi }: Props) {
  const timer = useRef<NodeJS.Timeout>()
  const currentUser = useSelector<RootState>(({ user: { currentUser }}) => currentUser) as User | null

  const { resumeUserSession, endUserSession, startGoogleUserSession } = useSessionHandler()
  const [cookies] = useCookies()

  const [loadingAuth, setLoadingAuth] = useState<boolean>(false)

  useEffect(() => {
    if(!currentUser){
      checkIfUserIsLoggedIn()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkIfUserIsLoggedIn = async () => {
    setLoadingAuth(true)

    clearTimeout(timer.current)

    await new Promise<void>((resolve, reject) => {
      timer.current = setTimeout(async () => {

        const firebaseUser = auth.currentUser

        if(firebaseUser) {
          startGoogleUserSession(firebaseUser)
        } else {
          const sessionId = cookies['sessionId']

          if(sessionId) {
            try {
              const response = await getUserByToken(authApi)
              resumeUserSession(User.create(response.data))
            } catch (err) {
              endUserSession()
            }
          } else {
            endUserSession()
          }

        }

        setLoadingAuth(false)
      }, 1000)

      resolve()
    })
  }

  if(loadingAuth) return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      Loading...
    </div>
  )

  return (
    <div className="App">
      <Routes>
        <Route path='/game' element={<Game />}></Route>
        <Route path='' element={<Navigate to='/game' />} />
        <Route path='*' element={<Navigate to='/game' />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default withAuthApi(App);
