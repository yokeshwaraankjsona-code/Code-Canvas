import { useEffect } from 'react'
import { useVisualizer } from '../components/VisualizerContext'

export const usePlaybackLoop = () => {
  const { playbackState, nextStep, algorithmState } = useVisualizer()

  useEffect(() => {
    if (!playbackState.isPlaying || !algorithmState) return

    const delay = 500 / playbackState.speed // Delay between steps (in ms)
    const interval = setInterval(() => {
      if (playbackState.currentStepIndex >= algorithmState.history.length - 1) {
        // Stop at end
        return
      }
      nextStep()
    }, delay)

    return () => clearInterval(interval)
  }, [playbackState.isPlaying, playbackState.speed, playbackState.currentStepIndex, algorithmState, nextStep])
}
