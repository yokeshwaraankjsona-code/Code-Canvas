// Core types for algorithm visualization platform

export type AlgorithmType = 
  | 'bubble-sort'
  | 'selection-sort'
  | 'insertion-sort'
  | 'merge-sort'
  | 'linear-search'
  | 'binary-search'
  | 'stack-operations'
  | 'queue-operations'
  | 'binary-tree-traversal'
  | 'bfs-dfs'

export type VisualizationType = 'bars' | 'array' | 'tree' | 'stack' | 'queue'

export interface AlgorithmMetadata {
  name: string
  description: string
  type: AlgorithmType
  visualizationType: VisualizationType
  timeComplexity: string
  spaceComplexity: string
  category: 'sorting' | 'searching' | 'data-structure' | 'graph'
}

export interface ExecutionStep {
  stepNumber: number
  action: string
  explanation: string
  indices?: number[]
  comparisons?: number
  swaps?: number
  operations?: number
  pseudocodeLineNumber?: number
  visualizationState?: Record<string, any>
}

export interface AlgorithmState {
  data: any[]
  currentStep: number
  totalSteps: number
  comparisons: number
  swaps: number
  operations: number
  iterations: number
  isComplete: boolean
  history: ExecutionStep[]
}

export interface PlaybackState {
  isPlaying: boolean
  speed: number // 0.5x to 2x
  currentStepIndex: number
  totalSteps: number
}

export interface VisualizerContextType {
  algorithm: AlgorithmType | null
  algorithmState: AlgorithmState | null
  playbackState: PlaybackState
  inputData: number[] | string
  pseudocode: PseudocodeLine[]
  currentExplanation: string
  searchTarget: number | null
  
  selectAlgorithm: (algo: AlgorithmType) => void
  setInputData: (data: number[] | string) => void
  setSearchTarget: (target: number | null) => void
  play: () => void
  pause: () => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
  setSpeed: (speed: number) => void
}

export interface PseudocodeLine {
  lineNumber: number
  code: string
  isHighlighted?: boolean
}

export interface SearchResult {
  found: boolean
  index?: number
  comparisons: number
}

export interface StackOperation {
  type: 'push' | 'pop'
  value?: number
  timestamp: number
}

export interface QueueOperation {
  type: 'enqueue' | 'dequeue'
  value?: number
  timestamp: number
}

export interface TreeNode {
  id: string
  value: number
  left?: TreeNode
  right?: TreeNode
  x?: number
  y?: number
}

export interface GraphNode {
  id: string | number
  visited?: boolean
  distance?: number
}

export interface GraphEdge {
  from: string | number
  to: string | number
  weight?: number
}

export interface VisualizationState {
  highlightedIndices?: number[]
  swappingIndices?: [number, number] | null
  comparedIndices?: [number, number] | null
  activeNodes?: string[]
  traversalOrder?: string[]
  stackContents?: number[]
  queueContents?: number[]
}
