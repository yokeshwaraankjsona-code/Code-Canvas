import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = { name: 'Binary Search', description: '', type: 'binary-search', visualizationType: 'array', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', category: 'searching' }
const PSEUDOCODE: PseudocodeLine[] = [{ lineNumber: 1, code: 'procedure binarySearch(A, target)' }, { lineNumber: 2, code: '  left = 0, right = length(A) - 1' }, { lineNumber: 3, code: '  while left <= right' }, { lineNumber: 4, code: '    mid = (left + right) / 2' }, { lineNumber: 5, code: '    if A[mid] == target return mid' }, { lineNumber: 6, code: '    else if A[mid] < target left = mid + 1' }, { lineNumber: 7, code: '    else right = mid - 1' }]

export class BinarySearchExecutor extends AlgorithmExecutor {
  private target: number;

  constructor(data: number[], target?: number | null) { 
    super(data, METADATA, PSEUDOCODE); 
    this.target = target != null ? target : this.state.data[Math.floor(Math.random() * this.state.data.length)];
    this.state.history = this.generateSteps(); 
    this.state.totalSteps = this.state.history.length; 
  }

  generateSteps(): ExecutionStep[] {
    const target = this.target;
    const steps: ExecutionStep[] = [{ stepNumber: 0, action: 'initialize', explanation: `Binary search for ${target}`, comparisons: 0, swaps: 0, pseudocodeLineNumber: 2 }];
    
    let left = 0, right = this.state.data.length - 1, comparisons = 0, stepNum = 1;
    let found = false;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      comparisons++;
      steps.push({ stepNumber: stepNum++, action: 'compare', explanation: `Comparing mid=${this.state.data[mid]} with target=${target}`, indices: [mid, left, right], comparisons, swaps: 0, pseudocodeLineNumber: 5 });
      
      if (this.state.data[mid] === target) {
        steps.push({ stepNumber: stepNum++, action: 'found', explanation: `Found ${target} at index ${mid}!`, indices: [mid], comparisons, swaps: 0, pseudocodeLineNumber: 5 });
        found = true;
        break;
      } else if (this.state.data[mid] < target) {
        left = mid + 1;
        steps.push({ stepNumber: stepNum++, action: 'search_right', explanation: `${this.state.data[mid]} < ${target}, searching right`, indices: [left, right], comparisons, swaps: 0, pseudocodeLineNumber: 6 });
      } else {
        right = mid - 1;
        steps.push({ stepNumber: stepNum++, action: 'search_left', explanation: `${this.state.data[mid]} > ${target}, searching left`, indices: [left, right], comparisons, swaps: 0, pseudocodeLineNumber: 7 });
      }
    }
    
    if (!found) {
      steps.push({ stepNumber: stepNum++, action: 'not_found', explanation: `${target} not found in array.`, indices: [], comparisons, swaps: 0, pseudocodeLineNumber: 7 });
    }
    
    steps.push({ stepNumber: stepNum++, action: 'complete', explanation: 'Binary Search complete.', indices: [], comparisons, swaps: 0, pseudocodeLineNumber: found ? 5 : 7 });
    
    return steps;
  }
}
