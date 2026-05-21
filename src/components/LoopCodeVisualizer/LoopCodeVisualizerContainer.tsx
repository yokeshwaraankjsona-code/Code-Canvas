import React, { useState, useEffect, useRef } from 'react'
import { CodeEditor } from './CodeEditor'
import { VisualizationBoard } from './VisualizationBoard'
import { FlowchartPanel } from './FlowchartPanel'
import { VariableTracker } from './VariableTracker'
import { ExamTable } from './ExamTable'
import { OutputConsole } from './OutputConsole'
import { parseCustomLoop, LoopExecutionStep } from '../../utils/customLoopParser'
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Sliders, Presentation, GitPullRequest, BookOpen } from 'lucide-react'

const SANDBOX_TEMPLATES = [
  {
    id: 'counter',
    name: 'Linear Counter',
    description: 'A standard loop that counts up to the limit using the step size.',
  },
  {
    id: 'accumulator',
    name: 'Sum Accumulator',
    description: 'Calculates the running sum of all numbers up to the limit.',
  },
  {
    id: 'factorial',
    name: 'Factorial Product',
    description: 'Calculates the running product of all numbers up to the limit.',
  },
  {
    id: 'reverse',
    name: 'Reverse Countdown',
    description: 'Counts down from the limit to 0 (uses decrementing iteration).',
  },
  {
    id: 'nested',
    name: 'Nested Coordinates Grid',
    description: 'Generates coordinate points using nested outer and inner loops.',
  }
]

const generateCode = (lang: string, loopStyle: string, templateId: string, limit: number, step: number): string => {
  // Safe override: Python does not support do-while
  const activeStyle = (lang === 'python' && loopStyle === 'do-while') ? 'while' : loopStyle

  // 1. Nested Coordinates Grid (Restricted to for loops to ensure full nested iterations trace support)
  if (templateId === 'nested') {
    switch (lang) {
      case 'c':
        return `// C Nested Coordinate Patterns\nint i = 0;\nfor (i = 0; i < ${limit}; i += ${step}) {\n    int j = 0;\n    for (j = 0; j < 3; j++) {\n        print(i);\n    }\n}`;
      case 'cpp':
        return `// C++ Nested Coordinate Patterns\nint i = 0;\nfor (i = 0; i < ${limit}; i += ${step}) {\n    int j = 0;\n    for (j = 0; j < 3; j++) {\n        cout << i;\n    }\n}`;
      case 'java':
        return `// Java Nested Coordinate Patterns\nint i = 0;\nfor (i = 0; i < ${limit}; i += ${step}) {\n    int j = 0;\n    for (j = 0; j < 3; j++) {\n        System.out.println(i);\n    }\n}`;
      case 'python':
      default:
        return `# Python Nested Coordinate Patterns\nfor i in range(0, ${limit}, ${step}):\n    for j in range(3):\n        print(i)`;
    }
  }

  // 2. Reverse Countdown
  if (templateId === 'reverse') {
    if (activeStyle === 'for') {
      switch (lang) {
        case 'c':
          return `// C Reverse Countdown For Loop\nint i = 0;\nfor (i = ${limit}; i >= 0; i -= ${step}) {\n    print(i);\n}`;
        case 'cpp':
          return `// C++ Reverse Countdown For Loop\nint i = 0;\nfor (i = ${limit}; i >= 0; i -= ${step}) {\n    cout << i;\n}`;
        case 'java':
          return `// Java Reverse Countdown For Loop\nint i = 0;\nfor (i = ${limit}; i >= 0; i -= ${step}) {\n    System.out.println(i);\n}`;
        case 'python':
        default:
          return `# Python Reverse Countdown range\nfor i in range(${limit}, -1, -${step}):\n    print(i)`;
      }
    } else if (activeStyle === 'while') {
      switch (lang) {
        case 'c':
          return `// C Reverse Countdown While Loop\nint i = ${limit};\nwhile (i >= 0) {\n    print(i);\n    i -= ${step};\n}`;
        case 'cpp':
          return `// C++ Reverse Countdown While Loop\nint i = ${limit};\nwhile (i >= 0) {\n    cout << i;\n    i -= ${step};\n}`;
        case 'java':
          return `// Java Reverse Countdown While Loop\nint i = ${limit};\nwhile (i >= 0) {\n    System.out.println(i);\n    i -= ${step};\n}`;
        case 'python':
        default:
          return `# Python Reverse Countdown while\ni = ${limit}\nwhile i >= 0:\n    print(i)\n    i -= ${step}`;
      }
    } else { // do-while
      switch (lang) {
        case 'c':
          return `// C Reverse Countdown Do-While Loop\nint i = ${limit};\ndo {\n    print(i);\n    i -= ${step};\n} while (i >= 0);`;
        case 'cpp':
          return `// C++ Reverse Countdown Do-While Loop\nint i = ${limit};\ndo {\n    cout << i;\n    i -= ${step};\n} while (i >= 0);`;
        case 'java':
        default:
          return `// Java Reverse Countdown Do-While Loop\nint i = ${limit};\ndo {\n    System.out.println(i);\n    i -= ${step};\n} while (i >= 0);`;
      }
    }
  }

  // 3. Linear Counter
  if (templateId === 'counter') {
    if (activeStyle === 'for') {
      switch (lang) {
        case 'c':
          return `// C Language Simple For Loop\nint i = 0;\nfor (i = 0; i < ${limit}; i += ${step}) {\n    print(i);\n}`;
        case 'cpp':
          return `// C++ Language Simple For Loop\nint i = 0;\nfor (i = 0; i < ${limit}; i += ${step}) {\n    cout << i;\n}`;
        case 'java':
          return `// Java Language Simple For Loop\nint i = 0;\nfor (i = 0; i < ${limit}; i += ${step}) {\n    System.out.println(i);\n}`;
        case 'python':
        default:
          return `# Python range For Loop\nfor i in range(0, ${limit}, ${step}):\n    print(i)`;
      }
    } else if (activeStyle === 'while') {
      switch (lang) {
        case 'c':
          return `// C Language Simple While Loop\nint i = 0;\nwhile (i < ${limit}) {\n    print(i);\n    i += ${step};\n}`;
        case 'cpp':
          return `// C++ Language Simple While Loop\nint i = 0;\nwhile (i < ${limit}) {\n    cout << i;\n    i += ${step};\n}`;
        case 'java':
          return `// Java Language Simple While Loop\nint i = 0;\nwhile (i < ${limit}) {\n    System.out.println(i);\n    i += ${step};\n}`;
        case 'python':
        default:
          return `# Python Simple While Loop\ni = 0\nwhile i < ${limit}:\n    print(i)\n    i += ${step}`;
      }
    } else { // do-while
      switch (lang) {
        case 'c':
          return `// C Language Simple Do-While Loop\nint i = 0;\ndo {\n    print(i);\n    i += ${step};\n} while (i < ${limit});`;
        case 'cpp':
          return `// C++ Language Simple Do-While Loop\nint i = 0;\ndo {\n    cout << i;\n    i += ${step};\n} while (i < ${limit});`;
        case 'java':
        default:
          return `// Java Do-While Execution\nint i = 0;\ndo {\n    System.out.println(i);\n    i += ${step};\n} while (i < ${limit});`;
      }
    }
  }

  // 4. Sum Accumulator
  if (templateId === 'accumulator') {
    if (activeStyle === 'for') {
      switch (lang) {
        case 'c':
          return `// C Sum Accumulator For Loop\nint sum = 0;\nint i = 0;\nfor (i = 0; i < ${limit}; i += ${step}) {\n    sum += i;\n    print(sum);\n}`;
        case 'cpp':
          return `// C++ Sum Accumulator For Loop\nint sum = 0;\nint i = 0;\nfor (i = 0; i < ${limit}; i += ${step}) {\n    sum += i;\n    cout << sum;\n}`;
        case 'java':
          return `// Java Sum Accumulator For Loop\nint sum = 0;\nint i = 0;\nfor (i = 0; i < ${limit}; i += ${step}) {\n    sum += i;\n    System.out.println(sum);\n}`;
        case 'python':
        default:
          return `# Python Sum Accumulator For Loop\nsum = 0\nfor i in range(0, ${limit}, ${step}):\n    sum += i\n    print(sum)`;
      }
    } else if (activeStyle === 'while') {
      switch (lang) {
        case 'c':
          return `// C Sum Accumulator While Loop\nint sum = 0;\nint i = 0;\nwhile (i < ${limit}) {\n    sum += i;\n    print(sum);\n    i += ${step};\n}`;
        case 'cpp':
          return `// C++ Sum Accumulator While Loop\nint sum = 0;\nint i = 0;\nwhile (i < ${limit}) {\n    sum += i;\n    cout << sum;\n    i += ${step};\n}`;
        case 'java':
          return `// Java Sum Accumulator While Loop\nint sum = 0;\nint i = 0;\nwhile (i < ${limit}) {\n    sum += i;\n    System.out.println(sum);\n    i += ${step};\n}`;
        case 'python':
        default:
          return `# Python Sum Accumulator While Loop\nsum = 0\ni = 0\nwhile i < ${limit}:\n    sum += i\n    print(sum)\n    i += ${step}`;
      }
    } else { // do-while
      switch (lang) {
        case 'c':
          return `// C Sum Accumulator Do-While Loop\nint sum = 0;\nint i = 0;\ndo {\n    sum += i;\n    print(sum);\n    i += ${step};\n} while (i < ${limit});`;
        case 'cpp':
          return `// C++ Sum Accumulator Do-While Loop\nint sum = 0;\nint i = 0;\ndo {\n    sum += i;\n    cout << sum;\n    i += ${step};\n} while (i < ${limit});`;
        case 'java':
        default:
          return `// Java Sum Accumulator Do-While Loop\nint sum = 0;\nint i = 0;\ndo {\n    sum += i;\n    System.out.println(sum);\n    i += ${step};\n} while (i < ${limit});`;
      }
    }
  }

  // 5. Factorial Product
  if (templateId === 'factorial') {
    if (activeStyle === 'for') {
      switch (lang) {
        case 'c':
          return `// C Factorial Product For Loop\nint fact = 1;\nint i = 1;\nfor (i = 1; i <= ${limit}; i += ${step}) {\n    fact *= i;\n    print(fact);\n}`;
        case 'cpp':
          return `// C++ Factorial Product For Loop\nint fact = 1;\nint i = 1;\nfor (i = 1; i <= ${limit}; i += ${step}) {\n    fact *= i;\n    cout << fact;\n}`;
        case 'java':
          return `// Java Factorial Product For Loop\nint fact = 1;\nint i = 1;\nfor (i = 1; i <= ${limit}; i += ${step}) {\n    fact *= i;\n    System.out.println(fact);\n}`;
        case 'python':
        default:
          return `# Python Factorial Product For Loop\nfact = 1\nfor i in range(1, ${limit} + 1, ${step}):\n    fact *= i\n    print(fact)`;
      }
    } else if (activeStyle === 'while') {
      switch (lang) {
        case 'c':
          return `// C Factorial Product While Loop\nint fact = 1;\nint i = 1;\nwhile (i <= ${limit}) {\n    fact *= i;\n    print(fact);\n    i += ${step};\n}`;
        case 'cpp':
          return `// C++ Factorial Product While Loop\nint fact = 1;\nint i = 1;\nwhile (i <= ${limit}) {\n    fact *= i;\n    cout << fact;\n    i += ${step};\n}`;
        case 'java':
          return `// Java Factorial Product While Loop\nint fact = 1;\nint i = 1;\nwhile (i <= ${limit}) {\n    fact *= i;\n    System.out.println(fact);\n    i += ${step};\n}`;
        case 'python':
        default:
          return `# Python Factorial Product While Loop\nfact = 1\ni = 1\nwhile i <= ${limit}:\n    fact *= i\n    print(fact)\n    i += ${step}`;
      }
    } else { // do-while
      switch (lang) {
        case 'c':
          return `// C Factorial Product Do-While Loop\nint fact = 1;\nint i = 1;\ndo {\n    fact *= i;\n    print(fact);\n    i += ${step};\n} while (i <= ${limit});`;
        case 'cpp':
          return `// C++ Factorial Product Do-While Loop\nint fact = 1;\nint i = 1;\ndo {\n    fact *= i;\n    cout << fact;\n    i += ${step};\n} while (i <= ${limit});`;
        case 'java':
        default:
          return `// Java Factorial Product Do-While Loop\nint fact = 1;\nint i = 1;\ndo {\n    fact *= i;\n    System.out.println(fact);\n    i += ${step};\n} while (i <= ${limit});`;
      }
    }
  }

  return '';
}

export const LoopCodeVisualizerContainer: React.FC = () => {
  // Config parameters for sandbox
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('counter')
  const [loopStyle, setLoopStyle] = useState<'for' | 'while' | 'do-while'>('for')
  const [limitVal, setLimitVal] = useState<number>(5)
  const [stepVal, setStepVal] = useState<number>(1)

  // Input settings
  const [language, setLanguage] = useState<'c' | 'cpp' | 'java' | 'python'>('c')
  const [code, setCode] = useState<string>('')
  
  // Tab states for Center workspace
  const [centerTab, setCenterTab] = useState<'whiteboard' | 'flowchart'>('whiteboard')

  // Simulation timeline
  const [steps, setSteps] = useState<LoopExecutionStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [loopVarName, setLoopVarName] = useState<string>('i')
  const [conditionStr, setConditionStr] = useState<string>('i < 5')

  // Playback player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(800)
  const playIntervalRef = useRef<number | null>(null)

  // Auto compile first time or when template loads
  const triggerSimulationCompile = (rawCode: string, lang: 'c' | 'cpp' | 'java' | 'python') => {
    if (!rawCode) return
    const { steps: parsedSteps, error, conditionStr: parsedCond } = parseCustomLoop(rawCode, lang)
    if (error) {
      setValidationError(error)
      setSteps([])
      setCurrentStepIndex(-1)
    } else {
      setValidationError(null)
      setSteps(parsedSteps)
      setCurrentStepIndex(0)
      setConditionStr(parsedCond || 'i < limit')
      
      // Attempt to guess outer loop variable name from code
      const forMatch = rawCode.match(/for\s*\(\s*(?:int\s+|let\s+|var\s+)?([a-zA-Z_]\w*)/)
      const whileMatch = rawCode.match(/while\s*\(?\s*([a-zA-Z_]\w*)/)
      const pyMatch = rawCode.match(/for\s+([a-zA-Z_]\w*)\s+in/)
      const loopVar = forMatch ? forMatch[1] : (whileMatch ? whileMatch[1] : (pyMatch ? pyMatch[1] : 'i'))
      setLoopVarName(loopVar)
    }
  }

  // Load template when configuration changes
  useEffect(() => {
    // If language is python and loopStyle is do-while, auto-toggle to while
    let activeStyle = loopStyle
    if (language === 'python' && loopStyle === 'do-while') {
      setLoopStyle('while')
      activeStyle = 'while'
    }
    // If nested template is selected, nested loop tracing works best with 'for' loops
    if (selectedTemplateId === 'nested' && loopStyle !== 'for') {
      setLoopStyle('for')
      activeStyle = 'for'
    }

    const generated = generateCode(language, activeStyle, selectedTemplateId, limitVal, stepVal)
    setCode(generated)
    handlePause()
  }, [selectedTemplateId, language, loopStyle, limitVal, stepVal])

  // Run the virtual compiler parser on demand
  const handleVisualize = () => {
    handlePause()
    triggerSimulationCompile(code, language)
  }

  // Auto compile when code or language is resolved
  useEffect(() => {
    if (code) {
      triggerSimulationCompile(code, language)
    }
  }, [code, language])

  // Current active frame
  const currentFrame = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null
  const prevFrame = currentStepIndex > 0 ? steps[currentStepIndex - 1] : undefined

  // Playback timer controls
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    } else {
      handlePause()
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
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
        if (prev < steps.length - 1) {
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

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current !== null) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Playback Controller Board */}
      <div className="rounded-2xl border border-slate-800 bg-[#061018]/70 p-4 shadow-md backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {/* Glossy top edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        {/* Buttons tray */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex <= 0}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 transition duration-200 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-slate-900/60"
            title="Previous Step"
          >
            <SkipBack size={15} />
          </button>
          
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="px-5 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition duration-200"
            >
              <Pause size={13} fill="currentColor" />
              Pause
            </button>
          ) : (
            <button
              onClick={handlePlay}
              disabled={steps.length === 0 || currentStepIndex === steps.length - 1}
              className="px-5 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition duration-200 disabled:opacity-30"
            >
              <Play size={13} fill="currentColor" />
              Auto Play
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={steps.length === 0 || currentStepIndex === steps.length - 1}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 transition duration-200 disabled:opacity-30"
            title="Next Step"
          >
            <SkipForward size={15} />
          </button>

          <button
            onClick={handleReset}
            disabled={steps.length === 0 || currentStepIndex === 0}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 transition duration-200 disabled:opacity-30"
            title="Restart simulation"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Progress tracker slider bar */}
        <div className="flex-1 flex items-center gap-3 w-full max-w-md">
          <span className="text-[10px] font-mono text-gray-500">
            Step {currentStepIndex + 1} / {steps.length || 1}
          </span>
          <div className="flex-1 relative py-2">
            <input
              type="range"
              min={0}
              max={steps.length > 0 ? steps.length - 1 : 0}
              value={currentStepIndex >= 0 ? currentStepIndex : 0}
              onChange={(e) => {
                setCurrentStepIndex(parseInt(e.target.value))
                handlePause()
              }}
              disabled={steps.length === 0}
              className="w-full h-1 bg-[#0a1520] border border-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-35"
            />
          </div>
        </div>

        {/* Playback speed tracker slider */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <Sliders size={13} className="text-cyan-400" />
          <span>Speed:</span>
          <input
            type="range"
            min={200}
            max={2000}
            step={100}
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-20 h-1 bg-[#0a1520] rounded-lg appearance-none accent-cyan-400"
          />
          <span className="w-12 text-[10px] text-gray-500">{speed}ms</span>
        </div>
      </div>

      {/* 2. Visual Simulator Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Interactive editor (span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Sandbox Configurator Sidebar Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#061018]/70 p-5 shadow-lg backdrop-blur-sm flex flex-col gap-4 relative overflow-hidden">
            {/* Glossy top edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Sliders className="text-cyan-400" size={18} />
              <h2 className="text-sm font-bold text-gray-200 tracking-wide font-sans">
                Sandbox Configurator
              </h2>
            </div>

            {/* Template Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono font-extrabold text-slate-400">
                Select Template Program
              </label>
              <div className="flex flex-col gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80">
                {SANDBOX_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id)
                      handlePause()
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-sans transition-all duration-200 ${
                      selectedTemplateId === tmpl.id
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Loop Control Type Selector */}
            {selectedTemplateId !== 'nested' ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono font-extrabold text-slate-400">
                  Loop Control Style
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
                  {(['for', 'while', 'do-while'] as const).map((style) => {
                    // Hide do-while for Python
                    if (style === 'do-while' && language === 'python') return null;
                    return (
                      <button
                        key={style}
                        onClick={() => {
                          setLoopStyle(style)
                          handlePause()
                        }}
                        className={`text-center py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                          loopStyle === style
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                            : 'text-slate-400 hover:text-slate-200 border border-transparent'
                        }`}
                      >
                        {style}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-cyan-950/10 border border-cyan-800/20 rounded-xl">
                <p className="text-[9px] text-cyan-400 font-mono leading-relaxed">
                  NOTE: Nested loop Dry-run visualizer runs best in <strong>For Loop</strong> format for full inner-outer step tracking.
                </p>
              </div>
            )}

            {/* Parameter Sliders */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-extrabold uppercase text-slate-400">
                  <span>Loop Limit</span>
                  <span className="text-cyan-400">{limitVal}</span>
                </div>
                <input
                  type="range"
                  min={selectedTemplateId === 'factorial' ? 2 : 2}
                  max={selectedTemplateId === 'factorial' ? 6 : 10} // Lower max for factorial to prevent huge numbers
                  value={limitVal}
                  onChange={(e) => {
                    setLimitVal(parseInt(e.target.value))
                    handlePause()
                  }}
                  className="w-full h-1 bg-[#0a1520] rounded-lg appearance-none accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-extrabold uppercase text-slate-400">
                  <span>Step Increment</span>
                  <span className="text-cyan-400">{stepVal}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={stepVal}
                  onChange={(e) => {
                    setStepVal(parseInt(e.target.value))
                    handlePause()
                  }}
                  className="w-full h-1 bg-[#0a1520] rounded-lg appearance-none accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Helper info description */}
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                {SANDBOX_TEMPLATES.find(t => t.id === selectedTemplateId)?.description}
              </p>
            </div>
          </div>

          <CodeEditor
            language={language}
            onLanguageChange={(lang) => {
              setLanguage(lang)
              handlePause()
            }}
            code={code}
            onCodeChange={(c) => {
              setCode(c)
              handlePause()
            }}
            onVisualize={handleVisualize}
            activeLine={currentFrame?.activeLine ?? -1}
            isSimulating={steps.length > 0}
            validationError={validationError}
          />
        </div>

        {/* Center column: Workspace (span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Tabs header switcher */}
          <div className="flex items-center justify-between bg-[#061018]/60 border border-slate-800 p-1.5 rounded-xl">
            <div className="flex items-center gap-1.5 w-full">
              <button
                onClick={() => setCenterTab('whiteboard')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg inline-flex items-center justify-center gap-1.5 transition duration-200 ${
                  centerTab === 'whiteboard'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Presentation size={13} />
                Whiteboard Canvas
              </button>
              <button
                onClick={() => setCenterTab('flowchart')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg inline-flex items-center justify-center gap-1.5 transition duration-200 ${
                  centerTab === 'flowchart'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <GitPullRequest size={13} className="rotate-180" />
                SVG Flowchart
              </button>
            </div>
          </div>

          {/* Render active center pane */}
          {centerTab === 'whiteboard' ? (
            <VisualizationBoard
              iterations={currentFrame?.iterationsState ?? []}
              variables={currentFrame?.variables ?? {}}
              loopVar={loopVarName}
              conditionResult={currentFrame?.conditionResult ?? 'dormant'}
              currentIterationIdx={currentFrame?.currentIterationIdx ?? -1}
            />
          ) : (
            <FlowchartPanel
              activeNode={currentFrame?.flowchartNode ?? 'idle'}
              conditionStr={conditionStr}
            />
          )}
        </div>

        {/* Right column: Variable registers + Tracing sheets (span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Real-time variable tracker */}
          <VariableTracker
            variables={currentFrame?.variables ?? {}}
            prevVariables={prevFrame?.variables}
          />

          {/* Active step explanation text */}
          <div className="rounded-2xl border border-slate-800 bg-[#061018]/70 p-5 shadow-lg backdrop-blur-sm flex flex-col gap-3 relative overflow-hidden">
            {/* Glossy top edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            
            <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <BookOpen size={14} />
              <span>Step Explanation</span>
            </h3>
            
            {currentFrame?.explanation ? (
              <p className="text-xs text-slate-300 leading-relaxed font-sans border-l-2 border-cyan-400 pl-3">
                {currentFrame.explanation}
              </p>
            ) : (
              <div className="text-xs text-slate-500 italic py-4 text-center">
                Visualizer is dormant. Compile program to start execution traces.
              </div>
            )}
          </div>

          {/* High-fidelity handwritten tracing tables */}
          <ExamTable
            steps={steps}
            currentStepIndex={currentStepIndex}
            loopVar={loopVarName}
          />
        </div>
      </div>

      {/* 3. Output console (span 12, bottoms) */}
      <OutputConsole
        stdout={currentFrame?.stdout ?? []}
        onClear={() => handleReset()}
      />
    </div>
  )
}
