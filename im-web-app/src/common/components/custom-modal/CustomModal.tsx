import React from 'react'
import Modal from '@mui/material/Modal'
import styles from './customModal.module.scss'



interface Props {
  width?: string
  open?: boolean
  margin?: string
  keepMounted?: boolean
  children: JSX.Element
  enableBackDropClick?: boolean
  closeModal: () => void
}

const CustomModal: React.FC<Props> = ({ children, closeModal, keepMounted = false, open = true, enableBackDropClick = true, width = '50%', margin = '20% auto' }) => {

  const close = (reason: 'backdropClick' | 'escapeKeyDown') => {
    if(reason === 'backdropClick' && enableBackDropClick) {
      closeModal()
    }

    return;
  }

  return (
    <Modal
      open={open}
      onClose={(e, reason) => close(reason)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted={keepMounted}
    >
      <div style={{ margin, width }} className={styles['container']}>
        <div className={styles['close-button-wrapper']}>
          <button onClick={closeModal} className={styles['close-button']}>&times;</button>
        </div>
        {children}
      </div>
    </Modal>
  )
}


export default CustomModal