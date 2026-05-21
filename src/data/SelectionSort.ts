import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = {
  name: 'Selection Sort',
  description: 'Finds minimum element and puts it at the beginning',
  type: 'selection-sort',
  visualizationType: 'bars',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  category: 'sorting'
}

const PSEUDOCODE: PseudocodeLine[] = [
  { lineNumber: 1, code: 'procedure selectionSort(A : list of sortable items)' },
  { lineNumber: 2, code: '  n = length(A)' },
  { lineNumber: 3, code: '  for i = 0 to n-1' },
  { lineNumber: 4, code: '    minIdx = i' },
  { lineNumber: 5, code: '    for j = i+1 to n-1' },
  { lineNumber: 6, code: '      if A[j] < A[minIdx]' },
  { lineNumber: 7, code: '        minIdx = j' },
  { lineNumber: 8, code: '    swap(A[i], A[minIdx])' }
]

export class SelectionSortExecutor extends AlgorithmExecutor {
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

    steps.push({
      stepNumber: stepNum++,
      action: 'initialize',
      explanation: `Starting Selection Sort with ${n} elements`,
      comparisons: 0,
      swaps: 0,
      pseudocodeLineNumber: 2,
      visualizationState: { data: [...arr], visualData: [...visualArr] }
    })

    for (let i = 0; i < n; i++) {
      let minIdx = i

      for (let j = i + 1; j < n; j++) {
        comparisons++
        steps.push({
          stepNumber: stepNum++,
          action: 'compare',
          explanation: `Comparing arr[${j}] = ${arr[j]} with minimum arr[${minIdx}] = ${arr[minIdx]}`,
          indices: [j, minIdx],
          comparisons,
          swaps,
          pseudocodeLineNumber: 6,
          visualizationState: { data: [...arr], visualData: [...visualArr] }
        })

        if (arr[j] < arr[minIdx]) {
          minIdx = j
          steps.push({
            stepNumber: stepNum++,
            action: 'min_found',
            explanation: `New minimum found at index ${minIdx}`,
            indices: [minIdx],
            comparisons,
            swaps,
            pseudocodeLineNumber: 7,
            visualizationState: { data: [...arr], visualData: [...visualArr] }
          })
        }
      }

      if (minIdx !== i) {
        const temp = arr[i]
        arr[i] = arr[minIdx]
        arr[minIdx] = temp

        const tempV = visualArr[i]
        visualArr[i] = visualArr[minIdx]
        visualArr[minIdx] = tempV
        swaps++

        steps.push({
          stepNumber: stepNum++,
          action: 'swap',
          explanation: `Swapping arr[${i}] and arr[${minIdx}]`,
          indices: [i, minIdx],
          comparisons,
          swaps,
          pseudocodeLineNumber: 8,
          visualizationState: { data: [...arr], visualData: [...visualArr] }
        })
      }
    }

    steps.push({
      stepNumber: stepNum++,
      action: 'complete',
      explanation: 'Array is now sorted!',
      comparisons,
      swaps,
      pseudocodeLineNumber: 1,
      visualizationState: { data: [...arr], visualData: [...visualArr], sorted: true }
    })

    return steps
  }
}
