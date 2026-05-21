// Base algorithm executor interface for all algorithms

import { AlgorithmState, ExecutionStep, PseudocodeLine, AlgorithmMetadata } from '../data/algorithmTypes'

export abstract class AlgorithmExecutor {
  protected state: AlgorithmState
  protected metadata: AlgorithmMetadata
  protected pseudocode: PseudocodeLine[]

  constructor(data: number[], metadata: AlgorithmMetadata, pseudocode: PseudocodeLine[]) {
    this.metadata = metadata
    this.pseudocode = pseudocode
    this.state = {
      data: [...data],
      currentStep: 0,
      totalSteps: 0,
      comparisons: 0,
      swaps: 0,
      operations: 0,
      iterations: 0,
      isComplete: false,
      history: []
    }
  }

  /**
   * Generate all execution steps upfront for the algorithm
   */
  abstract generateSteps(): ExecutionStep[]

  /**
   * Execute the next step in the algorithm
   */
  nextStep(): ExecutionStep | null {
    if (this.state.currentStep >= this.state.history.length) {
      return null
    }
    
    const step = this.state.history[this.state.currentStep]
    this.state.currentStep++
    
    if (this.state.currentStep >= this.state.history.length) {
      this.state.isComplete = true
    }
    
    return step
  }

  /**
   * Execute the previous step
   */
  previousStep(): ExecutionStep | null {
    if (this.state.currentStep <= 0) {
      return null
    }
    
    this.state.currentStep--
    this.state.isComplete = false
    
    return this.state.history[this.state.currentStep]
  }

  /**
   * Get current state
   */
  getState(): AlgorithmState {
    return {
      ...this.state,
      data: [...this.state.data]
    }
  }

  /**
   * Get specific step
   */
  getStep(index: number): ExecutionStep | null {
    if (index < 0 || index >= this.state.history.length) {
      return null
    }
    return this.state.history[index]
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.state.currentStep = 0
    this.state.isComplete = false
  }

  /**
   * Jump to specific step
   */
  jumpToStep(stepIndex: number): ExecutionStep | null {
    if (stepIndex < 0 || stepIndex >= this.state.history.length) {
      return null
    }
    this.state.currentStep = stepIndex
    this.state.isComplete = stepIndex >= this.state.history.length - 1
    return this.state.history[stepIndex]
  }

  /**
   * Get metadata
   */
  getMetadata(): AlgorithmMetadata {
    return this.metadata
  }

  /**
   * Get pseudocode
   */
  getPseudocode(): PseudocodeLine[] {
    return this.pseudocode
  }
}
