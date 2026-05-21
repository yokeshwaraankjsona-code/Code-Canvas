# Algorithm Visualization Platform

A professional interactive algorithm and data structure visualization platform built with React, TypeScript, and Framer Motion. Learn algorithms step-by-step with real-time visualizations, live explanations, and synchronized pseudocode.

## Features

### 🎯 Supported Algorithms

**Sorting Algorithms:**
- Bubble Sort - O(n²) comparison sort
- Selection Sort - O(n²) selection-based sort
- Insertion Sort - O(n²) incremental sort
- Merge Sort - O(n log n) divide-and-conquer sort

**Searching Algorithms:**
- Linear Search - O(n) sequential search
- Binary Search - O(log n) divide-and-conquer search

**Data Structures:**
- Stack Operations - LIFO data structure
- Queue Operations - FIFO data structure
- Binary Tree Traversal - Inorder, Preorder, Postorder, Level-order
- Graph Traversal - BFS/DFS graph algorithms

### 📊 Visualization Types

- **Animated Bars** - For sorting algorithms
- **Array Elements** - For searching algorithms
- **Stack/Queue Containers** - For data structure operations
- **Tree Nodes** - For tree traversals
- **Graph Nodes** - For graph traversals

### ⚙️ Playback Controls

- ▶️ **Play** - Automatically step through the algorithm
- ⏸️ **Pause** - Pause execution at any point
- ⏭️ **Next Step** - Manually advance one step
- ⏮️ **Previous Step** - Go back one step
- 🔄 **Reset** - Restart from the beginning
- 🎚️ **Speed Control** - Adjust execution speed (0.5x - 2x)

### 📈 Real-time Statistics

- **Comparisons** - Number of comparison operations
- **Swaps** - Number of swap/exchange operations
- **Iterations** - Current iteration count
- **Operations** - Total operations performed
- **Complexity** - Time and Space complexity display

### 📝 Educational Features

- **Live Explanation Panel** - Step-by-step explanation of what's happening
- **Synchronized Pseudocode** - Highlights the current line being executed
- **Algorithm Metadata** - Time/Space complexity for each algorithm
- **Custom Input** - Enter your own data or use random generation

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

```bash
npm run build
```

## Architecture

### Core Components

- **VisualizerContext** - Central state management for all visualization data
- **AlgorithmExecutor** - Base class for all algorithm implementations
- **VisualizerContainer** - Main layout orchestrator
- **PlaybackEngine** - Handles step navigation and playback logic

### Algorithm Implementation

Each algorithm implements the `AlgorithmExecutor` abstract class:

```typescript
class MyAlgorithmExecutor extends AlgorithmExecutor {
  generateSteps(): ExecutionStep[] {
    // Generate all execution steps upfront
    // Each step includes: action, explanation, indices, statistics
  }
}
```

### Step Structure

```typescript
interface ExecutionStep {
  stepNumber: number
  action: string  // 'compare', 'swap', 'visit', etc.
  explanation: string  // Human-readable description
  indices?: number[]  // Highlighted array indices
  comparisons?: number  // Running count
  swaps?: number  // Running count
  pseudocodeLineNumber?: number  // Which line of pseudocode
  visualizationState?: any  // Algorithm-specific visualization data
}
```

## Usage

### Navigate to Visualizer

Visit `/visualizer` route or click "Algorithm Visualizer" from the landing page.

### Select Algorithm

Choose an algorithm from the left sidebar categorized by type:
- Sorting
- Searching
- Data Structures
- Graph Algorithms

### Enter Data

Either:
- **Load Data**: Paste comma-separated numbers
- **Random**: Generate random dataset

### Play & Learn

1. Click **Play** to start automatic execution
2. Watch the visualization update in real-time
3. Read the explanation panel to understand each step
4. Check pseudocode highlighting for code understanding
5. Review statistics for algorithm analysis

### Manual Control

Use step buttons to advance/rewind at your own pace for detailed analysis.

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide Icons** - UI icons

## Project Structure

```
src/
├── components/
│   ├── Visualizer/
│   │   ├── VisualizerContainer.tsx
│   │   ├── AlgorithmSelector.tsx
│   │   ├── InputForm.tsx
│   │   ├── PlaybackControls.tsx
│   │   ├── StatisticsDisplay.tsx
│   │   ├── ExplanationPanel.tsx
│   │   ├── PseudocodeViewer.tsx
│   │   └── visualizations/
│   │       ├── SortingBars.tsx
│   │       ├── SearchArray.tsx
│   │       ├── TreeVisualization.tsx
│   │       └── StackQueueVisualization.tsx
│   └── VisualizerContext.tsx
├── data/
│   ├── algorithmTypes.ts
│   ├── AlgorithmExecutor.ts
│   ├── algorithmMetadata.ts
│   ├── BubbleSort.ts
│   ├── SelectionSort.ts
│   ├── InsertionSort.ts
│   ├── MergeSort.ts
│   ├── LinearSearch.ts
│   ├── BinarySearch.ts
│   ├── StackOperations.ts
│   ├── QueueOperations.ts
│   ├── BinaryTreeTraversal.ts
│   └── GraphTraversal.ts
├── pages/
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   └── AlgorithmVisualizer.tsx
└── App.tsx
```

## Color Scheme

- **Normal Elements**: Cyan to Purple gradient
- **Comparing**: Yellow highlight
- **Swapping**: Red highlight
- **Sorted/Complete**: Green highlight
- **Active Focus**: Blue with glow effect
- **Background**: Dark slate theme

## Customization

### Adding a New Algorithm

1. Create executor class in `src/data/`:

```typescript
export class MySortExecutor extends AlgorithmExecutor {
  constructor(data: number[]) {
    super(data, METADATA, PSEUDOCODE)
    this.state.history = this.generateSteps()
    this.state.totalSteps = this.state.history.length
  }
  
  generateSteps(): ExecutionStep[] {
    // Implement your algorithm
  }
}
```

2. Add to `algorithmMetadata.ts`:

```typescript
export const ALGORITHM_METADATA: Record<AlgorithmType, AlgorithmMetadata> = {
  'my-algorithm': {
    name: 'My Algorithm',
    description: 'Description here',
    type: 'my-algorithm',
    visualizationType: 'bars',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    category: 'sorting'
  }
}
```

3. Update type definitions in `algorithmTypes.ts` and `getAlgorithmExecutor()` function.

## Performance

- Pre-generates all steps upfront for fast navigation
- Uses React memo and Framer Motion for smooth animations
- Efficient step indexing for O(1) random access
- Handles up to 100 elements smoothly

## Learning Outcomes

Users can understand:
- How different algorithms work step-by-step
- Why certain algorithms are faster/slower
- Time and space complexity implications
- Visual patterns in algorithm behavior
- How data structures operations work

## Future Enhancements

- [ ] More sorting algorithms (Quick Sort, Heap Sort, etc.)
- [ ] More graph algorithms (Dijkstra, A*, etc.)
- [ ] Sound effects for operations
- [ ] Comparison mode (side-by-side algorithms)
- [ ] Custom comparison functions
- [ ] Algorithm complexity analysis
- [ ] Performance benchmarking
- [ ] Export/share visualizations

## Contributing

Contributions welcome! Please ensure:
- TypeScript types are correct
- Algorithm generates valid step sequences
- Animations are smooth
- Code follows existing patterns

## License

MIT
