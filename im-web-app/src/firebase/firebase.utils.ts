import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const config= {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "immediate-memory.firebaseapp.com",
  projectId: "immediate-memory",
  storageBucket: "immediate-memory.appspot.com",
  messagingSenderId: "647362788957",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-CDEVNX0CQB"
}


export const firebaseApp = firebase.initializeApp(config)

export const auth = firebase.auth()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = async () => {
  return await auth.signInWithPopup(provider)
}

export default firebase