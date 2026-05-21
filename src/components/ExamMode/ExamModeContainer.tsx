import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Printer, Moon, Sun, Table, Play, Pause, ChevronRight, ChevronLeft, RotateCcw, AlertCircle } from 'lucide-react'
import { AlgorithmBoard } from './AlgorithmBoard'
import { ExamTable } from './ExamTable'
import { ComplexityPanel } from './ComplexityPanel'
import { PseudocodePanel } from './PseudocodePanel'
import { MergeSortExamTree, generateMergeSortExamSteps } from './MergeSortExamTree'

export type ExamAlgoType = 'bubble-sort' | 'selection-sort' | 'insertion-sort' | 'merge-sort' | 'linear-search' | 'binary-search' | 'stack' | 'queue'

export interface ExamPassStep {
  label: string
  arrayState: number[]
  comparison?: string
  action?: string
  explanation: string
  indices?: number[] // highlighted indices
  pointers?: { low?: number; mid?: number; high?: number; front?: number; rear?: number; top?: number }
  treeNodes?: any[]
}

export interface ExamPass {
  passNumber: number
  steps: ExamPassStep[]
}

export const ExamModeContainer: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<ExamAlgoType>('bubble-sort')
  const [inputArrayStr, setInputArrayStr] = useState<string>('5, 3, 8, 1, 2')
  const [searchTarget, setSearchTarget] = useState<number>(8)
  const [theme, setTheme] = useState<'notebook' | 'chalkboard'>('notebook')
  const [activeTab, setActiveTab] = useState<'visual' | 'table'>('visual')
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showExamFormat, setShowExamFormat] = useState<boolean>(true)
  const [playIntervalId, setPlayIntervalId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'single' | 'all'>('all')

  const parsedArray = useMemo(() => {
    return inputArrayStr
      .split(',')
      .map(v => parseInt(v.trim()))
      .filter(v => !isNaN(v))
  }, [inputArrayStr])

  // Tracing calculations
  const traceData = useMemo(() => {
    const data = [...parsedArray]
    const passes: ExamPass[] = []
    
    if (selectedAlgo === 'bubble-sort') {
      const n = data.length
      let stepCounter = 0
      for (let i = 0; i < n; i++) {
        const passSteps: ExamPassStep[] = []
        let swapped = false
        
        // Pass start step
        passSteps.push({
          label: `Pass ${i + 1} - Start`,
          arrayState: [...data],
          explanation: `Starting Pass ${i + 1}. We will compare adjacent elements from index 0 to ${n - i - 2}.`
        })

        for (let j = 0; j < n - i - 1; j++) {
          const compExplanation = `Compare index ${j} (${data[j]}) and index ${j + 1} (${data[j + 1]})`
          const willSwap = data[j] > data[j + 1]
          
          if (willSwap) {
            const temp = data[j]
            data[j] = data[j + 1]
            data[j + 1] = temp
            swapped = true
            
            passSteps.push({
              label: `Pass ${i + 1} - Step ${j + 1}`,
              arrayState: [...data],
              comparison: `${temp} > ${data[j]}`,
              action: `Swap ${temp} and ${data[j]}`,
              explanation: `${temp} is greater than ${data[j]}, so they swap positions.`,
              indices: [j, j + 1]
            })
          } else {
            passSteps.push({
              label: `Pass ${i + 1} - Step ${j + 1}`,
              arrayState: [...data],
              comparison: `${data[j]} <= ${data[j + 1]}`,
              action: 'No Swap',
              explanation: `${data[j]} is less than or equal to ${data[j + 1]}, no swap needed.`,
              indices: [j, j + 1]
            })
          }
        }
        
        passes.push({
          passNumber: i + 1,
          steps: passSteps
        })
      }
    } else if (selectedAlgo === 'selection-sort') {
      const n = data.length
      for (let i = 0; i < n; i++) {
        const passSteps: ExamPassStep[] = []
        let minIdx = i
        
        passSteps.push({
          label: `Pass ${i + 1} - Initial`,
          arrayState: [...data],
          explanation: `Set initial minimum at index ${i} (value: ${data[i]}). We will scan the rest of the array.`,
          indices: [i]
        })

        for (let j = i + 1; j < n; j++) {
          const isNewMin = data[j] < data[minIdx]
          const oldMin = minIdx
          if (isNewMin) {
            minIdx = j
          }
          passSteps.push({
            label: `Pass ${i + 1} - Compare`,
            arrayState: [...data],
            comparison: `Compare A[${j}] (${data[j]}) < A[${minIdx}] (${data[minIdx]})`,
            action: isNewMin ? `New Min = ${data[j]}` : 'Keep Min',
            explanation: isNewMin 
              ? `Found new smaller element ${data[j]} at index ${j}. Update minimum tracker.`
              : `Element ${data[j]} is larger than current minimum ${data[oldMin]}, minimum remains unchanged.`,
            indices: [j, minIdx]
          })
        }

        if (minIdx !== i) {
          const temp = data[i]
          data[i] = data[minIdx]
          data[minIdx] = temp
          passSteps.push({
            label: `Pass ${i + 1} - Swap`,
            arrayState: [...data],
            explanation: `End of Pass ${i + 1}. Swap starting index ${i} (${temp}) with minimum index ${minIdx} (${data[i]}).`,
            indices: [i, minIdx]
          })
        } else {
          passSteps.push({
            label: `Pass ${i + 1} - No Swap`,
            arrayState: [...data],
            explanation: `End of Pass ${i + 1}. Starting element at index ${i} is already the minimum. No swap needed.`
          })
        }

        passes.push({
          passNumber: i + 1,
          steps: passSteps
        })
      }
    } else if (selectedAlgo === 'insertion-sort') {
      const n = data.length
      for (let i = 1; i < n; i++) {
        const passSteps: ExamPassStep[] = []
        const key = data[i]
        let j = i - 1
        
        passSteps.push({
          label: `Pass ${i} - Pick Key`,
          arrayState: [...data],
          explanation: `Pick key element ${key} at index ${i}. We will find its correct position in sorted sub-array [0...${i-1}].`,
          indices: [i]
        })

        while (j >= 0 && data[j] > key) {
          data[j + 1] = data[j]
          passSteps.push({
            label: `Pass ${i} - Shift`,
            arrayState: [...data],
            comparison: `${data[j]} > ${key}`,
            action: `Shift ${data[j]} right`,
            explanation: `${data[j]} is greater than key ${key}. Shift ${data[j]} to the right.`,
            indices: [j, j + 1]
          })
          j--
        }
        
        data[j + 1] = key
        passSteps.push({
          label: `Pass ${i} - Insert`,
          arrayState: [...data],
          explanation: `Insert key ${key} into position index ${j + 1}.`,
          indices: [j + 1]
        })

        passes.push({
          passNumber: i,
          steps: passSteps
        })
      }
    } else if (selectedAlgo === 'merge-sort') {
      const msPasses = generateMergeSortExamSteps(data)
      passes.push(...msPasses)
    } else if (selectedAlgo === 'linear-search') {
      const passSteps: ExamPassStep[] = []
      let found = false
      
      for (let i = 0; i < data.length; i++) {
        const isMatch = data[i] === searchTarget
        if (isMatch) {
          found = true
        }
        
        passSteps.push({
          label: `Step ${i + 1}`,
          arrayState: [...data],
          comparison: `A[${i}] (${data[i]}) === Target (${searchTarget})`,
          action: isMatch ? 'Found!' : 'Compare',
          explanation: isMatch 
            ? `Target ${searchTarget} matches element at index ${i}. Search terminates successfully!`
            : `Target ${searchTarget} does not match ${data[i]} at index ${i}. Continue searching.`,
          indices: [i]
        })
        
        if (isMatch) break
      }
      
      if (!found) {
        passSteps.push({
          label: 'Final Step',
          arrayState: [...data],
          explanation: `Scanned entire array. Target ${searchTarget} was not found. Return -1.`
        })
      }

      passes.push({ passNumber: 1, steps: passSteps })
    } else if (selectedAlgo === 'binary-search') {
      // Sort first since binary search requires sorted input
      const sortedData = [...data].sort((a, b) => a - b)
      const passSteps: ExamPassStep[] = []
      let low = 0
      let high = sortedData.length - 1
      let found = false
      let step = 1
      
      passSteps.push({
        label: 'Initialize',
        arrayState: [...sortedData],
        explanation: `Binary search requires a sorted array. Sorted array: [${sortedData.join(', ')}]. Initialize low = 0, high = ${high}.`,
        pointers: { low, high }
      })

      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const midVal = sortedData[mid]
        
        if (midVal === searchTarget) {
          found = true
          passSteps.push({
            label: `Step ${step++}`,
            arrayState: [...sortedData],
            comparison: `A[mid] (${midVal}) === Target (${searchTarget})`,
            action: 'Found!',
            explanation: `Target ${searchTarget} found at index ${mid}. Search successful!`,
            indices: [mid],
            pointers: { low, mid, high }
          })
          break
        } else if (midVal < searchTarget) {
          const oldLow = low
          low = mid + 1
          passSteps.push({
            label: `Step ${step++}`,
            arrayState: [...sortedData],
            comparison: `A[mid] (${midVal}) < Target (${searchTarget})`,
            action: 'Search Right',
            explanation: `${midVal} is less than ${searchTarget}. Ignore left half. Set low = mid + 1 (${low}).`,
            indices: [mid],
            pointers: { low: oldLow, mid, high }
          })
        } else {
          const oldHigh = high
          high = mid - 1
          passSteps.push({
            label: `Step ${step++}`,
            arrayState: [...sortedData],
            comparison: `A[mid] (${midVal}) > Target (${searchTarget})`,
            action: 'Search Left',
            explanation: `${midVal} is greater than ${searchTarget}. Ignore right half. Set high = mid - 1 (${high}).`,
            indices: [mid],
            pointers: { low, mid, high: oldHigh }
          })
        }
      }

      if (!found) {
        passSteps.push({
          label: 'Final Step',
          arrayState: [...sortedData],
          explanation: `low (${low}) is greater than high (${high}). Search range is exhausted. Target ${searchTarget} not found.`,
          pointers: { low, high }
        })
      }

      passes.push({ passNumber: 1, steps: passSteps })
    } else if (selectedAlgo === 'stack') {
      // Simulating standard stack tracing
      const stackHistory: number[] = []
      const passSteps: ExamPassStep[] = []
      
      const ops = [
        { type: 'push', val: 5 },
        { type: 'push', val: 12 },
        { type: 'pop' },
        { type: 'push', val: 8 },
        { type: 'push', val: 24 },
        { type: 'pop' }
      ]

      ops.forEach((op, idx) => {
        if (op.type === 'push') {
          stackHistory.push(op.val!)
          passSteps.push({
            label: `Step ${idx + 1} - Push`,
            arrayState: [...stackHistory],
            action: `Push ${op.val}`,
            explanation: `Pushing ${op.val} onto stack. Increment top pointer and write value.`,
            pointers: { top: stackHistory.length - 1 }
          })
        } else {
          const popped = stackHistory.pop()
          passSteps.push({
            label: `Step ${idx + 1} - Pop`,
            arrayState: [...stackHistory],
            action: `Pop`,
            explanation: `Popped ${popped} from the stack. Decrement top pointer.`,
            pointers: { top: stackHistory.length - 1 }
          })
        }
      })

      passes.push({ passNumber: 1, steps: passSteps })
    } else if (selectedAlgo === 'queue') {
      const queueHistory: number[] = []
      const passSteps: ExamPassStep[] = []
      
      const ops = [
        { type: 'enqueue', val: 3 },
        { type: 'enqueue', val: 8 },
        { type: 'enqueue', val: 15 },
        { type: 'dequeue' },
        { type: 'enqueue', val: 22 },
        { type: 'dequeue' }
      ]

      let front = 0
      let rear = -1

      ops.forEach((op, idx) => {
        if (op.type === 'enqueue') {
          queueHistory.push(op.val!)
          rear++
          passSteps.push({
            label: `Step ${idx + 1} - Enqueue`,
            arrayState: queueHistory.slice(front),
            action: `Enqueue ${op.val}`,
            explanation: `Enqueue ${op.val} at rear index. Increment rear to ${rear}.`,
            pointers: { front, rear }
          })
        } else {
          const dequeued = queueHistory[front]
          front++
          passSteps.push({
            label: `Step ${idx + 1} - Dequeue`,
            arrayState: queueHistory.slice(front),
            action: `Dequeue`,
            explanation: `Dequeued front element ${dequeued}. Increment front to ${front}.`,
            pointers: { front, rear }
          })
        }
      })

      passes.push({ passNumber: 1, steps: passSteps })
    }

    // Flatten all steps for linear navigation
    const allSteps: ExamPassStep[] = []
    passes.forEach(pass => {
      pass.steps.forEach(step => {
        allSteps.push(step)
      })
    })

    return { passes, allSteps }
  }, [selectedAlgo, parsedArray, searchTarget])

  const totalSteps = traceData.allSteps.length
  const currentStep = traceData.allSteps[currentStepIndex] || null

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      handlePause()
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStepIndex(0)
    handlePause()
  }

  const handlePlay = () => {
    if (isPlaying) return
    setIsPlaying(true)
    const id = window.setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < totalSteps - 1) {
          return prev + 1
        } else {
          clearInterval(id)
          setIsPlaying(false)
          return prev
        }
      })
    }, 2000)
    setPlayIntervalId(id)
  }

  const handlePause = () => {
    if (playIntervalId !== null) {
      clearInterval(playIntervalId)
      setPlayIntervalId(null)
    }
    setIsPlaying(false)
  }

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 3) + 5 // 5 to 7 elements
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 15) + 1)
    setInputArrayStr(arr.join(', '))
    setCurrentStepIndex(0)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 p-4 pb-12 ${
      theme === 'chalkboard' 
        ? 'bg-[#15202b] text-slate-100' 
        : 'bg-[#faf6eb] text-amber-950 font-sans'
    }`}>
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-b pb-4 mb-6 border-amber-950/15">
        <div className="flex items-center gap-3">
          <Link 
            to="/app" 
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors border ${
              theme === 'chalkboard' 
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' 
                : 'bg-amber-100/60 border-amber-900/10 hover:bg-amber-100 text-amber-900'
            }`}
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="text-amber-600" size={24} />
            <h1 className="text-2xl font-bold tracking-tight font-serif">Exam Mode Visualizer</h1>
          </div>
        </div>
        
        {/* Top Controls */}
        <div className="flex items-center gap-2 mt-4 md:mt-0 print:hidden">
          <button
            onClick={() => setTheme(theme === 'notebook' ? 'chalkboard' : 'notebook')}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'chalkboard' 
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-yellow-400' 
                : 'bg-white border-amber-900/10 hover:bg-amber-50 text-amber-900'
            }`}
            title="Toggle Calkboard mode"
          >
            {theme === 'chalkboard' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            onClick={handlePrint}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-sm ${
              theme === 'chalkboard' 
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' 
                : 'bg-white border-amber-900/10 hover:bg-amber-50 text-amber-900'
            }`}
          >
            <Printer size={18} />
            <span>Print Answer Sheet</span>
          </button>
          
          <button
            onClick={() => setShowExamFormat(!showExamFormat)}
            className={`p-2 px-3 rounded-lg border transition-colors text-sm font-medium ${
              showExamFormat
                ? 'bg-amber-600 text-white border-transparent hover:bg-amber-700'
                : theme === 'chalkboard'
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-white border-amber-900/10 text-amber-900 hover:bg-amber-50'
            }`}
          >
            Exam Format
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          {/* Input Panel */}
          <div className={`p-4 rounded-xl border shadow-sm ${
            theme === 'chalkboard' ? 'bg-[#192734] border-slate-700' : 'bg-white border-amber-900/10'
          }`}>
            <h3 className="text-md font-bold font-serif mb-3 flex items-center gap-1.5">
              <span>1. Select & Input Data</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Algorithm</label>
                <select
                  value={selectedAlgo}
                  onChange={(e) => {
                    setSelectedAlgo(e.target.value as ExamAlgoType)
                    setCurrentStepIndex(0)
                  }}
                  className={`w-full p-2.5 rounded-lg border text-sm focus:ring-1 ${
                    theme === 'chalkboard' 
                      ? 'bg-slate-800 border-slate-700 text-slate-100 focus:ring-slate-500' 
                      : 'bg-amber-50/50 border-amber-900/20 text-amber-950 focus:ring-amber-500'
                  }`}
                >
                  <optgroup label="Sorting">
                    <option value="bubble-sort">Bubble Sort (Pass-by-Pass)</option>
                    <option value="selection-sort">Selection Sort (Pointers)</option>
                    <option value="insertion-sort">Insertion Sort (Shifting)</option>
                    <option value="merge-sort">Merge Sort (Recursive Tree)</option>
                  </optgroup>
                  <optgroup label="Searching">
                    <option value="linear-search">Linear Search (Iteration)</option>
                    <option value="binary-search">Binary Search (Pointers)</option>
                  </optgroup>
                  <optgroup label="Data Structures">
                    <option value="stack">Stack Dry-Run Tracing</option>
                    <option value="queue">Queue Dry-Run Tracing</option>
                  </optgroup>
                </select>
              </div>

              {selectedAlgo !== 'stack' && selectedAlgo !== 'queue' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Array Elements</label>
                    <button 
                      onClick={generateRandomArray}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Generate Random
                    </button>
                  </div>
                  <input
                    type="text"
                    value={inputArrayStr}
                    onChange={(e) => {
                      setInputArrayStr(e.target.value)
                      setCurrentStepIndex(0)
                    }}
                    placeholder="e.g. 5, 3, 8, 1, 2"
                    className={`w-full p-2.5 rounded-lg border text-sm focus:ring-1 ${
                      theme === 'chalkboard' 
                        ? 'bg-slate-800 border-slate-700 text-slate-100 focus:ring-slate-500' 
                        : 'bg-amber-50/50 border-amber-900/20 text-amber-950 focus:ring-amber-500'
                    }`}
                  />
                </div>
              )}

              {(selectedAlgo === 'linear-search' || selectedAlgo === 'binary-search') && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Search Target</label>
                  <input
                    type="number"
                    value={searchTarget}
                    onChange={(e) => {
                      setSearchTarget(parseInt(e.target.value) || 0)
                      setCurrentStepIndex(0)
                    }}
                    className={`w-full p-2.5 rounded-lg border text-sm focus:ring-1 ${
                      theme === 'chalkboard' 
                        ? 'bg-slate-800 border-slate-700 text-slate-100 focus:ring-slate-500' 
                        : 'bg-amber-50/50 border-amber-900/20 text-amber-950 focus:ring-amber-500'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Complexity Card */}
          <ComplexityPanel algorithm={selectedAlgo} theme={theme} />
          
          {/* Pseudocode Panel */}
          <PseudocodePanel algorithm={selectedAlgo} currentStep={currentStep} theme={theme} />
        </div>

        {/* Workspace Display Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Notebook Workspace Box */}
          <div className={`rounded-2xl border shadow-md relative overflow-hidden ${
            theme === 'chalkboard' 
              ? 'bg-[#192734] border-slate-700' 
              : 'bg-white border-amber-900/10'
          }`}>
            {/* Ruled Paper Header Accents */}
            {theme === 'notebook' && (
              <div className="h-6 bg-gradient-to-r from-red-200/30 via-amber-100/10 to-red-200/30 border-b border-red-200/40 relative flex items-center justify-between px-6">
                <span className="text-[10px] uppercase tracking-widest text-red-400 font-sans font-bold">Answer Sheet Page #1</span>
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-300"></span>
                  <span className="h-2 w-2 rounded-full bg-red-300"></span>
                </div>
              </div>
            )}

            {/* Tab controls */}
            <div className={`flex items-center justify-between border-b px-6 py-2.5 ${
              theme === 'chalkboard' ? 'border-slate-700 bg-slate-800/40' : 'border-amber-900/10 bg-amber-50/20'
            }`}>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('visual')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'visual'
                      ? theme === 'chalkboard'
                        ? 'bg-slate-700 text-white'
                        : 'bg-amber-100 text-amber-950 border border-amber-900/15'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Whiteboard Trace
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    activeTab === 'table'
                      ? theme === 'chalkboard'
                        ? 'bg-slate-700 text-white'
                        : 'bg-amber-100 text-amber-950 border border-amber-900/15'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Table size={15} />
                  Exam Tracing Table
                </button>
              </div>

              {/* ViewMode toggle controls */}
              {activeTab === 'visual' && (
                <div className="flex gap-1 border border-current border-opacity-10 p-0.5 rounded-lg bg-amber-50/5 print:hidden">
                  <button
                    onClick={() => setViewMode('all')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      viewMode === 'all'
                        ? 'bg-amber-600 text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Show All Steps
                  </button>
                  <button
                    onClick={() => setViewMode('single')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      viewMode === 'single'
                        ? 'bg-amber-600 text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Step-by-Step Player
                  </button>
                </div>
              )}

              {/* Progress Count */}
              <div className="text-xs text-gray-400 font-serif">
                Step {currentStepIndex + 1} of {totalSteps}
              </div>
            </div>

            <div className="p-6 max-h-[72vh] overflow-y-auto">
              {selectedAlgo === 'merge-sort' ? (
                <MergeSortExamTree treeNodes={currentStep?.treeNodes || []} examMode={showExamFormat} />
              ) : activeTab === 'visual' ? (
                <AlgorithmBoard 
                  algorithm={selectedAlgo} 
                  currentStep={currentStep} 
                  theme={theme}
                  showExamFormat={showExamFormat}
                  allSteps={traceData.allSteps}
                  viewMode={viewMode}
                  currentStepIndex={currentStepIndex}
                />
              ) : (
                <ExamTable 
                  algorithm={selectedAlgo} 
                  passes={traceData.passes} 
                  theme={theme}
                />
              )}
            </div>

            {/* Step navigation controls */}
            <div className={`flex items-center justify-between px-6 py-4 border-t print:hidden ${
              theme === 'chalkboard' ? 'border-slate-700 bg-slate-800/20' : 'border-amber-900/10 bg-amber-50/10'
            }`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestart}
                  className={`p-2 rounded-lg border transition-colors ${
                    theme === 'chalkboard' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-amber-900/15 hover:bg-amber-50'
                  }`}
                  title="Restart Trace"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Play / Pause / Prev / Next */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className={`p-2.5 rounded-lg border transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                    theme === 'chalkboard' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-amber-900/15 hover:bg-amber-50'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>

                {isPlaying ? (
                  <button
                    onClick={handlePause}
                    className={`p-2.5 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center gap-1.5 text-sm`}
                  >
                    <Pause size={16} />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePlay}
                    className={`p-2.5 px-4 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors flex items-center gap-1.5 text-sm`}
                  >
                    <Play size={16} />
                    <span>Auto Play</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === totalSteps - 1}
                  className={`p-2.5 rounded-lg border transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                    theme === 'chalkboard' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-amber-900/15 hover:bg-amber-50'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          {currentStep && (
            <div className={`p-5 rounded-xl border flex gap-3 shadow-sm ${
              theme === 'chalkboard' 
                ? 'bg-slate-800/40 border-slate-700' 
                : 'bg-amber-50/60 border-amber-900/10'
            }`}>
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">Professor's Chalkboard Explanation</h4>
                <p className="text-sm font-serif leading-relaxed">
                  {currentStep.explanation}
                </p>
                {currentStep.comparison && (
                  <div className="mt-2 text-xs flex gap-2 font-mono bg-black/5 p-2 rounded w-fit">
                    <span className="text-gray-400">Comparing:</span>
                    <span className="font-bold text-amber-700">{currentStep.comparison}</span>
                    {currentStep.action && (
                      <>
                        <span className="text-gray-400">| Action:</span>
                        <span className="font-bold text-emerald-600">{currentStep.action}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
