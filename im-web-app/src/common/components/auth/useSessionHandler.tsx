import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { User } from '../../../models/user'
import { setCurrentUser } from '../../../redux/user/user.reducer'

const useSessionHandler = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [, setCookie, removeCookie] = useCookies()

  const startUserSession = (user: User, sessionId: string) => {
    const date = new Date()
    const futureDate = new Date(new Date().setHours(date.getHours() + 10))

    setCookie('sessionId', sessionId, {
      expires: futureDate,
      path: '/'
    })

    dispatch(setCurrentUser({ ...user }))
    navigate('/*')
  }

  const resumeUserSession = (user: User) => {
    dispatch(setCurrentUser({ ...user }))
  }

  const endUserSession = () => {
    dispatch(setCurrentUser(null))
    removeCookie('sessionId')

    navigate('/signup')
  }

  return {
    startUserSession,
    resumeUserSession,
    endUserSession
  }
}

export default useSessionHandler