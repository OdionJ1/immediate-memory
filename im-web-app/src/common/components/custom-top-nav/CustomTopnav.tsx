import React, { CSSProperties } from 'react'
import styles from './customTopNav.module.scss'

interface Props {
  rightSectionComponent?: JSX.Element
  navbarStyles?: CSSProperties
}

const CustomTopnav: React.FC<Props> = ({ rightSectionComponent, navbarStyles = {} }) => {
  return (
    <div className={styles['container']} style={navbarStyles}>
      <h1>Immediate memory</h1>

      <div className={styles['right-section']}>
        {rightSectionComponent}
      </div>
    </div>
  )
}

export default CustomTopnav