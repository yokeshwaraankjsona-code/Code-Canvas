# Developer Guide - Algorithm Visualizer

## Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│  UI Layer (Components)                  │
│  - VisualizerContainer                  │
│  - Visualizations (Bars, Arrays, etc)   │
│  - Controls (Play, Pause, etc)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  State Layer (Context + Hooks)          │
│  - VisualizerContext                    │
│  - usePlaybackLoop                      │
│  - State Management                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Algorithm Layer (Executors)            │
│  - AlgorithmExecutor (base)             │
│  - Specific Algorithm Classes           │
│  - Step Generation                      │
└─────────────────────────────────────────┘
```

## Core Concepts

### 1. AlgorithmExecutor Pattern

Every algorithm extends the base `AlgorithmExecutor` class:

```typescript
abstract class AlgorithmExecutor {
  // Pre-generated steps
  protected state: AlgorithmState
  protected metadata: AlgorithmMetadata
  protected pseudocode: PseudocodeLine[]

  // Called once during construction
  abstract generateSteps(): ExecutionStep[]

  // Public methods for navigation
  nextStep(): ExecutionStep | null
  previousStep(): ExecutionStep | null
  jumpToStep(index: number): ExecutionStep | null
  reset(): void
}
```

**Key Benefits:**
- All algorithms follow same interface
- Steps pre-computed (fast random access)
- Easy to add new algorithms
- Consistent behavior across all algorithms

### 2. ExecutionStep Structure

Each step contains everything needed for visualization:

```typescript
interface ExecutionStep {
  stepNumber: number           // Step identifier
  action: string              // 'compare', 'swap', 'visit', etc
  explanation: string         // Human-readable description
  indices?: number[]          // Highlighted array positions
  comparisons?: number        // Running count
  swaps?: number              // Running count
  operations?: number         // Total operations
  pseudocodeLineNumber?: number // Which line to highlight
  visualizationState?: any    // Algorithm-specific data
}
```

**Usage:**
- UI automatically highlights `indices`
- Explanation auto-updates to `explanation`
- Pseudocode highlights `pseudocodeLineNumber`
- Statistics display `comparisons`, `swaps`, etc
- Algorithm-specific visual updates from `visualizationState`

### 3. VisualizerContext

Central state management using React Context:

```typescript
interface VisualizerContextType {
  algorithm: AlgorithmType | null
  algorithmState: AlgorithmState | null
  playbackState: PlaybackState
  inputData: number[]
  pseudocode: PseudocodeLine[]
  currentExplanation: string
  
  selectAlgorithm(algo: AlgorithmType): void
  setInputData(data: number[]): void
  play(): void
  pause(): void
  nextStep(): void
  previousStep(): void
  reset(): void
  setSpeed(speed: number): void
}
```

**Usage:**
```typescript
const { 
  algorithmState, 
  playbackState, 
  nextStep, 
  currentExplanation 
} = useVisualizer()
```

### 4. Playback Loop Hook

Handles automatic stepping during playback:

```typescript
export const usePlaybackLoop = () => {
  const { playbackState, nextStep, algorithmState } = useVisualizer()

  useEffect(() => {
    if (!playbackState.isPlaying || !algorithmState) return

    const delay = 500 / playbackState.speed
    const interval = setInterval(() => {
      if (playbackState.currentStepIndex < algorithmState.history.length - 1) {
        nextStep()
      }
    }, delay)

    return () => clearInterval(interval)
  }, [playbackState, algorithmState])
}
```

## Adding a New Algorithm

### Step 1: Create Executor Class

```typescript
// src/data/MySort.ts
import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = {
  name: 'My Sort',
  description: 'My sorting algorithm',
  type: 'my-sort',
  visualizationType: 'bars',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(1)',
  category: 'sorting'
}

const PSEUDOCODE: PseudocodeLine[] = [
  { lineNumber: 1, code: 'procedure mySort(A):' },
  { lineNumber: 2, code: '  ...' }
]

export class MySortExecutor extends AlgorithmExecutor {
  constructor(data: number[]) {
    super(data, METADATA, PSEUDOCODE)
    this.state.history = this.generateSteps()
    this.state.totalSteps = this.state.history.length
  }

  generateSteps(): ExecutionStep[] {
    const steps: ExecutionStep[] = []
    const arr = [...this.state.data]
    let comparisons = 0, swaps = 0, stepNum = 0

    // Initial state
    steps.push({
      stepNumber: stepNum++,
      action: 'initialize',
      explanation: `Starting My Sort with ${arr.length} elements`,
      comparisons: 0,
      swaps: 0,
      pseudocodeLineNumber: 1
    })

    // Implement your algorithm here
    // For each operation:
    // 1. Perform operation on arr
    // 2. Create ExecutionStep describing it
    // 3. Push to steps array
    // 4. Update counters

    // Final state
    steps.push({
      stepNumber: stepNum++,
      action: 'complete',
      explanation: 'Array is sorted!',
      comparisons,
      swaps,
      pseudocodeLineNumber: 1,
      visualizationState: { data: [...arr], sorted: true }
    })

    return steps
  }
}
```

### Step 2: Update Type Definitions

```typescript
// src/data/algorithmTypes.ts
export type AlgorithmType = 
  | ... existing types
  | 'my-sort'  // Add this
```

### Step 3: Register in Metadata

```typescript
// src/data/algorithmMetadata.ts
import { MySortExecutor } from './MySort'  // Add import

export const ALGORITHM_METADATA: Record<AlgorithmType, AlgorithmMetadata> = {
  'my-sort': {
    name: 'My Sort',
    description: 'My sorting algorithm description',
    type: 'my-sort',
    visualizationType: 'bars',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    category: 'sorting'
  },
  // ... other metadata
}

export function getAlgorithmExecutor(algorithmType: AlgorithmType, data: number[]): AlgorithmExecutor {
  switch (algorithmType) {
    case 'my-sort':  // Add this
      return new MySortExecutor(data)
    // ... other cases
  }
}
```

## Implementation Best Practices

### 1. Step Generation

**DO:**
```typescript
// Generate all steps upfront
generateSteps(): ExecutionStep[] {
  const steps: ExecutionStep[] = []
  // Pre-compute all steps
  return steps
}
```

**DON'T:**
```typescript
// Don't generate steps on-demand
nextStep() {
  // This is slow and error-prone
}
```

### 2. Immutability

**DO:**
```typescript
const arr = [...data]  // Copy first
arr[i] = newValue     // Modify copy
steps.push({ ..., visualizationState: { data: [...arr] } })
```

**DON'T:**
```typescript
data[i] = newValue    // Modifying original data
steps.push({ ..., data })  // Sharing references
```

### 3. Statistics Tracking

**DO:**
```typescript
let comparisons = 0, swaps = 0
// When comparing:
comparisons++
steps.push({ ..., comparisons })

// When swapping:
swaps++
steps.push({ ..., swaps })
```

### 4. Pseudocode Linking

**DO:**
```typescript
// Link each step to pseudocode line
steps.push({
  ...,
  pseudocodeLineNumber: 5  // Highlights line 5
})
```

### 5. Clear Explanations

**DO:**
```typescript
explanation: `Comparing arr[${i}] = ${arr[i]} with arr[${j}] = ${arr[j]}`
```

**DON'T:**
```typescript
explanation: 'comparing'  // Too vague
```

## Performance Optimization

### 1. Pre-compute Everything

Steps should be completely pre-computed:

```typescript
constructor(data: number[]) {
  super(data, METADATA, PSEUDOCODE)
  // Compute all steps upfront
  this.state.history = this.generateSteps()  // Not in render/step
  this.state.totalSteps = this.state.history.length
}
```

**Why:** O(1) navigation, no lag during playback

### 2. Avoid Unnecessary Re-renders

Use `useCallback` and memoization:

```typescript
const nextStep = useCallback(() => {
  setPlaybackState(prev => ({ ...prev, currentStepIndex: ... }))
}, [executor])  // Dependencies explicit
```

### 3. Efficient Animations

Use Framer Motion's `layoutId` and `animate`:

```typescript
<motion.div
  layoutId={`bar-${idx}`}  // Track same element across updates
  animate={{ height: ... }}  // Smooth transitions
/>
```

### 4. Handle Large Datasets

```typescript
// Warn user if too large
if (numbers.length > 100) {
  setError('Maximum 100 elements')
}
```

## Testing Checklist

### For Each New Algorithm

```typescript
// ✅ Generate correct number of steps
expect(executor.getState().history.length).toBeGreaterThan(0)

// ✅ Final result is sorted
const final = executor.getState().data
expect(isSorted(final)).toBe(true)

// ✅ Statistics are tracked
expect(executor.getState().comparisons).toBeGreaterThan(0)

// ✅ Navigation works
executor.nextStep()
executor.previousStep()
executor.reset()

// ✅ Pseudocode lines are valid
executor.getPseudocode().forEach(line => {
  expect(line.lineNumber).toBeGreaterThan(0)
  expect(line.code).toBeTruthy()
})
```

## Debugging Tips

### 1. Check Step Generation

```typescript
const executor = new MySortExecutor([3, 1, 4, 1, 5])
const steps = executor.getState().history
console.table(steps)  // See all steps
```

### 2. Verify Visualization State

```typescript
// Each step should update correctly
steps.forEach(step => {
  console.log(`Step ${step.stepNumber}: ${step.explanation}`)
  console.log(`Indices: ${step.indices}`)
  console.log(`Comparisons: ${step.comparisons}`)
})
```

### 3. Test Navigation

```typescript
executor.nextStep()
executor.nextStep()
executor.previousStep()
expect(executor.getState().currentStep).toBe(1)
```

## Common Issues & Solutions

### Issue: Infinite Loop in Algorithm
**Solution:** Ensure proper loop termination conditions
```typescript
// Check: for loop or while loop conditions are correct
// Check: variables are being incremented/changed
```

### Issue: Statistics Not Updating
**Solution:** Make sure counters are incremented
```typescript
// Add: comparisons++ when comparing
// Add: swaps++ when swapping
// Include in steps: comparisons, swaps
```

### Issue: Animations Lag
**Solution:** Reduce number of steps or increase element size
```typescript
// Option 1: Combine multiple micro-operations into one step
// Option 2: Reduce visualization complexity
// Option 3: Use shouldComponentUpdate for optimization
```

### Issue: State Mutations
**Solution:** Always copy arrays before modifying
```typescript
// DO: const arr = [...data]
// DON'T: const arr = data
```

## File Organization

```
src/data/
├── algorithmTypes.ts         // All type definitions
├── AlgorithmExecutor.ts      // Base class
├── algorithmMetadata.ts      // Registry & factory
├── BubbleSort.ts             // Specific algorithms
├── SelectionSort.ts
├── ...
└── usePlaybackLoop.ts        // Hook for playback

src/components/
├── VisualizerContext.tsx     // State management
└── Visualizer/
    ├── VisualizerContainer.tsx     // Main layout
    ├── AlgorithmSelector.tsx       // Algorithm picker
    ├── InputForm.tsx               // Input handler
    ├── PlaybackControls.tsx        // Control buttons
    ├── StatisticsDisplay.tsx       // Stats panel
    ├── ExplanationPanel.tsx        // Explanation text
    ├── PseudocodeViewer.tsx        // Code display
    └── visualizations/
        ├── SortingBars.tsx         // Bar visualization
        ├── SearchArray.tsx         // Array visualization
        ├── TreeVisualization.tsx   // Tree visualization
        └── StackQueueVisualization.tsx  // Structure visualization
```

## Performance Metrics

**Recommended Limits:**
- Max elements: 100
- Max steps in history: 10,000
- Animation frame rate: 60 FPS
- Speed range: 0.5x to 2x

## Future Enhancement Ideas

1. **Add more algorithms**: Quick Sort, Heap Sort, Radix Sort
2. **Comparison mode**: Show two algorithms side-by-side
3. **Custom comparators**: Let users define sort order
4. **Performance benchmarking**: Compare real runtimes
5. **Export functionality**: Save/share visualizations
6. **Sound effects**: Audio for operations
7. **Accessibility improvements**: Better keyboard navigation
8. **Mobile optimization**: Responsive touch controls

## Resources

- React Context: https://react.dev/reference/react/useContext
- Framer Motion: https://www.framer.com/motion/
- TypeScript: https://www.typescriptlang.org/docs/
- Algorithm Visualization: https://www.cs.usfca.edu/~galles/visualization/

## Support

For questions or issues:
1. Check existing algorithm implementations
2. Review error console for TypeScript errors
3. Verify ExecutionStep structure matches interface
4. Test with simple 3-element array first
5. Print debug logs to console
