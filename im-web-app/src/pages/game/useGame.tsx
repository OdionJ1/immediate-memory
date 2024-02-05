import { useState, useRef } from 'react'

const useGame = () => {
  const count = useRef<number>(1)
  const loadingTimeout = useRef<NodeJS.Timeout>()
  const countDownTimeout = useRef<NodeJS.Timeout>()

  const [resultModalIsOpen, setResultModalIsOpen] = useState<boolean>(false)
  const [randomNumber, setRandomNumber] = useState<string>('')
  const [numberOfDigits, setNumberOfDigits] = useState<number>(2)
  
  const [gameInSession, setGameInSession] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [showUserAnswer, setShowUserAnswer] = useState<boolean>(false)
  
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false)
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const [loadingTimerDelay] = useState('10')
  const [countDownTimer, setCountDownTimer] = useState<string>(loadingTimerDelay)

  const validate = () => {
    if(userAnswer === randomNumber) {
      setScore(score + 10)
      runGame()
    } else {
      stopGame()
    }
  }

  const runGame = () => {
    setResultModalIsOpen(false)
    setUserAnswer('')
    setShowCorrectAnswer(false)
    clearTimeout(countDownTimeout.current)
    clearTimeout(loadingTimeout.current)
    setGameInSession(true)
    setShowLoader(false)
    setCountDownTimer(loadingTimerDelay)

    setRandomNumber(getRandomNumber(numberOfDigits))
    
    if(count.current === 1){
      count.current = 0
      setNumberOfDigits(numberOfDigits+count.current)
    } else {
      count.current = 1
      setNumberOfDigits(numberOfDigits+count.current)
    }

    setShowUserAnswer(false)
    
    setTimeout(() => {
      setShowLoader(true)
      setShowUserAnswer(true)
    }, 2500)

    countDownTimeout.current = setTimeout(() => {
      setCountDownTimer('0')

      loadingTimeout.current = setTimeout(() => {
        stopGame()
      }, Number(loadingTimerDelay) * 1000)

    }, 3000)
  }

  const startGame = () => {
    setScore(0)
    runGame()
  }

  const stopGame = () => {
    clearTimeout(loadingTimeout.current)
    clearTimeout(countDownTimeout.current)
    setNumberOfDigits(2)
    setShowCorrectAnswer(true)
    setShowLoader(false)

    setTimeout(() => {
      setGameInSession(false)
      setResultModalIsOpen(true)
    }, 1000)
  }

  const getRandomNumber = (numOfDigits: number): string => {
    let ranNum: string = ''

    for(let i = 0; i<numOfDigits; i++) {
      ranNum+=Math.floor(Math.random() * 10)
    }

    return ranNum
  }

  return {
    randomNumber,
    validate,
    gameInSession,
    showLoader,
    countDownTimer,
    loadingTimerDelay,
    showCorrectAnswer,
    setUserAnswer,
    userAnswer,
    score,
    showUserAnswer,
    startGame,
    resultModalIsOpen,
    setResultModalIsOpen
  }
}

export default useGame