import React from 'react'
import checkImg from '../../../assets/images/check-img.jpg'
import styles from './signupSuccessModal.module.scss'

const SignupSuccessModal: React.FC<Props> = ({ closeModal }) => {
  return (
    <div className={styles['container']}>
      <div className={styles['img-container']}>
        <img alt='check-img' src={checkImg} />
      </div>

      <p className={styles['text']}>Account successfully created. You can now sign in</p>

      <button className={styles['button']} onClick={closeModal}>OK</button>
    </div>
  )
}

interface Props {
  closeModal: () => void
}

export default SignupSuccessModal