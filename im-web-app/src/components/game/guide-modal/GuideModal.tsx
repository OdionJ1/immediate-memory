import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { User } from '../../../models/user'
import styles from './guideModal.module.scss'

const GuideModal = () => {
  const currentUser = useSelector<RootState>(({ user: { currentUser }}) => currentUser) as User

  return (
    <div className={styles['container']}>

    </div>
  )
}

export default GuideModal