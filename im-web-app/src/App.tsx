import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { User } from './models/user';
import { getUserByToken } from './services/user.service';
import { AuthAxiosInstance, withAuthApi } from './common/components/auth/withAuthApi';
import useSessionHandler from './common/components/auth/useSessionHandler';
import Game from './pages/game/Game';
import './App.css';

interface Props extends AuthAxiosInstance {}

function App({ authApi }: Props) {
  const currentUser = useSelector<RootState>(({ user: { currentUser }}) => currentUser) as User | null

  const { resumeUserSession, endUserSession } = useSessionHandler()
  const [cookies] = useCookies()

  useEffect(() => {
    if(!currentUser){
      checkIfUserIsLoggedIn()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])


  const checkIfUserIsLoggedIn = async () => {
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

  return (
    <div className="App">
      <Routes>
        <Route path='/game' element={<Game />}></Route>
        <Route path='' element={<Navigate to='/game' />} />
        <Route path='*' element={<Navigate to='/game' />} />
      </Routes>
    </div>
  );
}

export default withAuthApi(App);
