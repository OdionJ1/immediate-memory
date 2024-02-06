import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { User } from '../../../models/user'
import styles from './guideModal.module.scss'

interface Props {
  closeModal: () => void
  openSigninModal: () => void
}

const GuideModal: React.FC<Props> = ({ closeModal, openSigninModal }) => {
  const currentUser = useSelector<RootState>(({ user: { currentUser }}) => currentUser) as User

  const timeOfDay = useMemo((): 'morning' | 'afternoon' | 'evening' => {
    const date = new Date()

    const hour = date.getHours()

    if(hour >= 17 && hour < 24) {
      return 'evening'
    } else if(hour >= 12 && hour < 17) {
      return 'afternoon'
    } else {
      return 'morning'
    }
  }, [])

  return (
    <div className={styles['container']}>
      {
        currentUser ? (
          <h1 className={styles['header']}>Good {timeOfDay} {currentUser.firstName}, welcome to immediate memory</h1>
        ) : (
          <h1 className={styles['header']}>Welcome to immediate memory</h1>
        )
      }

      <hr />

      <div className={styles['guide-section']}>

        <h2 className={styles['sub-header']}>***How to play***</h2>

        <p>The goal is to memorize the numbers that appear on the screen for a few seconds</p>

        <p>Once they disappear you should write them in the same order that you saw them and click the validate button before the response time</p>

        <p>You get 10 points every time you insert the correct number </p>

        <p>If you do not insert the number before the response time or the number you entered is wrong, the game will end and you will have lost</p>

        <p>Each time you pass a level the number to remember will have more digits</p>

        <p>How many digits can you memorize?</p>
        
        {!currentUser && <p><span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={openSigninModal}>Sign in</span> to save your high score</p>}

      </div>

      <hr />

      <div className={styles['btn-container']}>
        <button className={styles['btn']} onClick={closeModal}>Okay</button>
      </div>
    </div>
  )
}

export default GuideModal