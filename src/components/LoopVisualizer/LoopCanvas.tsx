import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IterationBlock } from './IterationBlock'

interface Iteration {
  i: number
  val: any
  status: 'active' | 'completed' | 'pending'
  innerIterations?: { j: number; status: 'active' | 'completed' | 'pending' }[]
  explanation?: string
}

interface LoopCanvasProps {
  loopType: string
  iterations: Iteration[]
  variables: { i: number; j: number; val: any; limit: number; innerLimit: number; step: number }
  conditionResult: boolean | string
  currentIterationIdx: number
}

export const LoopCanvas: React.FC<LoopCanvasProps> = ({
  loopType,
  iterations,
  variables,
  conditionResult,
  currentIterationIdx
}) => {
  const activeIteration = iterations[currentIterationIdx] || null

  const getPercentage = () => {
    if (iterations.length === 0) return 0
    const completed = iterations.filter(it => it.status === 'completed').length
    const activeWeight = activeIteration?.status === 'active' ? 0.5 : 0
    return Math.min(100, Math.round(((completed + activeWeight) / iterations.length) * 100))
  }

  const renderVariablesInspector = () => {
    const checkString = () => {
      if (loopType === 'for-of' || loopType === 'forEach') {
        return `element !== undefined`
      }
      if (loopType === 'do-while') {
        return `i < ${variables.limit} (checked at bottom)`
      }
      return `i < ${variables.limit}`
    }

    const items = [
      { label: 'Outer counter (i)', value: loopType === 'for-of' || loopType === 'forEach' ? 'N/A' : variables.i, highlight: true },
      { label: 'Inner counter (j)', value: loopType === 'nested' ? variables.j : 'N/A', highlight: loopType === 'nested' },
      { label: 'Active element', value: loopType === 'for-of' || loopType === 'forEach' ? JSON.stringify(variables.val) : 'N/A', highlight: loopType === 'for-of' || loopType === 'forEach' },
      { label: 'Condition evaluated', value: String(conditionResult), highlight: true, color: conditionResult === true || conditionResult === 'true' ? 'text-emerald-400' : 'text-rose-400' }
    ]

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, idx) => (
          <div 
            key={`inspector-${idx}`}
            className="p-3.5 rounded-xl border border-slate-800 bg-[#0a1520]/50 flex flex-col justify-between"
          >
            <span className="text-[10px] text-gray-500 font-mono block mb-1 uppercase tracking-wider">{item.label}</span>
            <span className={`text-md font-mono font-bold ${item.color || 'text-cyan-400'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Live Variables Inspector Grid */}
      <div className="rounded-2xl border border-slate-800 bg-[#061018]/60 p-5 shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
          <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono">
            Variables Inspector
          </h3>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
            Realtime sandbox registers
          </span>
        </div>

        {renderVariablesInspector()}

        {/* Dynamic Progress indicator */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>Loop Execution Progress</span>
            <span className="text-cyan-400 font-bold">{getPercentage()}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#0a1520] rounded-full overflow-hidden border border-slate-800">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-400/20"
              initial={{ width: 0 }}
              animate={{ width: `${getPercentage()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* 2. Visual Iteration Blocks Container */}
      <div className="rounded-2xl border border-slate-800 bg-[#061018]/60 p-5 shadow-md min-h-[300px] flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
          <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono">
            Iteration Workspace Map
          </h3>
          <span className="text-[9px] font-mono text-gray-500 uppercase">
            Active frames are highlighted in neon cyan
          </span>
        </div>

        {/* Scrollable list of active and completed blocks */}
        <div 
          className="flex flex-col gap-4 max-h-[460px] overflow-y-auto pr-1"
          style={{ scrollbarWidth: 'thin' }}
        >
          <AnimatePresence mode="popLayout">
            {iterations.map((item, idx) => {
              if (item.status === 'pending') return null
              return (
                <IterationBlock
                  key={`iteration-block-${idx}`}
                  iterationNumber={item.i}
                  variableName={loopType === 'for-of' || loopType === 'forEach' ? 'val' : 'i'}
                  variableValue={item.val}
                  status={item.status}
                  innerIterations={item.innerIterations}
                  explanation={item.explanation}
                />
              )
            })}
          </AnimatePresence>

          {iterations.filter(it => it.status !== 'pending').length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-serif py-16 text-center">
              <span className="text-sm italic mb-1">Visual workspace is dormant.</span>
              <span className="text-xs opacity-60">Select loop parameters and hit "Start Loop" above.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
