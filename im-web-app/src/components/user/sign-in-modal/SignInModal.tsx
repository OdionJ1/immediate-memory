import React, { useState, ChangeEvent } from 'react'
import { login } from '../../../services/user.service';
import { signInWithGoogle } from '../../../firebase/firebase.utils';
import { useNavigate } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import useSessionHandler from '../../../common/components/auth/useSessionHandler';
import GoogleButton from 'react-google-button'
import styles from './signInModal.module.scss'


const SignInModal = () => {
  const navigate = useNavigate()
  const { startUserSession, startGoogleUserSession } = useSessionHandler()
  const [emailError, setEmailError] = useState<string | null>(null)
  const [signInErrorMessage, setSignInErrorMessage] = useState<string | null>(null)
  const [signinForm, setSignInForm] = useState<{ email: string, password: string }>({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loginLoading, setLoginLoading] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignInErrorMessage(null)
    const { name, value } = e.target

    setSignInForm({
      ...signinForm,
      [name]: value.trimStart()
    })

    if(name === 'email'){
      const isValid = EmailValidator.validate(value)
      setEmailError(isValid ? null : 'Please enter a valid email')
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoginLoading(true)
    setSignInErrorMessage(null)

    try {
      const response = await login(signinForm.email, signinForm.password)
      const { user, sessionId } = response.data
      startUserSession(user, sessionId)
      navigate(0)
    } catch (err: any) {
      if(err.response) {
        if(err.response.status === 404) {
          setSignInErrorMessage('Incorrect email or password')
        } else {
          setSignInErrorMessage('An error occurred')
        }
      } else {
        setSignInErrorMessage('An error occurred')
      }
    }

    setLoginLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setSignInErrorMessage(null)
    try {
      const gUser = await signInWithGoogle()
      if(gUser.user){
        startGoogleUserSession(gUser.user)
        navigate(0)
      }
    } catch (err) {
      setSignInErrorMessage('An error occurred')
    }
  }

  const formIsValid = () => {
    return signinForm.email &&
    signinForm.password &&
    !emailError
  }

  
  return (
    <div className={styles['container']}>
      <h1 className={styles['header']}>Sign in</h1>

      <form className={styles['form']}>
        <div className={styles['form-control']}>
          <label htmlFor='email'>Email</label>
          <input className={styles['input']} onChange={handleChange} id='email' value={signinForm.email} name='email' />
        </div>

        <div className={styles['form-control']}>
          <label htmlFor='password'>Password</label>
          <input className={styles['input']} type={showPassword ? 'text' : 'password'} onChange={handleChange} id='password' value={signinForm.password} name='password'  />
          <span className={`material-symbols-outlined ${styles['icon']}`} onClick={() => setShowPassword(!showPassword)}>
            { showPassword ? 'visibility_off' : 'visibility' }
          </span>
        </div>

        { emailError && <p className={styles['error-text']}>{emailError}</p> }
        { signInErrorMessage && <p className={styles['error-text']}>{signInErrorMessage}</p> }
        
        <div className={styles['submit-btn-container']}>
          <button className={styles['submit-btn']} disabled={!formIsValid() || loginLoading} onClick={handleSubmit}>
            { loginLoading ? <i className='fa fa-spinner fa-pulse'></i> : 'Sign in' }
          </button>

          <GoogleButton
            onClick={handleGoogleSignIn}
          />
        </div>
      </form>
    </div>
  )
}

export default SignInModal