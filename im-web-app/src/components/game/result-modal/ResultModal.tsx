import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { User } from '../../../models/user'
import { AuthAxiosInstance, withAuthApi } from '../../../common/components/auth/withAuthApi'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../../services/user.service'
import { setCurrentUser } from '../../../redux/user/user.reducer'
import styles from './resultModal.module.scss'


interface Props extends AuthAxiosInstance {
  restart: () => void
  correctAnswer: string
  score: number
}

const ResultModal: React.FC<Props> = ({ authApi, correctAnswer, score, restart }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector<RootState>(({ user: { currentUser }}) => currentUser) as User | null

  useEffect(() => {
    (async () => {
      if(currentUser && score > currentUser.highScore){
        dispatch(setCurrentUser({ ...currentUser, highScore: score }))
        await updateUser(authApi, { ...currentUser, highScore: score })
      }
    })()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles['container']}>
      <h1 className={styles['header']}>Game over !</h1>

      <hr />

      <div className={styles['body']}>
      <h1 className={styles['result-text']}>Result</h1>

        <div className={styles['stat']}>
          <p className={styles['label']}>Correct answer:</p>
          <p>{correctAnswer}</p>
        </div>

        <div className={styles['stat']}>
          <p className={styles['label']}>Score:</p>
          <p>{score}</p>
        </div>

        <div className={styles['stat']}>
          <p className={styles['label']}>High score:</p>
          <p>{ currentUser ? currentUser.highScore : score }</p>
        </div>
      </div>
      

      <button className={styles['restart-btn']} onClick={restart}>Restart</button>
    </div>
  )
}

export default withAuthApi(ResultModal)