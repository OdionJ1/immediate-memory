import React, { CSSProperties } from 'react'
import styles from './iconWrapper.module.scss'


interface Props {
  icon: string
  iconStyles?: CSSProperties
  action?: () => void
}

const IconWrapper: React.FC<Props> = ({ icon, iconStyles = {}, action = () => {} }) => {
  return (
    <div className={styles['container']} onClick={action}>
      <span style={iconStyles} className={`${styles['icon']} material-symbols-outlined`}>
        {icon}
      </span>
    </div>
  )
}

export default IconWrapper