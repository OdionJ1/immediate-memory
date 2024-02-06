import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { User } from '../../models/user';
import toast from 'react-hot-toast';
import CustomTopnav from '../../common/components/custom-top-nav/CustomTopnav'
import ProgressBar from "@ramonak/react-progress-bar";
import useSessionHandler from '../../common/components/auth/useSessionHandler'
import IconWrapper from '../../common/components/icon-wrapper/IconWrapper'
import Sidenav from '../../components/game/sidenav/Sidenav'
import useGame from './useGame'
import CustomModal from '../../common/components/custom-modal/CustomModal';
import ResultModal from '../../components/game/result-modal/ResultModal';
import SignupModal from '../../components/user/sign-up-modal/SignupModal';
import SignInModal from '../../components/user/sign-in-modal/SignInModal';
import GuideModal from '../../components/game/guide-modal/GuideModal';
import styles from './game.module.scss'


enum Modal {
  signupModal = 'signupModal',
  signinModal = 'signinModal',
  guideModal = 'guideModal'
}

const Game = () => {
  const currentUser = useSelector<RootState>(({ user: { currentUser }}) => currentUser) as User | null
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
  const { endUserSession } = useSessionHandler()
  
  useEffect(() => {
    setModalToRender(Modal.guideModal)
  }, [])

  const { 
    randomNumber, 
    validate,
    gameInSession,
    showLoader,
    countDownTimer,
    showCorrectAnswer,
    resultModalIsOpen,
    setResultModalIsOpen,
    loadingTimerDelay,
    setUserAnswer,
    userAnswer,
    score,
    showUserAnswer,
    startGame
  } = useGame()
  
  const [sidenavIsExtended, setSidenavIsExtended] = useState<boolean>(false)
  const [modalToRender, setModalToRender] = useState<Modal | null>(null)
  

  const renderModal = (modal: Modal) => {
    switch(modal) {
      case Modal.signupModal:
        return <SignupModal openSigninModal={() => setModalToRender(Modal.signinModal)}/>
      case Modal.signinModal:
        return <SignInModal />
      case Modal.guideModal:
        return <GuideModal closeModal={() => setModalToRender(null)} openSigninModal={() => setModalToRender(Modal.signinModal)} />
      
      default:
        return <></>
    }
  }

  const logout = () => {
    endUserSession()
    toast('Successfully logged out')
  }


  return (
    <div className={styles['container']}>
      <CustomTopnav
        navbarStyles={{ backgroundColor: `${styles['im-purple-light']}`}}
        rightSectionComponent={
          <>
          {
            !gameInSession && (
              <>
                <div className={styles['icon-container']}>
                  <IconWrapper icon='menu' iconStyles={{ color: '#ffffff', fontSize: '2rem' }} action={() => setSidenavIsExtended(!sidenavIsExtended)}/>
                </div>
                <ul className={styles['nav-items-container']}>
                  {
                    !currentUser && (
                      <>
                        <li className={styles['nav-item']} onClick={() => setModalToRender(Modal.signinModal)}>Sign in</li>
                        <li className={styles['nav-item']} onClick={() => setModalToRender(Modal.signupModal)}>Sign up</li>
                      </>
                    )
                  }
                  {currentUser && <li className={styles['nav-item']}>View profile</li>}
                  <li className={styles['nav-item']} onClick={() => setModalToRender(Modal.guideModal)}>Guide</li>
                  {currentUser && <li className={styles['nav-item']} onClick={logout}>Logout</li>}
                </ul>
              </>
            )
          }
          </>
        }
      />

      <main className={styles['main']}>
        <div className={styles['contents-wrapper']}>
          {
            <p className={styles['score']}>
              Score: {score}
            </p>
          }

          {
            showCorrectAnswer &&
            <p className={styles['correct-ans']}>
              Correct: {randomNumber}
            </p>
          }

          <div className={styles['answer-section']} style={{ color: showCorrectAnswer ? 'red' : ''}}>
            { showUserAnswer ? userAnswer : randomNumber}
          </div>


          <hr className={styles['hr']} />

          { showLoader && <ProgressBar completed={countDownTimer} maxCompleted={Number(loadingTimerDelay)} transitionDuration={`${loadingTimerDelay}s`} isLabelVisible={false} /> }

          <div className={styles['controls-section']}>
            <div className={styles['numbers-grid']}>
              {numbers.map(num => <button key={num} className={styles['num-btn']} disabled={!showLoader} onClick={() => setUserAnswer(userAnswer+num)}>{num}</button>)}
            </div>
            <div className={styles['clear-and-zero-container']}>
              <button className={styles['zero-btn']} disabled={!showLoader} onClick={() => setUserAnswer(userAnswer+'0')}>0</button>
              <button className={styles['clear-btn']} disabled={!showLoader} onClick={() => setUserAnswer('')}>Clear</button>
            </div>
          </div>
          
          <button className={styles['validate-btn']} onClick={validate} disabled={!showLoader}>Validate</button>
          
          {
            !gameInSession && 
            <div className={styles['start-btn-container']}>
              <button className={styles['start-btn']} onClick={startGame}>Start</button>
            </div>
          }
        </div>
        

      </main>

      <Sidenav 
        extend={sidenavIsExtended} 
        close={() => setSidenavIsExtended(false)} 
        openSigninModal={() => setModalToRender(Modal.signinModal)} 
        openSignupModal={() => setModalToRender(Modal.signupModal)}
        openGuideModal={() => setModalToRender(Modal.guideModal)}
      />

      {
        resultModalIsOpen && 
        <CustomModal closeModal={() => setResultModalIsOpen(false)} margin='5% auto' width='40%'>
          <ResultModal correctAnswer={randomNumber} score={score} restart={startGame} />
        </CustomModal>
      }

      {
        modalToRender && !resultModalIsOpen &&
        <CustomModal closeModal={() => setModalToRender(null)} margin='5% auto'>
          {renderModal(modalToRender)}
        </CustomModal>
      }

    </div>
  )
}

export default Game