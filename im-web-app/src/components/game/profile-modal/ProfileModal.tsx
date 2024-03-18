import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { User } from '../../../models/user'
import { AuthAxiosInstance, withAuthApi } from '../../../common/components/auth/withAuthApi'
import { updateUser } from '../../../services/user.service'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../../redux/user/user.reducer'
import toast from 'react-hot-toast';
import styles from './profileModal.module.scss'

interface Props extends AuthAxiosInstance {
  closeModal: () => void
}

const ProfileModal: React.FC<Props> = ({ authApi, closeModal }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector<RootState>(({ user: { currentUser }}) => currentUser) as User

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')

  useEffect(() => {
    setFirstName(currentUser.firstName)
    setLastName(currentUser.lastName)
  }, [currentUser])

  const formIsValid = () => {
    return (
      !!firstName &&
      !!lastName
    )
  }

  const handleSave = () => {
    const updatedUser: User = {
      ...currentUser,
      firstName,
      lastName
    }

    dispatch(setCurrentUser(updatedUser))

    closeModal()
    
    updateUser(authApi, updatedUser).then(() => {
      toast('Profile successfully updated')
    }).catch(err => {})
  }

  return (
    <div className={styles['container']}>
      <h1 className={styles['header']}>
        Profile
      </h1>

      <div className={styles['form']}>
        <div className={styles['form-control']}>
          <label>First name</label>
          <input value={firstName} name='firstName' onChange={(e) => setFirstName(e.target.value.trimStart())}/>
        </div>

        <div className={styles['form-control']}>
          <label>Last name</label>
          <input value={lastName} name='lastName' onChange={(e) => setLastName(e.target.value.trimStart())} />
        </div>

        <div className={styles['form-control']}>
          <label>Email</label>
          <input value={currentUser.email} disabled/>
        </div>

        <div className={styles['form-control']}>
          <label>high score</label>
          <input value={currentUser.highScore} disabled/>
        </div>

        <div className={styles['save-btn-container']}>
          <button disabled={!formIsValid()} onClick={handleSave}>Save</button>
        </div>

      </div>


      <hr />
    </div>
  )
}

export default withAuthApi(ProfileModal)