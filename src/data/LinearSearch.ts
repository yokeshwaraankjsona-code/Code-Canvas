import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = { name: 'Linear Search', description: '', type: 'linear-search', visualizationType: 'array', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', category: 'searching' }
const PSEUDOCODE: PseudocodeLine[] = [{ lineNumber: 1, code: 'procedure linearSearch(A, target)' }, { lineNumber: 2, code: '  for i = 0 to length(A)-1' }, { lineNumber: 3, code: '    if A[i] == target' }, { lineNumber: 4, code: '      return i' }, { lineNumber: 5, code: '  return -1' }]

export class LinearSearchExecutor extends AlgorithmExecutor {
  private target: number;

  constructor(data: number[], target?: number | null) { 
    super(data, METADATA, PSEUDOCODE); 
    this.target = target != null ? target : this.state.data[Math.floor(Math.random() * this.state.data.length)];
    this.state.history = this.generateSteps(); 
    this.state.totalSteps = this.state.history.length; 
  }

  generateSteps(): ExecutionStep[] {
    const target = this.target;
    let stepNum = 0;
    const steps: ExecutionStep[] = [{ stepNumber: stepNum++, action: 'initialize', explanation: `Searching for ${target}`, comparisons: 0, swaps: 0, pseudocodeLineNumber: 1 }];
    
    let found = false;
    let comparisons = 0;
    
    for (let i = 0; i < this.state.data.length; i++) {
      comparisons++;
      steps.push({ stepNumber: stepNum++, action: 'compare', explanation: `Checking arr[${i}] = ${this.state.data[i]}`, indices: [i], comparisons, swaps: 0, pseudocodeLineNumber: 3 });
      if (this.state.data[i] === target) {
        steps.push({ stepNumber: stepNum++, action: 'found', explanation: `Found ${target} at index ${i}!`, indices: [i], comparisons, swaps: 0, pseudocodeLineNumber: 4 });
        found = true;
        break;
      }
    }
    
    if (!found) {
      steps.push({ stepNumber: stepNum++, action: 'not_found', explanation: `${target} not found in array.`, indices: [], comparisons, swaps: 0, pseudocodeLineNumber: 5 });
    }
    
    steps.push({ stepNumber: stepNum++, action: 'complete', explanation: 'Linear Search complete.', indices: [], comparisons, swaps: 0, pseudocodeLineNumber: found ? 4 : 5 });
    
    return steps;
  }
}
