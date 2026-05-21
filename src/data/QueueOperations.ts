import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = { name: 'Queue Operations', description: '', type: 'queue-operations', visualizationType: 'queue', timeComplexity: 'O(1)', spaceComplexity: 'O(n)', category: 'data-structure' }
const PSEUDOCODE: PseudocodeLine[] = [{ lineNumber: 1, code: 'class Queue' }, { lineNumber: 2, code: '  procedure enqueue(value)' }, { lineNumber: 3, code: '    queue.append(value)' }, { lineNumber: 4, code: '  procedure dequeue()' }, { lineNumber: 5, code: '    return queue.remove(0)' }]

export class QueueExecutor extends AlgorithmExecutor {
  constructor(data: number[]) { super(data, METADATA, PSEUDOCODE); this.state.history = this.generateSteps(); this.state.totalSteps = this.state.history.length; }

  generateSteps(): ExecutionStep[] {
    const steps: ExecutionStep[] = [{ stepNumber: 0, action: 'initialize', explanation: 'Queue Operations Demo', comparisons: 0, swaps: 0, pseudocodeLineNumber: 1 }];
    let stepNum = 1;
    
    for (let i = 0; i < this.state.data.length; i++) {
      steps.push({ stepNumber: stepNum++, action: 'enqueue', explanation: `Enqueue ${this.state.data[i]}`, indices: [i], comparisons: 0, swaps: 0, pseudocodeLineNumber: 2, visualizationState: { queueContents: this.state.data.slice(0, i+1) } });
    }
    
    for (let i = 0; i < this.state.data.length; i++) {
      steps.push({ stepNumber: stepNum++, action: 'dequeue', explanation: `Dequeue ${this.state.data[i]}`, indices: [0], comparisons: 0, swaps: 0, pseudocodeLineNumber: 4, visualizationState: { queueContents: this.state.data.slice(i+1) } });
    }
    
    steps.push({ stepNumber: stepNum++, action: 'complete', explanation: 'Queue operations complete.', indices: [], comparisons: 0, swaps: 0, pseudocodeLineNumber: 1, visualizationState: { queueContents: [] } });
    
    return steps;
  }
}
