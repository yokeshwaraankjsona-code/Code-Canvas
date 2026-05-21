import { AlgorithmType, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'
import { AlgorithmExecutor } from './AlgorithmExecutor'
import { BubbleSortExecutor } from './BubbleSort'
import { SelectionSortExecutor } from './SelectionSort'
import { InsertionSortExecutor } from './InsertionSort'
import { MergeSortExecutor } from './MergeSort'
import { LinearSearchExecutor } from './LinearSearch'
import { BinarySearchExecutor } from './BinarySearch'
import { StackExecutor } from './StackOperations'
import { QueueExecutor } from './QueueOperations'
import { BinaryTreeExecutor } from './BinaryTreeTraversal'
import { GraphExecutor } from './GraphTraversal'

export const ALGORITHM_METADATA: Record<AlgorithmType, AlgorithmMetadata> = {
  'bubble-sort': {
    name: 'Bubble Sort',
    description: 'Simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    type: 'bubble-sort',
    visualizationType: 'bars',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'sorting'
  },
  'selection-sort': {
    name: 'Selection Sort',
    description: 'Sorts by repeatedly finding the minimum element from unsorted part and putting it at the beginning.',
    type: 'selection-sort',
    visualizationType: 'bars',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'sorting'
  },
  'insertion-sort': {
    name: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time by inserting elements into their correct position.',
    type: 'insertion-sort',
    visualizationType: 'bars',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    category: 'sorting'
  },
  'merge-sort': {
    name: 'Merge Sort',
    description: 'Divide-and-conquer algorithm that divides the array in half, sorts them and merges them back.',
    type: 'merge-sort',
    visualizationType: 'bars',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    category: 'sorting'
  },
  'linear-search': {
    name: 'Linear Search',
    description: 'Simple search algorithm that checks every element in the list until the target is found.',
    type: 'linear-search',
    visualizationType: 'array',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    category: 'searching'
  },
  'binary-search': {
    name: 'Binary Search',
    description: 'Efficient search algorithm for sorted arrays that eliminates half of remaining elements with each comparison.',
    type: 'binary-search',
    visualizationType: 'array',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    category: 'searching'
  },
  'stack-operations': {
    name: 'Stack Operations',
    description: 'LIFO (Last In First Out) data structure where elements are added and removed from the same end.',
    type: 'stack-operations',
    visualizationType: 'stack',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    category: 'data-structure'
  },
  'queue-operations': {
    name: 'Queue Operations',
    description: 'FIFO (First In First Out) data structure where elements are added at the rear and removed from the front.',
    type: 'queue-operations',
    visualizationType: 'queue',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    category: 'data-structure'
  },
  'binary-tree-traversal': {
    name: 'Binary Tree Traversal',
    description: 'Traversal methods for binary trees: Inorder, Preorder, Postorder, and Level-order (BFS).',
    type: 'binary-tree-traversal',
    visualizationType: 'tree',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    category: 'data-structure'
  },
  'bfs-dfs': {
    name: 'BFS / DFS',
    description: 'Graph traversal algorithms: Breadth-First Search and Depth-First Search for exploring connected graphs.',
    type: 'bfs-dfs',
    visualizationType: 'tree',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    category: 'graph'
  }
}

export function getAlgorithmExecutor(algorithmType: AlgorithmType, data: number[], target?: number | null): AlgorithmExecutor {
  const sortedData = [...data].sort((a, b) => a - b)
  
  switch (algorithmType) {
    case 'bubble-sort':
      return new BubbleSortExecutor(data)
    case 'selection-sort':
      return new SelectionSortExecutor(data)
    case 'insertion-sort':
      return new InsertionSortExecutor(data)
    case 'merge-sort':
      return new MergeSortExecutor(data)
    case 'linear-search':
      return new LinearSearchExecutor(data, target)
    case 'binary-search':
      return new BinarySearchExecutor(sortedData, target)
    case 'stack-operations':
      return new StackExecutor(data)
    case 'queue-operations':
      return new QueueExecutor(data)
    case 'binary-tree-traversal':
      return new BinaryTreeExecutor(data)
    case 'bfs-dfs':
      return new GraphExecutor(data)
    default:
      throw new Error(`Unknown algorithm: ${algorithmType}`)
  }
}
