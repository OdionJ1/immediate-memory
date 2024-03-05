import React, { useEffect, useState } from 'react';
import firebase, { auth, firebaseApp  } from './firebase/firebase.utils';
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
  const currentUser = useSelector<RootState>(({ user: { currentUser }}) => currentUser) as User | null

  const { resumeUserSession, endUserSession, startGoogleUserSession } = useSessionHandler()
  const [cookies] = useCookies()

  const [loadingAuth, setLoadingAuth] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      if(!currentUser){
        await checkIfUserIsLoggedIn()
      }
    })()

  }, [])

  const getFirebaseUser = (): Promise<firebase.User | null> => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        console.log(user)
        unsubscribe();
        resolve(user);
      }, reject);
   });
  }

  const checkIfUserIsLoggedIn = async () => {
    setLoadingAuth(true)
    const firebaseUser = await getFirebaseUser()
    if(firebaseUser) {
      startGoogleUserSession(firebaseUser)
    } else {
      console.log('123')
      const sessionId = cookies['sessionId']

      if(sessionId) {
        console.log('1234')
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
