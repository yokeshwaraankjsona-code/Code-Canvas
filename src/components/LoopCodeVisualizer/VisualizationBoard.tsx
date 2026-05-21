import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IterationBlock } from '../LoopVisualizer/IterationBlock'
import { IterationState } from '../../utils/customLoopParser'
import { Presentation } from 'lucide-react'

interface VisualizationBoardProps {
  iterations: IterationState[]
  variables: Record<string, any>
  loopVar: string
  conditionResult: boolean | string
  currentIterationIdx: number
}

export const VisualizationBoard: React.FC<VisualizationBoardProps> = ({
  iterations,
  variables,
  loopVar,
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

  // Generate inspector grid fields
  const items = [
    { label: `Loop Counter (${loopVar})`, value: variables[loopVar] !== undefined ? String(variables[loopVar]) : '0', highlight: true },
    { label: 'Inner Counter (j)', value: variables.j !== undefined ? String(variables.j) : 'N/A', highlight: variables.j !== undefined },
    { label: 'Condition Checked', value: String(conditionResult), highlight: true, color: conditionResult === true || conditionResult === 'true' ? 'text-emerald-400' : (conditionResult === false || conditionResult === 'false' ? 'text-rose-400' : 'text-cyan-400') }
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Real-time Scoped Inspector Grid */}
      <div className="rounded-2xl border border-slate-800 bg-[#061018]/70 p-5 shadow-lg backdrop-blur-sm flex flex-col gap-4 relative overflow-hidden">
        {/* Glossy top edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono">
            State Inspector Registers
          </h3>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
            Simulated CPU Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {items.map((item, idx) => (
            <div 
              key={`inspect-cell-${idx}`}
              className="p-3.5 rounded-xl border border-slate-800 bg-[#0a1520]/50 flex flex-col justify-between"
            >
              <span className="text-[9px] text-gray-500 font-mono block mb-1.5 uppercase tracking-wider">{item.label}</span>
              <span className={`text-md font-mono font-black ${item.color || 'text-cyan-400'}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Progress indicator */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>Simulation Progress</span>
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

      {/* 2. Visual Iteration Blocks Board */}
      <div className="rounded-2xl border border-slate-800 bg-[#061018]/70 p-5 shadow-lg backdrop-blur-sm min-h-[300px] flex flex-col gap-4 relative overflow-hidden">
        {/* Glossy top edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono flex items-center gap-1.5">
            <Presentation size={14} />
            <span>Visualization Whiteboard</span>
          </h3>
          <span className="text-[9px] font-mono text-gray-500 uppercase">
            Pass-by-Pass trace sheets
          </span>
        </div>

        {/* Scrollable list of active and completed blocks */}
        <div 
          className="flex flex-col gap-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin"
          style={{ scrollbarWidth: 'thin' }}
        >
          <AnimatePresence mode="popLayout">
            {iterations.map((item, idx) => {
              if (item.status === 'pending') return null
              return (
                <IterationBlock
                  key={`custom-iteration-block-${idx}`}
                  iterationNumber={item.i}
                  variableName={loopVar}
                  variableValue={item.val}
                  status={item.status}
                  innerIterations={item.innerIterations}
                  explanation={item.explanation}
                />
              )
            })}
          </AnimatePresence>

          {iterations.filter(it => it.status !== 'pending').length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-serif py-24 text-center">
              <span className="text-sm italic mb-1">Interactive whiteboard is dormant.</span>
              <span className="text-xs opacity-60">Type some code on the left and click "Visualize Step-by-Step".</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
