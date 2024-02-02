import React, { CSSProperties, useEffect, useRef } from 'react'
import useSessionHandler from '../../../common/components/auth/useSessionHandler'
import IconWrapper from '../../../common/components/icon-wrapper/IconWrapper'
import styles from './sidenav.module.scss'


interface Props {
  extend: boolean
  close: () => void
}

const Sidenav: React.FC<Props> = ({ extend, close }) => {
  const ref: any = useRef()
  const { endUserSession } = useSessionHandler()

  useEffect(() => {
    const checkIfClickOutside = (e: Event) => {
      if(ref.current && !ref.current.contains(e.target)){
        close()
      }
    }

    setTimeout(() => {
      if(extend) {
        document.addEventListener('click', checkIfClickOutside)
      } else {
        document.removeEventListener('click', checkIfClickOutside)
      }
    }, 500)


    return () => {
      document.removeEventListener('click', checkIfClickOutside)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extend])

  const navItemsIconStyles: CSSProperties = {
    fontSize: '1.2rem',
    marginRight: '0.5rem'
  }

  return (
    <div ref={ref} className={styles['container']} style={{ transform: extend ? 'none' : 'translate(100%)' }}>
      {
        extend &&
        <div className={styles['contents']}>
          <span className={`${styles['close-icon']} material-symbols-outlined`} onClick={close}>
            close
          </span>

          <ul className={styles['nav-items-container']}>
            <li className={styles['nav-item']}> <IconWrapper icon='menu_book' iconStyles={navItemsIconStyles} /> Guide</li>
            <li className={styles['nav-item']}><IconWrapper icon='account_circle' iconStyles={navItemsIconStyles} /> View profile</li>
            <li className={styles['nav-item']} onClick={endUserSession}> <IconWrapper icon='logout' iconStyles={navItemsIconStyles} /> Logout</li>
          </ul>
        </div>
      }
    </div>
  )
}

export default Sidenav