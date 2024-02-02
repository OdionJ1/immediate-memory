import React, { useState, useEffect, ChangeEvent } from 'react'
import { SignUpFormType } from '../../models/signupFormType';
import { createUser } from '../../services/user.service';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import * as EmailValidator from 'email-validator';
import CustomTopnav from '../../common/components/custom-top-nav/CustomTopnav';
import CustomModal from '../../common/components/custom-modal/CustomModal';
import SignupSuccessModal from '../../components/user/signup-success-modal/SignupSuccessModal';
import styles from './signup.module.scss'
import SignInModal from '../../components/user/sign-in-modal/SignInModal';


const defaultFormValues: SignUpFormType = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const Signup = () => {
  const navigate = useNavigate()
  const [cookies] = useCookies()
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [successModalIsOpen, setSuccessModalIsOpen] = useState<boolean>(false)
  const [signInModalIsOpen, setSignInModalIsOpen] = useState<boolean>(false)
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>('')

  const [signUpForm, setSignupForm] = useState<SignUpFormType>(defaultFormValues)


  useEffect(() => {
    const sessionId = cookies['sessionId']
    if(sessionId) {
      navigate('/*')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubmitErrorMessage(null)

    const { name, value } = e.target

    setSignupForm({
      ...signUpForm,
      [name]: value.trimStart()
    })

    if(name === 'email'){
      const isValid = EmailValidator.validate(value)
      setEmailError(isValid ? null : 'Please enter a valid email')
    }

    if(name === 'password'){
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[1-9]).{6,}$/
      if(!value.match(regex)) {
        setPasswordError('Password must have a minimum of 6 digits and must include at least one upper case character, one lower case character and one number')
      } else if(signUpForm.confirmPassword && value !== signUpForm.confirmPassword) { 
        setPasswordError('Passwords do not match')
      } else {
        setPasswordError(null)
      }
    }

    if(name === 'confirmPassword'){
      if(value === signUpForm.password){
        setPasswordError(null)
      } else {
        setPasswordError('Passwords do not match')
      }
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSubmitErrorMessage(null)

    try {
      const response = await createUser(signUpForm)
      if(response.status === 201) {
        setSuccessModalIsOpen(true)
        setSignupForm({...defaultFormValues})
      }
    } catch (err: any) {
      if(err.response) {
        if(err.response.status === 409){
          setSubmitErrorMessage('Account already exists')
        } else {
          setSubmitErrorMessage('An error occurred')
        }
      } else {
        setSubmitErrorMessage('An error occurred')
      }
    }
  }

  const formIsValid = () => {
    return !!signUpForm.email &&
    !!signUpForm.firstName && 
    !!signUpForm.lastName &&
    !!signUpForm.password && 
    !!signUpForm.confirmPassword &&
    !passwordError && 
    !emailError
  }
 
  return (
    <div className={styles['container']}>
      <CustomTopnav />
      <div className={styles['middle-box']}>
        <h1 className={styles['header']}>Signup</h1>

        <form className={styles['form']}>
          <div className={styles['form-control']}>
            <label htmlFor='firstName'>First name</label>
            <input className={styles['input']} id='firstName' name='firstName' value={signUpForm.firstName} onChange={handleChange} />
          </div>

          <div className={styles['form-control']}>
            <label htmlFor='lastName'>Last name</label>
            <input className={styles['input']} id='lastName' name='lastName' value={signUpForm.lastName} onChange={handleChange}  />
          </div>

          <div className={styles['form-control']}>
            <label htmlFor='email'>Email</label>
            <input className={styles['input']} onChange={handleChange} id='email' value={signUpForm.email} name='email' />
          </div>

          <div className={styles['form-control']}>
            <label htmlFor='password'>Password</label>
            <input className={styles['input']} type={showPassword ? 'text' : 'password'} onChange={handleChange} id='password' value={signUpForm.password} name='password'  />
            

            <span className={`material-symbols-outlined ${styles['icon']}`} onClick={() => setShowPassword(!showPassword)}>
              { showPassword ? 'visibility_off' : 'visibility' }
            </span>
          </div>

          <div className={styles['form-control']}>
            <label htmlFor='password'>Confirm Password</label>
            <input className={styles['input']} type={showPassword ? 'text' : 'password'} onChange={handleChange} id='confirm-password' value={signUpForm.confirmPassword} name='confirmPassword'  />
            <span className={`material-symbols-outlined ${styles['icon']}`} onClick={() => setShowPassword(!showPassword)}>
              { showPassword ? 'visibility_off' : 'visibility' }
            </span>
          </div>

          { emailError && <p className={styles['error-text']}>{emailError}</p> }
          { passwordError && <p className={styles['error-text']}>{passwordError}</p> }
          { submitErrorMessage && <p className={styles['error-text']}>{submitErrorMessage}</p>}
          
          <div className={styles['submit-btn-container']}>
            <button className={styles['submit-btn']} onClick={handleSubmit} disabled={!formIsValid()}>Submit</button>
          </div>
        </form>

        <div className={styles['sign-in-page-link-container']}>
          <p>Already registered? &nbsp;<span onClick={() => setSignInModalIsOpen(true)}>Sign in</span></p>
        </div>
      </div>

      {
        successModalIsOpen && 
        <CustomModal closeModal={() => setSuccessModalIsOpen(false)} margin='5% auto' width='25rem'>
          <SignupSuccessModal closeModal={() => setSuccessModalIsOpen(false)}/>
        </CustomModal>
      }

      {
        signInModalIsOpen &&
        <CustomModal closeModal={() => setSignInModalIsOpen(false)} margin='5% auto' width='40%'>
          <SignInModal />
        </CustomModal>
      }
    </div>
  )
}

export default Signup