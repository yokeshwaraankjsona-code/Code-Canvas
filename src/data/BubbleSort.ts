import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, PseudocodeLine, AlgorithmMetadata } from './algorithmTypes'

const METADATA: AlgorithmMetadata = {
  name: 'Bubble Sort',
  description: 'Repeatedly compares adjacent elements and swaps them if they are in wrong order',
  type: 'bubble-sort',
  visualizationType: 'bars',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  category: 'sorting'
}

const PSEUDOCODE: PseudocodeLine[] = [
  { lineNumber: 1, code: 'procedure bubbleSort(A : list of sortable items)' },
  { lineNumber: 2, code: '  n = length(A)' },
  { lineNumber: 3, code: '  for i = 0 to n-1' },
  { lineNumber: 4, code: '    for j = 0 to n-i-2' },
  { lineNumber: 5, code: '      if A[j] > A[j+1]' },
  { lineNumber: 6, code: '        swap(A[j], A[j+1])' },
  { lineNumber: 7, code: '  return A' }
]

export class BubbleSortExecutor extends AlgorithmExecutor {
  constructor(data: number[]) {
    super(data, METADATA, PSEUDOCODE)
    this.state.history = this.generateSteps()
    this.state.totalSteps = this.state.history.length
  }

  generateSteps(): ExecutionStep[] {
    const steps: ExecutionStep[] = []
    const arr = [...this.state.data]
    const visualArr = arr.map((val, idx) => ({ id: `id-${idx}`, val }))
    const n = arr.length
    let comparisons = 0
    let swaps = 0
    let stepNum = 0

    // Initial state
    steps.push({
      stepNumber: stepNum++,
      action: 'initialize',
      explanation: `Starting Bubble Sort with ${n} elements`,
      indices: [],
      comparisons: 0,
      swaps: 0,
      pseudocodeLineNumber: 2,
      visualizationState: { data: [...arr], visualData: [...visualArr] }
    })

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Compare step
        comparisons++
        steps.push({
          stepNumber: stepNum++,
          action: 'compare',
          explanation: `Comparing arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}`,
          indices: [j, j + 1],
          comparisons,
          swaps,
          pseudocodeLineNumber: 5,
          visualizationState: { data: [...arr], visualData: [...visualArr] }
        })

        if (arr[j] > arr[j + 1]) {
          // Swap step
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp

          const tempV = visualArr[j]
          visualArr[j] = visualArr[j + 1]
          visualArr[j + 1] = tempV
          swaps++

          steps.push({
            stepNumber: stepNum++,
            action: 'swap',
            explanation: `${arr[j + 1]} > ${arr[j]}, swapping positions`,
            indices: [j, j + 1],
            comparisons,
            swaps,
            pseudocodeLineNumber: 6,
            visualizationState: { data: [...arr], visualData: [...visualArr] }
          })
        }
      }

      // After each i iteration
      steps.push({
        stepNumber: stepNum++,
        action: 'iteration_complete',
        explanation: `Iteration ${i + 1} complete. Largest element is now at position ${n - i - 1}`,
        indices: [n - i - 1],
        comparisons,
        swaps,
        pseudocodeLineNumber: 3,
        visualizationState: { data: [...arr], visualData: [...visualArr], sortedFrom: n - i - 1 }
      })
    }

    // Final state
    steps.push({
      stepNumber: stepNum++,
      action: 'complete',
      explanation: 'Array is now sorted!',
      indices: [],
      comparisons,
      swaps,
      pseudocodeLineNumber: 7,
      visualizationState: { data: [...arr], visualData: [...visualArr], sorted: true }
    })

    return steps
  }
}
