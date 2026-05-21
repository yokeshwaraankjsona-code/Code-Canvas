import React from 'react'
import { ExamPassStep } from './ExamModeContainer'

interface PseudocodePanelProps {
  algorithm: string
  currentStep: ExamPassStep | null
  theme: 'notebook' | 'chalkboard'
}

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({
  algorithm,
  currentStep,
  theme
}) => {
  const panelStyle = theme === 'chalkboard' 
    ? 'bg-[#192734] border-slate-700 text-slate-100' 
    : 'bg-white border-amber-900/10 text-amber-950 font-serif'

  const getCode = () => {
    switch (algorithm) {
      case 'bubble-sort':
        return [
          'procedure bubbleSort(A : list of sortable items)',
          '    n := length(A)',
          '    for i := 0 to n-1 inclusive do',
          '        for j := 0 to n-i-2 inclusive do',
          '            if A[j] > A[j+1] then',
          '                swap(A[j], A[j+1])',
          '            end if',
          '        end for',
          '    end for',
          'end procedure'
        ]
      case 'selection-sort':
        return [
          'procedure selectionSort(A : list of sortable items)',
          '    n := length(A)',
          '    for i := 0 to n-1 do',
          '        min_idx := i',
          '        for j := i+1 to n-1 do',
          '            if A[j] < A[min_idx] then',
          '                min_idx := j',
          '            end if',
          '        end for',
          '        swap(A[i], A[min_idx])',
          '    end for',
          'end procedure'
        ]
      case 'insertion-sort':
        return [
          'procedure insertionSort(A : list of sortable items)',
          '    for i := 1 to length(A)-1 do',
          '        key := A[i]',
          '        j := i - 1',
          '        while j >= 0 and A[j] > key do',
          '            A[j+1] := A[j]',
          '            j := j - 1',
          '        end while',
          '        A[j+1] := key',
          '    end for',
          'end procedure'
        ]
      case 'linear-search':
        return [
          'procedure linearSearch(A : list, target : element)',
          '    for index i := 0 to length(A)-1 do',
          '        if A[i] == target then',
          '            return i // Found!',
          '        end if',
          '    end for',
          '    return -1 // Not Found',
          'end procedure'
        ]
      case 'binary-search':
        return [
          'procedure binarySearch(A : sorted list, target : element)',
          '    low := 0, high := length(A) - 1',
          '    while low <= high do',
          '        mid := floor((low + high) / 2)',
          '        if A[mid] == target then',
          '            return mid',
          '        else if A[mid] < target then',
          '            low := mid + 1',
          '        else',
          '            high := mid - 1',
          '        end if',
          '    end while',
          '    return -1',
          'end procedure'
        ]
      case 'stack':
        return [
          'procedure push(stack, value):',
          '    if top == MAX - 1 then',
          '        return "Overflow"',
          '    top := top + 1',
          '    stack[top] := value',
          'end procedure',
          '',
          'procedure pop(stack):',
          '    if top == -1 then',
          '        return "Underflow"',
          '    val := stack[top]',
          '    top := top - 1',
          '    return val',
          'end procedure'
        ]
      case 'queue':
        return [
          'procedure enqueue(queue, value):',
          '    if rear == MAX - 1 then',
          '        return "Overflow"',
          '    rear := rear + 1',
          '    queue[rear] := value',
          'end procedure',
          '',
          'procedure dequeue(queue):',
          '    if front > rear then',
          '        return "Underflow"',
          '    val := queue[front]',
          '    front := front + 1',
          '    return val',
          'end procedure'
        ]
      default:
        return []
    }
  }

  const lines = getCode()

  // Highlighting line selection helper
  const getHighlightLine = () => {
    if (!currentStep) return -1
    const { action } = currentStep
    
    if (algorithm === 'bubble-sort') {
      if (action?.includes('Swap')) return 5
      if (action?.includes('Compare') || action?.includes('No Swap')) return 4
      return 2
    }
    if (algorithm === 'selection-sort') {
      if (action?.includes('Swap')) return 9
      if (action?.includes('Min')) return 6
      if (action?.includes('Compare')) return 4
      return 2
    }
    if (algorithm === 'insertion-sort') {
      if (action?.includes('Pick')) return 2
      if (action?.includes('Shift')) return 5
      if (action?.includes('Insert')) return 8
      return 1
    }
    if (algorithm === 'linear-search') {
      if (action === 'Found!') return 3
      if (action === 'Compare') return 2
      return 1
    }
    if (algorithm === 'binary-search') {
      if (action === 'Found!') return 4
      if (action === 'Search Right') return 6
      if (action === 'Search Left') return 8
      return 2
    }
    return -1
  }

  const highlightLine = getHighlightLine()

  return (
    <div className={`p-4 rounded-xl border shadow-sm ${panelStyle}`}>
      <h3 className="text-md font-bold font-serif mb-3 border-b pb-1.5 border-amber-950/10">
        3. Textbook Pseudocode
      </h3>
      
      <div className="font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1 bg-black/5 p-3 rounded-lg border max-h-[300px]">
        {lines.map((line, idx) => {
          const isHighlighted = idx === highlightLine
          return (
            <div
              key={`pseudocode-line-${idx}`}
              className={`px-1.5 py-0.5 rounded transition-colors whitespace-pre ${
                isHighlighted
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-gray-400'
              }`}
            >
              <span className="inline-block w-4 text-left select-none text-[9px] opacity-40">{idx + 1}</span>
              {line}
            </div>
          )
        })}
      </div>
    </div>
  )
}
