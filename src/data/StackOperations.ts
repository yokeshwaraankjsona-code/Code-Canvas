import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = { name: 'Stack Operations', description: '', type: 'stack-operations', visualizationType: 'stack', timeComplexity: 'O(1)', spaceComplexity: 'O(n)', category: 'data-structure' }
const PSEUDOCODE: PseudocodeLine[] = [{ lineNumber: 1, code: 'class Stack' }, { lineNumber: 2, code: '  procedure push(value)' }, { lineNumber: 3, code: '    stack.append(value)' }, { lineNumber: 4, code: '  procedure pop()' }, { lineNumber: 5, code: '    return stack.remove(stack.length-1)' }]

export class StackExecutor extends AlgorithmExecutor {
  constructor(data: number[]) { super(data, METADATA, PSEUDOCODE); this.state.history = this.generateSteps(); this.state.totalSteps = this.state.history.length; }

  generateSteps(): ExecutionStep[] {
    const steps: ExecutionStep[] = [{ stepNumber: 0, action: 'initialize', explanation: 'Stack Operations Demo', comparisons: 0, swaps: 0, pseudocodeLineNumber: 1 }];
    let stepNum = 1;
    
    for (let i = 0; i < this.state.data.length; i++) {
      steps.push({ stepNumber: stepNum++, action: 'push', explanation: `Push ${this.state.data[i]} onto stack`, indices: [i], comparisons: 0, swaps: 0, pseudocodeLineNumber: 2, visualizationState: { stackContents: this.state.data.slice(0, i+1) } });
    }
    
    for (let i = this.state.data.length - 1; i >= 0; i--) {
      steps.push({ stepNumber: stepNum++, action: 'pop', explanation: `Pop ${this.state.data[i]} from stack`, indices: [i], comparisons: 0, swaps: 0, pseudocodeLineNumber: 4, visualizationState: { stackContents: this.state.data.slice(0, i) } });
    }
    
    steps.push({ stepNumber: stepNum++, action: 'complete', explanation: 'Stack operations complete.', indices: [], comparisons: 0, swaps: 0, pseudocodeLineNumber: 1, visualizationState: { stackContents: [] } });
    
    return steps;
  }
}
