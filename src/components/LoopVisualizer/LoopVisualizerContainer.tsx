import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Repeat, Play, Info } from 'lucide-react'
import { LoopSidebar, LoopType } from './LoopSidebar'
import { LoopControls } from './LoopControls'
import { LoopCanvas } from './LoopCanvas'
import { LoopStats } from './LoopStats'
import { PseudocodePanel } from './PseudocodePanel'
import { LoopCodeVisualizerContainer } from '../LoopCodeVisualizer/LoopCodeVisualizerContainer'

interface InnerIteration {
  j: number
  status: 'active' | 'completed' | 'pending'
}

interface IterationState {
  i: number
  val: any
  status: 'active' | 'completed' | 'pending'
  innerIterations?: InnerIteration[]
  explanation?: string
}

interface LoopExecutionStep {
  activeLine: number
  variables: { i: number; j: number; val: any; limit: number; innerLimit: number; step: number }
  conditionResult: boolean | string
  currentIterationIdx: number
  explanation: string
  iterationsState: IterationState[]
  log: string
}

export const LoopVisualizerContainer: React.FC = () => {
  // Tabs: presets vs custom code simulator
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets')

  // Config parameters
  const [selectedLoop, setSelectedLoop] = useState<LoopType>('for')
  const [initVal, setInitVal] = useState<number>(0)
  const [limitVal, setLimitVal] = useState<number>(5)
  const [stepVal, setStepVal] = useState<number>(1)
  const [arrayInput, setArrayInput] = useState<string>('10, 20, 30, 40')
  const [innerLimitVal, setInnerLimitVal] = useState<number>(3)

  // Player state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(800)
  const playIntervalRef = useRef<number | null>(null)

  // Parse Array Values
  const parsedArray = useMemo(() => {
    return arrayInput
      .split(',')
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => {
        const num = parseInt(v)
        return isNaN(num) ? v : num
      })
  }, [arrayInput])

  // safe step frames pre-compiler
  const executionFrames = useMemo(() => {
    const steps: LoopExecutionStep[] = []
    
    const baseVars = { i: initVal, j: 0, val: 0, limit: limitVal, innerLimit: innerLimitVal, step: stepVal }

    if (selectedLoop === 'for') {
      let i = initVal
      let iterations: IterationState[] = []
      let stepCounter = 0

      // Step 1: Init i
      steps.push({
        activeLine: 1,
        variables: { ...baseVars, i },
        conditionResult: 'checking...',
        currentIterationIdx: -1,
        explanation: `Initializing loop counter variable: i = ${i}.`,
        iterationsState: [],
        log: `Loop initialized with i = ${i}`
      })

      while (i < limitVal && stepCounter < 20) {
        stepCounter++
        // Step 2: Condition check (true)
        steps.push({
          activeLine: 1,
          variables: { ...baseVars, i },
          conditionResult: true,
          currentIterationIdx: iterations.length,
          explanation: `Evaluating condition: is i (${i}) < ${limitVal}? Yes (true). Entering loop body.`,
          iterationsState: [...iterations],
          log: `Condition check: ${i} < ${limitVal} is true`
        })

        // Step 3: Body execution
        const activeIdx = iterations.length
        iterations.push({
          i: activeIdx,
          val: i,
          status: 'active',
          explanation: `Executing iteration block index ${activeIdx} for value i = ${i}.`
        })

        steps.push({
          activeLine: 2,
          variables: { ...baseVars, i },
          conditionResult: true,
          currentIterationIdx: activeIdx,
          explanation: `Inside loop body: printing output for index i = ${i}.`,
          iterationsState: [...iterations],
          log: `Outputted value i = ${i} in body`
        })

        // Step 4: Increment i
        const oldI = i
        i += stepVal
        iterations = iterations.map((it, idx) => 
          idx === activeIdx ? { ...it, status: 'completed' } : it
        )

        steps.push({
          activeLine: 1,
          variables: { ...baseVars, i },
          conditionResult: 'updating...',
          currentIterationIdx: activeIdx,
          explanation: `Updating loop counter: i increments from ${oldI} by ${stepVal} to ${i}.`,
          iterationsState: [...iterations],
          log: `Incremented loop counter i = ${i}`
        })
      }

      // Final condition check (false)
      steps.push({
        activeLine: 1,
        variables: { ...baseVars, i },
        conditionResult: false,
        currentIterationIdx: -1,
        explanation: `Evaluating loop condition: is i (${i}) < ${limitVal}? No (false). Loop terminates!`,
        iterationsState: [...iterations],
        log: `Loop terminated. Condition ${i} < ${limitVal} evaluated to false`
      })
    } 
    
    else if (selectedLoop === 'while') {
      let i = initVal
      let iterations: IterationState[] = []
      let stepCounter = 0

      // Step 1: Init i
      steps.push({
        activeLine: 1,
        variables: { ...baseVars, i },
        conditionResult: 'checking...',
        currentIterationIdx: -1,
        explanation: `Initializing loop counter variable: i = ${i}.`,
        iterationsState: [],
        log: `Loop initialized with i = ${i}`
      })

      while (i < limitVal && stepCounter < 20) {
        stepCounter++
        
        // Step 2: Condition check
        steps.push({
          activeLine: 2,
          variables: { ...baseVars, i },
          conditionResult: true,
          currentIterationIdx: iterations.length,
          explanation: `Validating condition: is i (${i}) < ${limitVal}? Yes. Entering while block.`,
          iterationsState: [...iterations],
          log: `Condition check: ${i} < ${limitVal} is true`
        })

        // Step 3: Body print
        const activeIdx = iterations.length
        iterations.push({
          i: activeIdx,
          val: i,
          status: 'active',
          explanation: `Executing iteration block index ${activeIdx} for value i = ${i}.`
        })

        steps.push({
          activeLine: 3,
          variables: { ...baseVars, i },
          conditionResult: true,
          currentIterationIdx: activeIdx,
          explanation: `Inside loop body: printing output for index i = ${i}.`,
          iterationsState: [...iterations],
          log: `Outputted value i = ${i} in body`
        })

        // Step 4: Increment i inside body
        const oldI = i
        i += stepVal
        iterations = iterations.map((it, idx) => 
          idx === activeIdx ? { ...it, status: 'completed' } : it
        )

        steps.push({
          activeLine: 4,
          variables: { ...baseVars, i },
          conditionResult: 'updating...',
          currentIterationIdx: activeIdx,
          explanation: `Incrementing loop counter i inside while block from ${oldI} to ${i}.`,
          iterationsState: [...iterations],
          log: `Incremented loop counter i = ${i}`
        })
      }

      // Final condition check (false)
      steps.push({
        activeLine: 2,
        variables: { ...baseVars, i },
        conditionResult: false,
        currentIterationIdx: -1,
        explanation: `Validating condition: is i (${i}) < ${limitVal}? No (false). Exit while loop.`,
        iterationsState: [...iterations],
        log: `Loop terminated. Condition ${i} < ${limitVal} evaluated to false`
      })
    } 
    
    else if (selectedLoop === 'do-while') {
      let i = initVal
      let iterations: IterationState[] = []
      let stepCounter = 0

      // Step 1: Init i
      steps.push({
        activeLine: 1,
        variables: { ...baseVars, i },
        conditionResult: 'running...',
        currentIterationIdx: -1,
        explanation: `Initializing loop counter variable: i = ${i}.`,
        iterationsState: [],
        log: `Loop initialized with i = ${i}`
      })

      do {
        stepCounter++
        
        // Step 2: Body print
        const activeIdx = iterations.length
        iterations.push({
          i: activeIdx,
          val: i,
          status: 'active',
          explanation: `Executing iteration block index ${activeIdx} for value i = ${i}.`
        })

        steps.push({
          activeLine: 3,
          variables: { ...baseVars, i },
          conditionResult: 'running...',
          currentIterationIdx: activeIdx,
          explanation: `Entering do block body: outputting value i = ${i}.`,
          iterationsState: [...iterations],
          log: `Outputted value i = ${i} in body`
        })

        // Step 3: Increment inside body
        const oldI = i
        i += stepVal
        iterations = iterations.map((it, idx) => 
          idx === activeIdx ? { ...it, status: 'completed' } : it
        )

        steps.push({
          activeLine: 4,
          variables: { ...baseVars, i },
          conditionResult: 'updating...',
          currentIterationIdx: activeIdx,
          explanation: `Updating counter i inside do block: ${oldI} -> ${i}.`,
          iterationsState: [...iterations],
          log: `Incremented loop counter i = ${i}`
        })

        // Step 4: Condition check
        const isTrue = i < limitVal
        steps.push({
          activeLine: 5,
          variables: { ...baseVars, i },
          conditionResult: isTrue,
          currentIterationIdx: activeIdx,
          explanation: `Evaluating while condition: is i (${i}) < ${limitVal}? ${isTrue ? 'Yes (loop again)' : 'No (loop exits)'}.`,
          iterationsState: [...iterations],
          log: `Condition check at bottom: ${i} < ${limitVal} is ${isTrue}`
        })

      } while (i < limitVal && stepCounter < 20)
    } 
    
    else if (selectedLoop === 'nested') {
      let i = initVal
      let iterations: IterationState[] = []
      let stepCounter = 0

      // Step 1: Init i
      steps.push({
        activeLine: 1,
        variables: { ...baseVars, i, j: 0 },
        conditionResult: 'checking...',
        currentIterationIdx: -1,
        explanation: `Initializing outer loop counter: i = ${i}.`,
        iterationsState: [],
        log: `Outer loop initialized with i = ${i}`
      })

      while (i < limitVal && stepCounter < 20) {
        stepCounter++
        
        // Outer loop check (true)
        steps.push({
          activeLine: 1,
          variables: { ...baseVars, i, j: 0 },
          conditionResult: true,
          currentIterationIdx: iterations.length,
          explanation: `Evaluating outer loop condition: is i (${i}) < ${limitVal}? Yes.`,
          iterationsState: [...iterations],
          log: `Outer condition: ${i} < ${limitVal} is true`
        })

        // Outer body entry, create inner iterations list
        const activeOuterIdx = iterations.length
        const innerState: InnerIteration[] = Array.from({ length: innerLimitVal }, (_, k) => ({
          j: k,
          status: 'pending'
        }))

        iterations.push({
          i: activeOuterIdx,
          val: i,
          status: 'active',
          innerIterations: innerState,
          explanation: `Entering outer iteration i = ${i}. Preparing inner j loop.`
        })

        steps.push({
          activeLine: 2,
          variables: { ...baseVars, i, j: 0 },
          conditionResult: true,
          currentIterationIdx: activeOuterIdx,
          explanation: `Entering inner loop body: initializing j = 0.`,
          iterationsState: JSON.parse(JSON.stringify(iterations)),
          log: `Inner loop initialized with j = 0`
        })

        // Inner loop running
        for (let j = 0; j < innerLimitVal; j++) {
          // Inner check
          iterations = iterations.map((it, idx) => {
            if (idx === activeOuterIdx && it.innerIterations) {
              const updatedInner = it.innerIterations.map((inner, innerK) => 
                innerK === j ? { ...inner, status: 'active' as const } : inner
              )
              return { ...it, innerIterations: updatedInner }
            }
            return it
          })

          steps.push({
            activeLine: 2,
            variables: { ...baseVars, i, j },
            conditionResult: true,
            currentIterationIdx: activeOuterIdx,
            explanation: `Evaluating inner condition: is j (${j}) < ${innerLimitVal}? Yes.`,
            iterationsState: JSON.parse(JSON.stringify(iterations)),
            log: `Inner condition: ${j} < ${innerLimitVal} is true`
          })

          // Inner print
          steps.push({
            activeLine: 3,
            variables: { ...baseVars, i, j },
            conditionResult: true,
            currentIterationIdx: activeOuterIdx,
            explanation: `Executing inner block body: rendering coordinate (${i}, ${j}).`,
            iterationsState: JSON.parse(JSON.stringify(iterations)),
            log: `Outputted nested coordinate (${i}, ${j})`
          })

          // Inner complete
          iterations = iterations.map((it, idx) => {
            if (idx === activeOuterIdx && it.innerIterations) {
              const updatedInner = it.innerIterations.map((inner, innerK) => 
                innerK === j ? { ...inner, status: 'completed' as const } : inner
              )
              return { ...it, innerIterations: updatedInner }
            }
            return it
          })

          steps.push({
            activeLine: 2,
            variables: { ...baseVars, i, j: j + 1 },
            conditionResult: 'incrementing...',
            currentIterationIdx: activeOuterIdx,
            explanation: `Incrementing inner loop counter j to ${j + 1}.`,
            iterationsState: JSON.parse(JSON.stringify(iterations)),
            log: `Incremented inner counter j = ${j + 1}`
          })
        }

        // Outer increment
        const oldI = i
        i += 1
        iterations = iterations.map((it, idx) => 
          idx === activeOuterIdx ? { ...it, status: 'completed' as const } : it
        )

        steps.push({
          activeLine: 1,
          variables: { ...baseVars, i, j: 0 },
          conditionResult: 'updating...',
          currentIterationIdx: activeOuterIdx,
          explanation: `Outer iteration completes. Incrementing i from ${oldI} to ${i}.`,
          iterationsState: JSON.parse(JSON.stringify(iterations)),
          log: `Incremented outer loop counter i = ${i}`
        })
      }

      // Outer check false
      steps.push({
        activeLine: 1,
        variables: { ...baseVars, i, j: 0 },
        conditionResult: false,
        currentIterationIdx: -1,
        explanation: `Evaluating outer loop condition: is i (${i}) < ${limitVal}? No. Outer loop terminates!`,
        iterationsState: [...iterations],
        log: `Loop terminated. Outer condition ${i} < ${limitVal} is false`
      })
    } 
    
    else if (selectedLoop === 'for-of') {
      let iterations: IterationState[] = []

      // Init
      steps.push({
        activeLine: 1,
        variables: { ...baseVars, val: 'undefined' },
        conditionResult: 'parsing...',
        currentIterationIdx: -1,
        explanation: `Declaring array items: [${parsedArray.join(', ')}]. Preparing value iteration.`,
        iterationsState: [],
        log: `Initialized array to iterate [${parsedArray.join(', ')}]`
      })

      parsedArray.forEach((element, idx) => {
        // Step check
        steps.push({
          activeLine: 2,
          variables: { ...baseVars, val: element },
          conditionResult: true,
          currentIterationIdx: iterations.length,
          explanation: `Extracting element from array index [${idx}]. Value: ${element}. Entering loop body.`,
          iterationsState: [...iterations],
          log: `Array index [${idx}] check: valid element`
        })

        // Body print
        const activeIdx = iterations.length
        iterations.push({
          i: activeIdx,
          val: element,
          status: 'active',
          explanation: `Executing iteration block index ${activeIdx} for value = ${element}.`
        })

        steps.push({
          activeLine: 3,
          variables: { ...baseVars, val: element },
          conditionResult: true,
          currentIterationIdx: activeIdx,
          explanation: `Inside loop body: processing element value: ${element}.`,
          iterationsState: [...iterations],
          log: `Outputted array value: ${element}`
        })

        // Complete step
        iterations = iterations.map((it, iIdx) => 
          iIdx === activeIdx ? { ...it, status: 'completed' } : it
        )
      })

      // Finish check
      steps.push({
        activeLine: 2,
        variables: { ...baseVars, val: 'N/A' },
        conditionResult: false,
        currentIterationIdx: -1,
        explanation: `Scanned all array elements. Value traversal completes successfully.`,
        iterationsState: [...iterations],
        log: `Array traversal complete. Loop exits!`
      })
    } 
    
    else if (selectedLoop === 'forEach') {
      let iterations: IterationState[] = []

      // Init
      steps.push({
        activeLine: 1,
        variables: { ...baseVars, val: 'undefined' },
        conditionResult: 'binding...',
        currentIterationIdx: -1,
        explanation: `Binding forEach callback method onto iterable array [${parsedArray.join(', ')}].`,
        iterationsState: [],
        log: `Functional forEach listener bound`
      })

      parsedArray.forEach((element, idx) => {
        // Callback trigger
        steps.push({
          activeLine: 2,
          variables: { ...baseVars, val: element, i: idx },
          conditionResult: 'invoking callback...',
          currentIterationIdx: iterations.length,
          explanation: `Invoking functional forEach callback index [${idx}] for value: ${element}.`,
          iterationsState: [...iterations],
          log: `Invoked element index [${idx}] callback`
        })

        // Body execution
        const activeIdx = iterations.length
        iterations.push({
          i: activeIdx,
          val: element,
          status: 'active',
          explanation: `Callback index [${idx}] starts. Executing closure.`
        })

        steps.push({
          activeLine: 3,
          variables: { ...baseVars, val: element, i: idx },
          conditionResult: 'executing body...',
          currentIterationIdx: activeIdx,
          explanation: `Inside callback body: logging array element A[${idx}] = ${element}.`,
          iterationsState: [...iterations],
          log: `Printed A[${idx}] = ${element}`
        })

        // Callback return
        iterations = iterations.map((it, iIdx) => 
          iIdx === activeIdx ? { ...it, status: 'completed' } : it
        )
      })

      // Completion
      steps.push({
        activeLine: 2,
        variables: { ...baseVars, val: 'N/A' },
        conditionResult: 'finished callback',
        currentIterationIdx: -1,
        explanation: `forEach callback stack fully cleared. Functional iterator terminates!`,
        iterationsState: [...iterations],
        log: `forEach completed traversal`
      })
    }

    return steps
  }, [selectedLoop, initVal, limitVal, stepVal, parsedArray, innerLimitVal])

  const totalSteps = executionFrames.length
  const currentFrame = executionFrames[currentStepIndex] || null

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

  const handleReset = () => {
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
    }, speed)
    playIntervalRef.current = id
  }

  const handlePause = () => {
    if (playIntervalRef.current !== null) {
      clearInterval(playIntervalRef.current)
      playIntervalRef.current = null
    }
    setIsPlaying(false)
  }

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current !== null) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [])

  // Live Console log compilation
  const logsList = useMemo(() => {
    return executionFrames.slice(0, currentStepIndex + 1).map(step => step.log)
  }, [executionFrames, currentStepIndex])

  const getComplexity = () => {
    if (selectedLoop === 'nested') return 'O(N × M)'
    return 'O(N)'
  }

  const getIterationsCount = () => {
    if (selectedLoop === 'for-of' || selectedLoop === 'forEach') return parsedArray.length
    if (selectedLoop === 'nested') return (limitVal - initVal) * innerLimitVal
    return Math.max(0, Math.ceil((limitVal - initVal) / stepVal))
  }

  const baseVars = { i: initVal, j: 0, val: 0 as any, limit: limitVal, innerLimit: innerLimitVal, step: stepVal }

  return (
    <div className="flex flex-col gap-6 text-white pb-12">
      {/* Title Header */}
      <header className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/app" 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 transition duration-300"
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Repeat className="text-cyan-400" size={24} />
            <h1 className="text-2xl font-bold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Loop Tracing Visualizer
            </h1>
          </div>
        </div>

        {/* Global tab switch presets vs custom */}
        <div className="flex items-center bg-[#050c12]/80 border border-slate-800 p-1 rounded-xl mt-3 md:mt-0">
          <button
            onClick={() => {
              setActiveTab('presets')
              handlePause()
            }}
            className={`px-4 py-1.5 text-xs font-bold font-sans rounded-lg transition duration-200 ${
              activeTab === 'presets'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Preset Loops
          </button>
          <button
            onClick={() => {
              setActiveTab('custom')
              handlePause()
            }}
            className={`px-4 py-1.5 text-xs font-bold font-sans rounded-lg transition duration-200 ${
              activeTab === 'custom'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Custom Code Sandbox
          </button>
        </div>
      </header>

      {/* Toggle View content */}
      {activeTab === 'presets' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Left Side: Parameters panel */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <LoopSidebar
              selectedLoop={selectedLoop}
              onLoopSelect={(loop) => {
                setSelectedLoop(loop)
                setCurrentStepIndex(0)
                handlePause()
              }}
              initVal={initVal}
              onInitChange={(val) => {
                setInitVal(val)
                setCurrentStepIndex(0)
              }}
              limitVal={limitVal}
              onLimitChange={(val) => {
                setLimitVal(val)
                setCurrentStepIndex(0)
              }}
              stepVal={stepVal}
              onStepChange={(val) => {
                setStepVal(val)
                setCurrentStepIndex(0)
              }}
              arrayInput={arrayInput}
              onArrayInputC={(val) => {
                setArrayInput(val)
                setCurrentStepIndex(0)
              }}
              innerLimitVal={innerLimitVal}
              onInnerLimitChange={(val) => {
                setInnerLimitVal(val)
                setCurrentStepIndex(0)
              }}
            />

            {/* Code panel */}
            <PseudocodePanel
              loopType={selectedLoop}
              activeLine={currentFrame?.activeLine ?? -1}
              theme="chalkboard"
              variables={currentFrame?.variables}
            />
          </div>

          {/* Right Side: Execution workspace */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Main Controls Panel */}
            <LoopControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onStepForward={handleNext}
              onStepBackward={handlePrev}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={(val) => setSpeed(val)}
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
            />

            {/* Interactive Workspace Canvas */}
            <LoopCanvas
              loopType={selectedLoop}
              iterations={currentFrame?.iterationsState ?? []}
              variables={currentFrame?.variables ?? baseVars}
              conditionResult={currentFrame?.conditionResult ?? 'dormant'}
              currentIterationIdx={currentFrame?.currentIterationIdx ?? -1}
            />

            {/* Complexity log card */}
            <LoopStats
              loopType={selectedLoop}
              totalIterations={getIterationsCount()}
              totalSteps={totalSteps}
              timeComplexity={getComplexity()}
              logs={logsList}
            />
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <LoopCodeVisualizerContainer />
        </div>
      )}
    </div>
  )
}
