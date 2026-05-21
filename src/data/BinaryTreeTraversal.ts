import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = { name: 'Binary Tree Traversal', description: '', type: 'binary-tree-traversal', visualizationType: 'tree', timeComplexity: 'O(n)', spaceComplexity: 'O(h)', category: 'data-structure' }
const PSEUDOCODE: PseudocodeLine[] = [{ lineNumber: 1, code: 'procedure inorder(node)' }, { lineNumber: 2, code: '  if node != null' }, { lineNumber: 3, code: '    inorder(node.left)' }, { lineNumber: 4, code: '    visit(node)' }, { lineNumber: 5, code: '    inorder(node.right)' }]

export class BinaryTreeExecutor extends AlgorithmExecutor {
  constructor(data: number[]) { super(data, METADATA, PSEUDOCODE); this.state.history = this.generateSteps(); this.state.totalSteps = this.state.history.length; }

  generateSteps(): ExecutionStep[] {
    const steps: ExecutionStep[] = [{ stepNumber: 0, action: 'initialize', explanation: 'Binary Tree Traversal', comparisons: 0, swaps: 0, pseudocodeLineNumber: 1 }];
    let stepNum = 1;
    
    for (let i = 0; i < this.state.data.length; i++) {
      steps.push({ stepNumber: stepNum++, action: 'visit', explanation: `Visiting node with value ${this.state.data[i]}`, indices: [i], comparisons: 0, swaps: 0, pseudocodeLineNumber: 4 });
    }
    
    steps.push({ stepNumber: stepNum++, action: 'complete', explanation: 'Binary Tree Traversal complete.', indices: [], comparisons: 0, swaps: 0, pseudocodeLineNumber: 1 });
    
    return steps;
  }
}
