import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = { name: 'Insertion Sort', description: '', type: 'insertion-sort', visualizationType: 'bars', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', category: 'sorting' }
const PSEUDOCODE: PseudocodeLine[] = [
  { lineNumber: 1, code: 'for i = 1 to length-1' },
  { lineNumber: 2, code: '  key = A[i]' },
  { lineNumber: 3, code: '  j = i - 1' },
  { lineNumber: 4, code: '  while j >= 0 and A[j] > key' },
  { lineNumber: 5, code: '    swap(A[j + 1], A[j])' },
  { lineNumber: 6, code: '    j = j - 1' },
  { lineNumber: 7, code: '  A[j + 1] = key' }
]

export class InsertionSortExecutor extends AlgorithmExecutor {
  constructor(data: number[]) { 
    super(data, METADATA, PSEUDOCODE); 
    this.state.history = this.generateSteps(); 
    this.state.totalSteps = this.state.history.length; 
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
      explanation: `Starting Insertion Sort with ${n} elements.`, 
      comparisons: 0, 
      swaps: 0, 
      pseudocodeLineNumber: 1, 
      visualizationState: { data: [...arr], visualData: [...visualArr] } 
    })

    for (let i = 1; i < n; i++) {
      let j = i
      
      steps.push({
        stepNumber: stepNum++,
        action: 'pick',
        explanation: `Picked A[${j}] = ${arr[j]} as the key element to insert.`,
        indices: [j],
        comparisons,
        swaps,
        pseudocodeLineNumber: 2,
        visualizationState: { data: [...arr], visualData: [...visualArr] }
      })

      while (j > 0) {
        comparisons++
        steps.push({
          stepNumber: stepNum++,
          action: 'compare',
          explanation: `Comparing key A[${j}] = ${arr[j]} with A[${j-1}] = ${arr[j-1]}`,
          indices: [j - 1, j],
          comparisons,
          swaps,
          pseudocodeLineNumber: 4,
          visualizationState: { data: [...arr], visualData: [...visualArr] }
        })

        if (arr[j - 1] > arr[j]) {
          // Swap visually instead of shifting to prevent duplicate keys
          const temp = arr[j]
          arr[j] = arr[j - 1]
          arr[j - 1] = temp

          const tempV = visualArr[j]
          visualArr[j] = visualArr[j - 1]
          visualArr[j - 1] = tempV
          swaps++

          steps.push({
            stepNumber: stepNum++,
            action: 'shift',
            explanation: `Since ${arr[j]} > ${arr[j-1]}, swap them to shift the key leftwards.`,
            indices: [j - 1, j],
            comparisons,
            swaps,
            pseudocodeLineNumber: 5,
            visualizationState: { data: [...arr], visualData: [...visualArr] }
          })
          j--
        } else {
          break
        }
      }
    }

    steps.push({ 
      stepNumber: stepNum++, 
      action: 'complete', 
      explanation: 'Array is now fully sorted!', 
      comparisons, 
      swaps, 
      pseudocodeLineNumber: 1, 
      visualizationState: { data: [...arr], visualData: [...visualArr], sorted: true } 
    })

    return steps
  }
}
