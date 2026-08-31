import { useEffect, useState } from 'react'

const GAME_DURATION = 30
const BOARD_SIZE = 9
type GameStatus = 'ready' | 'playing' | 'game-over'

function nextPosition(previous: number | null) {
  const next = Math.floor(Math.random() * BOARD_SIZE)
  return next === previous ? (next + 1) % BOARD_SIZE : next
}

function App() {
  const [status, setStatus] = useState<GameStatus>('ready')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [targetPosition, setTargetPosition] = useState<number | null>(null)

  useEffect(() => {
    if (status !== 'playing') return
    const timer = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setStatus('game-over')
          setTargetPosition(null)
          return 0
        }
        return currentTime - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [status])

  function startGame() {
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setTargetPosition(nextPosition(null))
    setStatus('playing')
  }

  function hitTarget() {
    if (status !== 'playing') return
    setScore((currentScore) => currentScore + 1)
    setTargetPosition((currentPosition) => nextPosition(currentPosition))
  }

  const actionLabel = status === 'ready' ? 'Start' : status === 'game-over' ? 'Restart' : 'Playing…'

  return (
    <main className="page">
      <section className="game" aria-labelledby="game-title">
        <p className="label">LIVE CODING GAME</p>
        <h1 id="game-title">Click the Target</h1>
        <p className="description">Click the target as many times as you can in 30 seconds.</p>
        <div className="stats" aria-label="Game statistics">
          <p><span>Score</span><strong>{score}</strong></p>
          <p><span>Time</span><strong>{timeLeft}s</strong></p>
        </div>
        <div className="board" aria-label="Game board">
          {Array.from({ length: BOARD_SIZE }, (_, position) => (
            <div className="cell" key={position}>
              {status === 'playing' && position === targetPosition && (
                <button className="target" type="button" onClick={hitTarget} aria-label="Click target">●</button>
              )}
            </div>
          ))}
        </div>
        {status === 'game-over' && <p className="message">Game Over! Final score: {score}</p>}
        <button className="action" type="button" disabled={status === 'playing'} onClick={startGame}>{actionLabel}</button>
      </section>
    </main>
  )
}

export default App
