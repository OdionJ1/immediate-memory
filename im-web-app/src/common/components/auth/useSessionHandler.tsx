import { useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'
import { User } from '../../../models/user'
import { setCurrentUser } from '../../../redux/user/user.reducer'
import { googleLogin } from '../../../services/user.service'
import { auth } from '../../../firebase/firebase.utils'
import firebase from 'firebase/compat/app'

const useSessionHandler = () => {
  const dispatch = useDispatch()

  const [, setCookie, removeCookie] = useCookies()

  const startUserSession = (user: User, sessionId: string) => {
    const date = new Date()

    //Cookie expires in 7 days
    const futureDate = new Date(new Date().setHours(date.getHours() + 168))

    setCookie('sessionId', sessionId, {
      expires: futureDate,
      path: '/'
    })

    dispatch(setCurrentUser({ ...user }))
  }

  const startGoogleUserSession = async (firebaseUser: firebase.User) => {
    const displayNameArr = firebaseUser.displayName ? firebaseUser.displayName.split(' ') : []
    const gUser = new User()

    gUser.email = firebaseUser.email ? firebaseUser.email : ''
    gUser.firstName = displayNameArr[0] ? displayNameArr[0] : ''
    gUser.lastName = displayNameArr[1] ? displayNameArr[1] : ''

    try {
      const { data: { user, sessionId }} = await googleLogin(gUser)
      removeCookie('sessionId')
      startUserSession(User.create(user), sessionId)
    } catch (err) {
      endUserSession()
    }
  }

  const resumeUserSession = (user: User) => {
    dispatch(setCurrentUser({ ...user }))
  }

  const endUserSession = () => {
    auth.signOut()
    dispatch(setCurrentUser(null))
    removeCookie('sessionId')

    // navigate('/signup')
  }

  return {
    startUserSession,
    startGoogleUserSession,
    resumeUserSession,
    endUserSession
  }
}

export default useSessionHandler