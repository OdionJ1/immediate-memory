import React, { useState, ChangeEvent } from 'react'
import * as EmailValidator from 'email-validator';
import styles from './signInModal.module.scss'
import { login } from '../../../services/user.service';
import useSessionHandler from '../../../common/components/auth/useSessionHandler';


const SignInModal = () => {
  const { startUserSession } = useSessionHandler()
  const [emailError, setEmailError] = useState<string | null>(null)
  const [signUpErrorMessage, setSignUpErrorMessage] = useState<string | null>(null)
  const [signinForm, setSignInForm] = useState<{ email: string, password: string }>({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignUpErrorMessage(null)
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
    setSignUpErrorMessage(null)

    try {
      const response = await login(signinForm.email, signinForm.password)
      const { user, sessionId } = response.data
      startUserSession(user, sessionId)
    } catch (err: any) {
      if(err.response) {
        if(err.response.status === 404) {
          setSignUpErrorMessage('Incorrect email or password')
        } else {
          setSignUpErrorMessage('An error occurred')
        }
      } else {
        setSignUpErrorMessage('An error occurred')
      }
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
        { signUpErrorMessage && <p className={styles['error-text']}>{signUpErrorMessage}</p> }
        
        <div className={styles['submit-btn-container']}>
          <button className={styles['submit-btn']} disabled={!formIsValid()} onClick={handleSubmit}>Sign in</button>
        </div>
      </form>
    </div>
  )
}

export default SignInModal