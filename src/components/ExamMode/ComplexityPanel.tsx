import React from 'react'

interface ComplexityPanelProps {
  algorithm: string
  theme: 'notebook' | 'chalkboard'
}

export const ComplexityPanel: React.FC<ComplexityPanelProps> = ({
  algorithm,
  theme
}) => {
  const panelStyle = theme === 'chalkboard' 
    ? 'bg-[#192734] border-slate-700 text-slate-100' 
    : 'bg-white border-amber-900/10 text-amber-950 font-serif'

  const notesStyles = theme === 'chalkboard'
    ? 'bg-slate-800 text-slate-300'
    : 'bg-yellow-50/60 text-amber-900 border-yellow-200'

  const getAlgoData = () => {
    switch (algorithm) {
      case 'bubble-sort':
        return {
          best: 'O(n) - Optimized with flag',
          worst: 'O(n²)',
          avg: 'O(n²)',
          space: 'O(1)',
          notes: 'Bubble Sort is stable and in-place. In exams, always state that the algorithm repeatedly swaps adjacent out-of-order elements until sorted.'
        }
      case 'selection-sort':
        return {
          best: 'O(n²)',
          worst: 'O(n²)',
          avg: 'O(n²)',
          space: 'O(1)',
          notes: 'Selection Sort makes minimum swaps: exactly O(n) swaps. In exams, highlight that it divides the array into sorted and unsorted segments, and selects the minimum unsorted element.'
        }
      case 'insertion-sort':
        return {
          best: 'O(n) - Already sorted',
          worst: 'O(n²)',
          avg: 'O(n²)',
          space: 'O(1)',
          notes: 'Insertion Sort is highly efficient for small or partially sorted datasets. State in exams that it inserts the current "key" element into its correct relative position in the left sub-array.'
        }
      case 'linear-search':
        return {
          best: 'O(1)',
          worst: 'O(n)',
          avg: 'O(n)',
          space: 'O(1)',
          notes: 'Linear search has no requirement of array order. In exams, show the sequential comparison of array[i] with target, iterating from index 0 to n-1.'
        }
      case 'binary-search':
        return {
          best: 'O(1)',
          worst: 'O(log n)',
          avg: 'O(log n)',
          space: 'O(1)',
          notes: 'Binary search MANDATORILY requires sorted array input. In exams, always write down low, high and mid indices at each step and draw the halved arrays.'
        }
      case 'stack':
        return {
          best: 'O(1)',
          worst: 'O(1)',
          avg: 'O(1)',
          space: 'O(n)',
          notes: 'Stack works on Last-In-First-Out (LIFO) principle. Standard operations: Push (insert), Pop (delete), Peek (view top). Check for overflow/underflow conditions in exams.'
        }
      case 'queue':
        return {
          best: 'O(1)',
          worst: 'O(1)',
          avg: 'O(1)',
          space: 'O(n)',
          notes: 'Queue works on First-In-First-Out (FIFO) principle. Standard operations: Enqueue (rear insertion), Dequeue (front deletion). Rear incremented on insertion, front on deletion.'
        }
      default:
        return {
          best: 'O(1)',
          worst: 'O(n)',
          avg: 'O(n)',
          space: 'O(1)',
          notes: 'Generic complexities.'
        }
    }
  }

  const { best, worst, avg, space, notes } = getAlgoData()

  return (
    <div className={`p-4 rounded-xl border shadow-sm ${panelStyle}`}>
      <h3 className="text-md font-bold font-serif mb-3 border-b pb-1.5 border-amber-950/10">
        2. Exam Notes & Complexity
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
        <div className="p-2 border rounded bg-amber-50/5">
          <span className="text-gray-400 block text-[10px]">Best Case</span>
          <span className="font-bold text-emerald-600">{best}</span>
        </div>
        <div className="p-2 border rounded bg-amber-50/5">
          <span className="text-gray-400 block text-[10px]">Worst Case</span>
          <span className="font-bold text-rose-500">{worst}</span>
        </div>
        <div className="p-2 border rounded bg-amber-50/5">
          <span className="text-gray-400 block text-[10px]">Average Case</span>
          <span className="font-bold text-amber-600">{avg}</span>
        </div>
        <div className="p-2 border rounded bg-amber-50/5">
          <span className="text-gray-400 block text-[10px]">Auxiliary Space</span>
          <span className="font-bold text-purple-600">{space}</span>
        </div>
      </div>

      <div className={`p-3 rounded-lg border text-sm font-serif ${notesStyles}`}>
        <h4 className="font-bold mb-1 text-xs uppercase tracking-wider text-amber-800">Exam Grading Tip:</h4>
        <p className="italic leading-relaxed">{notes}</p>
      </div>
    </div>
  )
}
