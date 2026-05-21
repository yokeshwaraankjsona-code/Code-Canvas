# Algorithm Implementation Details

## Sorting Algorithms

### Bubble Sort
**Time: O(n²) | Space: O(1)**

Simplest sorting algorithm. Repeatedly compares adjacent elements and swaps if they're in wrong order.

**How it works:**
1. Compare adjacent pairs (i, i+1)
2. Swap if arr[i] > arr[i+1]
3. Repeat until no swaps occur
4. Largest unsorted element "bubbles up" each iteration

**Visualization:**
- Comparing pairs shown in yellow
- Swaps shown in red
- Sorted elements shown in green
- Tracks comparisons and swaps

### Selection Sort
**Time: O(n²) | Space: O(1)**

Divides array into sorted and unsorted regions. Finds minimum in unsorted and places at beginning.

**How it works:**
1. Find minimum in unsorted region
2. Swap with first element of unsorted region
3. Move boundary one position right
4. Repeat until array is sorted

**Visualization:**
- Current minimum highlighted
- Search region shown with indices
- Completed swaps move to sorted section

### Insertion Sort
**Time: O(n²) avg, O(n) best | Space: O(1)**

Builds sorted array one element at a time. Like sorting playing cards in hand.

**How it works:**
1. Start with second element
2. Compare with elements to the left
3. Shift larger elements right
4. Insert element in correct position
5. Repeat for all elements

**Visualization:**
- Current element being inserted in yellow
- Shifted elements shown as they move right
- Sorted section grows from left

### Merge Sort
**Time: O(n log n) | Space: O(n)**

Divide-and-conquer algorithm. Splits array in half, recursively sorts, then merges.

**How it works:**
1. Divide array into halves
2. Recursively sort each half
3. Merge two sorted halves
4. Result is fully sorted array

**Visualization:**
- Splitting phases shown with range indicators
- Merging phase shows elements being combined
- Much faster than O(n²) algorithms

## Searching Algorithms

### Linear Search
**Time: O(n) | Space: O(1)**

Simplest search. Checks each element until target found.

**How it works:**
1. Start from first element
2. Check if element equals target
3. If yes, return index
4. If no, move to next
5. Repeat until found or end reached

**Visualization:**
- Current element being checked in yellow
- Element found highlighted in green
- Comparisons tracked

### Binary Search
**Time: O(log n) | Space: O(1)**

Efficient search for sorted arrays. Eliminates half remaining elements each step.

**How it works:**
1. Find middle element
2. Compare with target
3. If equal, found (return index)
4. If target < middle, search left half
5. If target > middle, search right half
6. Repeat until found or range empty

**Visualization:**
- Search range shown
- Middle element highlighted in yellow
- Range narrows each step
- Much fewer comparisons than linear search

## Data Structure Operations

### Stack Operations
**Insert/Remove: O(1) | Space: O(n)**

LIFO (Last In First Out) data structure. Like stack of plates.

**Operations:**
- **Push**: Add element to top
- **Pop**: Remove element from top

**Visualization:**
- Elements stacked vertically
- Push adds to top
- Pop removes from top
- Shows stack contents at each step

### Queue Operations
**Insert/Remove: O(1) | Space: O(n)**

FIFO (First In First Out) data structure. Like line at store.

**Operations:**
- **Enqueue**: Add element to rear
- **Dequeue**: Remove element from front

**Visualization:**
- Elements arranged horizontally
- Enqueue adds to right
- Dequeue removes from left
- Queue contents shown

### Binary Tree Traversal
**Time: O(n) | Space: O(h) h=height**

Four traversal methods for binary trees:

**Inorder (Left-Root-Right):**
- For BST: gives sorted order
- Useful for expression evaluation

**Preorder (Root-Left-Right):**
- Process node before children
- Useful for copying tree

**Postorder (Left-Right-Root):**
- Process node after children
- Useful for deletion

**Level-order (BFS):**
- Visit nodes level by level
- Useful for tree printing

**Visualization:**
- Nodes highlighted as visited
- Traversal order tracked
- Shows recursive nature

### Graph Traversal
**Time: O(V + E) | Space: O(V)**

**Breadth-First Search (BFS):**
- Uses queue
- Explores neighbors level by level
- Finds shortest path

**Depth-First Search (DFS):**
- Uses stack (recursion)
- Explores deep before backtracking
- Useful for cycle detection

**Visualization:**
- Nodes marked as visited
- Traversal order shown
- Queue/stack contents visible

## Performance Comparison

### Sorting Algorithms (O(n²) vs O(n log n))
```
Input Size | Bubble Sort | Merge Sort | Speedup
100        | 10,000     | 664       | 15x
1,000      | 1,000,000  | 9,966     | 100x
10,000     | 100,000,000| 132,877   | 750x
```

### Searching Algorithms (O(n) vs O(log n))
```
Input Size | Linear | Binary | Speedup
100        | 50     | 6      | 8x
1,000      | 500    | 10     | 50x
1,000,000  | 500,000| 20     | 25,000x
```

## Color Coding in Visualizations

- **Cyan-Blue-Purple**: Normal/unsorted elements
- **Yellow**: Elements being compared
- **Red**: Elements being swapped
- **Green**: Sorted/completed elements
- **Blue Ring**: Active focus element
- **Glow Effect**: Highlighted during operation

## Learning Path Recommended

1. **Start with Bubble Sort**
   - Easiest to understand
   - Clear comparison and swap operations
   - Good foundation for sorting concepts

2. **Then Selection Sort**
   - Slightly more efficient
   - Shows optimization concept
   - Good minimum-finding practice

3. **Try Insertion Sort**
   - Closer to O(n) in best case
   - Practical sorting (used for small arrays)
   - Building block technique

4. **Compare with Merge Sort**
   - See dramatic efficiency improvement
   - Learn divide-and-conquer
   - Understand O(n log n) vs O(n²)

5. **Try Searching**
   - See linear vs binary difference
   - Understand importance of sorted data
   - Learn divide-and-conquer application

6. **Explore Data Structures**
   - Understand LIFO vs FIFO
   - See real-world applications
   - Learn tree/graph concepts

## Advanced Concepts Illustrated

### Time Complexity Visualization
Watch number of operations:
- Bubble Sort: grows with n²
- Merge Sort: grows with n log n
- See the difference visually

### Space-Time Tradeoff
- Merge Sort uses extra space for speed
- Bubble Sort uses no extra space
- See practical implications

### Sorting Stability
- Some algorithms maintain relative order
- See how ties are handled
- Understand stability importance

### Comparator Function
- How sorting key affects order
- Custom comparison strategies
- Real-world applications

## Algorithm Selection Guide

**Use Bubble Sort when:**
- Teaching/learning sorting
- Small data sets (< 50 items)
- Nearly sorted data (best case O(n))

**Use Selection Sort when:**
- Minimizing memory writes
- Want O(n) comparisons guaranteed

**Use Insertion Sort when:**
- Small arrays
- Nearly sorted data
- Online sorting (data arriving in stream)

**Use Merge Sort when:**
- Need guaranteed O(n log n)
- Stability is important
- External sorting needed

**Use Linear Search when:**
- Data is unsorted
- Small data sets
- Simplicity is priority

**Use Binary Search when:**
- Data is sorted
- Large data sets
- Speed is critical

## Interactive Learning Tips

1. **Start Slow**: Use 0.5x speed to follow step-by-step
2. **Compare Data**: Use same input for different algorithms
3. **Watch Statistics**: Track how comparisons scale
4. **Pause & Think**: Pause after each step to predict next
5. **Try Random**: Experiment with different input sizes
6. **Read Pseudocode**: Follow code while watching
7. **Check Explanation**: Understand the why, not just the how

## Common Misconceptions Clarified

**"Faster algorithm = always use it"**
- Merge Sort faster than Bubble Sort, but uses more memory
- Small data: Insertion Sort faster than Merge Sort
- Choose based on constraints

**"Algorithm complexity is absolute"**
- O(n²) can be faster than O(n log n) for small n
- Constants matter: 100*n vs n log n
- Real-world testing important

**"In-place sorting always better"**
- Merge Sort sacrifice space for speed and stability
- Bubble Sort in-place but slow
- Tradeoffs essential in algorithm design

## Complexity Summary

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble    | O(n) | O(n²)   | O(n²) | O(1)  | Yes    |
| Selection | O(n²)| O(n²)   | O(n²) | O(1)  | No     |
| Insertion | O(n) | O(n²)   | O(n²) | O(1)  | Yes    |
| Merge     |O(n log n)|O(n log n)|O(n log n)|O(n)|Yes|
| Linear    | O(1) | O(n)    | O(n)  | O(1)  | N/A    |
| Binary    |O(log n)|O(log n)|O(log n)|O(1)|N/A    |
