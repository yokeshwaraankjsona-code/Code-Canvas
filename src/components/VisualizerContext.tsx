import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { 
  AlgorithmType, 
  AlgorithmState, 
  PlaybackState, 
  PseudocodeLine,
  VisualizerContextType,
  ExecutionStep
} from '../data/algorithmTypes'
import { AlgorithmExecutor } from '../data/AlgorithmExecutor'
import { getAlgorithmExecutor, ALGORITHM_METADATA } from '../data/algorithmMetadata'

const VisualizerContext = createContext<VisualizerContextType | null>(null)

export const VisualizerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [algorithm, setAlgorithm] = useState<AlgorithmType | null>(null)
  const [executor, setExecutor] = useState<AlgorithmExecutor | null>(null)
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState | null>(null)
  const [inputData, setInputDataState] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 88, 45, 50])
  const [searchTarget, setSearchTargetState] = useState<number | null>(null)
  const [pseudocode, setPseudocode] = useState<PseudocodeLine[]>([])
  const [currentExplanation, setCurrentExplanation] = useState<string>('Select an algorithm to begin')
  
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    speed: 1,
    currentStepIndex: 0,
    totalSteps: 0
  })

  const selectAlgorithm = useCallback((algoType: AlgorithmType) => {
    try {
      const newExecutor = getAlgorithmExecutor(algoType, inputData, searchTarget)
      setExecutor(newExecutor)
      setAlgorithm(algoType)
      
      const metadata = ALGORITHM_METADATA[algoType]
      setPseudocode(newExecutor.getPseudocode())
      setCurrentExplanation(`${metadata.name}: ${metadata.description}`)
      
      const state = newExecutor.getState()
      setAlgorithmState(state)
      
      setPlaybackState({
        isPlaying: false,
        speed: 1,
        currentStepIndex: 0,
        totalSteps: state.history.length
      })
    } catch (error) {
      console.error('Error selecting algorithm:', error)
      setCurrentExplanation('Error loading algorithm. Please try again.')
    }
  }, [inputData, searchTarget])

  const setInputData = useCallback((data: number[] | string) => {
    const parsed = typeof data === 'string' 
      ? data.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
      : data
    
    setInputDataState(parsed)
    
    // Reload current algorithm with new data
    if (algorithm) {
      selectAlgorithm(algorithm)
    }
  }, [algorithm, selectAlgorithm])

  const setSearchTarget = useCallback((target: number | null) => {
    setSearchTargetState(target)
    if (algorithm) {
      try {
        const newExecutor = getAlgorithmExecutor(algorithm, inputData, target)
        setExecutor(newExecutor)
        
        const state = newExecutor.getState()
        setAlgorithmState(state)
        
        setPlaybackState({
          isPlaying: false,
          speed: 1,
          currentStepIndex: 0,
          totalSteps: state.history.length
        })
      } catch (error) {
        console.error('Error updating algorithm with new target:', error)
      }
    }
  }, [algorithm, inputData])

  const updateFromExecutor = useCallback(() => {
    if (executor) {
      const state = executor.getState()
      const currentStep = state.history[playbackState.currentStepIndex]
      
      setAlgorithmState(state)
      if (currentStep) {
        setCurrentExplanation(currentStep.explanation)
      }
    }
  }, [executor, playbackState.currentStepIndex])

  const play = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, isPlaying: true }))
  }, [])

  const pause = useCallback(() => {
    setPlaybackState(prev => ({ ...prev, isPlaying: false }))
  }, [])

  const nextStep = useCallback(() => {
    setPlaybackState(prev => {
      const newIndex = Math.min(prev.currentStepIndex + 1, prev.totalSteps - 1)
      if (executor) {
        executor.jumpToStep(newIndex)
      }
      return { ...prev, currentStepIndex: newIndex }
    })
    updateFromExecutor()
  }, [executor, updateFromExecutor])

  const previousStep = useCallback(() => {
    setPlaybackState(prev => {
      const newIndex = Math.max(prev.currentStepIndex - 1, 0)
      if (executor) {
        executor.jumpToStep(newIndex)
      }
      return { ...prev, currentStepIndex: newIndex }
    })
    updateFromExecutor()
  }, [executor, updateFromExecutor])

  const reset = useCallback(() => {
    if (executor) {
      executor.reset()
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false,
        currentStepIndex: 0
      }))
      updateFromExecutor()
    }
  }, [executor, updateFromExecutor])

  const setSpeed = useCallback((speed: number) => {
    setPlaybackState(prev => ({
      ...prev,
      speed: Math.max(0.5, Math.min(2, speed))
    }))
  }, [])

  const value: VisualizerContextType = {
    algorithm,
    algorithmState,
    playbackState,
    inputData,
    pseudocode,
    currentExplanation,
    searchTarget,
    selectAlgorithm,
    setInputData,
    setSearchTarget,
    play,
    pause,
    nextStep,
    previousStep,
    reset,
    setSpeed
  }

  return (
    <VisualizerContext.Provider value={value}>
      {children}
    </VisualizerContext.Provider>
  )
}

export const useVisualizer = (): VisualizerContextType => {
  const context = useContext(VisualizerContext)
  if (!context) {
    throw new Error('useVisualizer must be used within VisualizerProvider')
  }
  return context
}
