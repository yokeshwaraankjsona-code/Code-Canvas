import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = { name: 'BFS / DFS', description: '', type: 'bfs-dfs', visualizationType: 'tree', timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', category: 'graph' }
const PSEUDOCODE: PseudocodeLine[] = [{ lineNumber: 1, code: 'procedure BFS(graph, start)' }, { lineNumber: 2, code: '  queue.enqueue(start)' }, { lineNumber: 3, code: '  while queue not empty' }, { lineNumber: 4, code: '    node = queue.dequeue()' }, { lineNumber: 5, code: '    visit(node)' }, { lineNumber: 6, code: '    for each neighbor of node' }, { lineNumber: 7, code: '      queue.enqueue(neighbor)' }]

export class GraphExecutor extends AlgorithmExecutor {
  constructor(data: number[]) { super(data, METADATA, PSEUDOCODE); this.state.history = this.generateSteps(); this.state.totalSteps = this.state.history.length; }

  generateSteps(): ExecutionStep[] {
    const steps: ExecutionStep[] = [{ stepNumber: 0, action: 'initialize', explanation: 'Graph Traversal (BFS/DFS)', comparisons: 0, swaps: 0, pseudocodeLineNumber: 1 }];
    let stepNum = 1;
    
    for (let i = 0; i < this.state.data.length; i++) {
      steps.push({ stepNumber: stepNum++, action: 'visit', explanation: `Visiting node ${this.state.data[i]}`, indices: [i], comparisons: 0, swaps: 0, pseudocodeLineNumber: 5 });
    }
    
    steps.push({ stepNumber: stepNum++, action: 'complete', explanation: 'Graph Traversal complete.', indices: [], comparisons: 0, swaps: 0, pseudocodeLineNumber: 1 });
    
    return steps;
  }
}
