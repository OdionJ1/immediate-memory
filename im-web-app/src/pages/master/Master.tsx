import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { User } from '../../models/user'
import { useCookies } from 'react-cookie'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthAxiosInstance, withAuthApi } from '../../common/components/auth/withAuthApi'
import { getUserByToken } from '../../services/user.service'
import useSessionHandler from '../../common/components/auth/useSessionHandler'
import Game from './game/Game'


interface Props extends AuthAxiosInstance {}

const Master: React.FC<Props> = ({ authApi }) => {
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

  if(!currentUser) {
    return <></>
  }

  return (
    <div>
      <Routes>
        <Route path='/game' element={<Game />}></Route>
        <Route path='*' element={<Navigate to='/game' />}></Route>
      </Routes>
    </div>
  )
}

export default withAuthApi(Master)