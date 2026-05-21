import React from 'react'
import { motion } from 'framer-motion'

interface InnerIteration {
  j: number
  status: 'active' | 'completed' | 'pending'
  log?: string
}

interface IterationBlockProps {
  iterationNumber: number
  variableName: string // e.g. "i" or "val"
  variableValue: any
  status: 'active' | 'completed' | 'pending'
  innerIterations?: InnerIteration[]
  currentInnerIdx?: number
  explanation?: string
}

export const IterationBlock: React.FC<IterationBlockProps> = ({
  iterationNumber,
  variableName,
  variableValue,
  status,
  innerIterations = [],
  currentInnerIdx = -1,
  explanation
}) => {
  const getBorderColor = () => {
    if (status === 'active') return 'border-cyan-500 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30'
    if (status === 'completed') return 'border-emerald-500/60 shadow-md shadow-emerald-500/5'
    return 'border-slate-800 opacity-40'
  }

  const getBgColor = () => {
    if (status === 'active') return 'bg-[#0f2438]/80 border-cyan-500/50'
    if (status === 'completed') return 'bg-[#071714]/60 border-emerald-500/30'
    return 'bg-[#050c12]/20'
  }

  const getBadgeColor = () => {
    if (status === 'active') return 'bg-cyan-500 text-black font-extrabold shadow shadow-cyan-400'
    if (status === 'completed') return 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
    return 'bg-slate-800 text-slate-500'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`rounded-2xl border p-5 flex flex-col gap-4 backdrop-blur-sm transition-all duration-300 ${getBgColor()} ${getBorderColor()}`}
    >
      {/* Block Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md ${getBadgeColor()}`}>
            Iteration {iterationNumber + 1}
          </span>
          <span className="text-xs font-mono font-bold text-gray-300">
            {variableName} = <strong className="text-cyan-400">{String(variableValue)}</strong>
          </span>
        </div>
        <div className="text-[10px] font-mono text-gray-500">
          {status === 'active' ? 'Executing...' : status === 'completed' ? 'Completed' : 'Pending'}
        </div>
      </div>

      {/* Block Content */}
      {status === 'active' && explanation && (
        <p className="text-xs text-slate-300 leading-relaxed font-sans border-l-2 border-cyan-500 pl-2.5">
          {explanation}
        </p>
      )}

      {/* Inner Nested Loop Display */}
      {innerIterations.length > 0 && (
        <div className="flex flex-col gap-3 p-3 rounded-xl bg-black/30 border border-slate-800/40">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold font-mono">
              Inner Loop (j tracker)
            </span>
            <span className="text-[9px] font-mono text-gray-500">
              {innerIterations.filter(inner => inner.status === 'completed').length} / {innerIterations.length} completed
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {innerIterations.map((inner, idx) => {
              const isInnerActive = inner.status === 'active'
              const isInnerCompleted = inner.status === 'completed'
              return (
                <div
                  key={`inner-${idx}`}
                  className={`p-2 rounded-lg border text-center font-mono text-xs flex flex-col justify-center items-center relative transition-all duration-300 ${
                    isInnerActive
                      ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/20 text-purple-200 font-bold scale-[1.03]'
                      : isInnerCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                        : 'bg-[#050c12]/40 border-slate-800 text-slate-600 opacity-60'
                  }`}
                >
                  <span className="text-[8px] text-gray-500 uppercase mb-0.5">j = {inner.j}</span>
                  <span className="font-extrabold text-sm">{inner.j}</span>
                  {isInnerActive && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}
