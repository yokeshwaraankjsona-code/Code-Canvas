import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExamPassStep } from './ExamModeContainer'

interface AlgorithmBoardProps {
  algorithm: string
  currentStep: ExamPassStep | null
  theme: 'notebook' | 'chalkboard'
  showExamFormat: boolean
  allSteps?: ExamPassStep[]
  viewMode?: 'single' | 'all'
  currentStepIndex?: number
}

export const AlgorithmBoard: React.FC<AlgorithmBoardProps> = ({
  algorithm,
  currentStep,
  theme,
  showExamFormat,
  allSteps = [],
  viewMode = 'all',
  currentStepIndex = 0
}) => {
  if (viewMode === 'single' && !currentStep) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 font-serif">
        Generate an array or step parameters to begin whiteboard tracing.
      </div>
    )
  }

  if (viewMode === 'all' && allSteps.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 font-serif">
        No tracing steps available. Click generate or change parameters.
      </div>
    )
  }

  const boardBg = theme === 'chalkboard' ? 'bg-[#1b2a3a] text-slate-100 border-slate-600' : 'bg-[#fffdf9] text-amber-950 border-amber-900/10'

  const getElementStyle = (idx: number, indices?: number[], pointers?: ExamPassStep['pointers']) => {
    const isHighlighted = indices?.includes(idx)
    const isLow = pointers?.low === idx
    const isMid = pointers?.mid === idx
    const isHigh = pointers?.high === idx
    
    if (isHighlighted) {
      return theme === 'chalkboard' 
        ? 'bg-rose-500/20 border-rose-400 text-rose-300 ring-2 ring-rose-400/50 shadow-md' 
        : 'bg-red-50 border-red-500 text-red-800 font-bold ring-2 ring-red-300 shadow-sm'
    }

    if (isMid) {
      return theme === 'chalkboard' 
        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md' 
        : 'bg-amber-100 border-amber-600 text-amber-900 font-bold ring-1 ring-amber-400 shadow-sm'
    }

    if (isLow || isHigh) {
      return theme === 'chalkboard' 
        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
        : 'bg-cyan-50 border-cyan-600 text-cyan-900'
    }

    return theme === 'chalkboard'
      ? 'bg-slate-800 border-slate-700 text-slate-200 shadow-sm'
      : 'bg-white border-amber-950/20 shadow-sm'
  }

  const renderArray = (step: ExamPassStep) => {
    const { arrayState, indices, pointers } = step

    if (algorithm === 'stack') {
      return (
        <div className="flex flex-col items-center justify-end h-56 w-full max-w-[180px] border-b-4 border-r-4 border-l-4 border-amber-950/40 rounded-b-xl p-3 gap-1.5 relative bg-amber-50/5">
          <div className="absolute top-2 text-[9px] uppercase tracking-widest text-gray-400 font-mono">Stack (LIFO)</div>
          {[...arrayState].reverse().map((val, idx) => {
            const actualIdx = arrayState.length - 1 - idx
            const isTop = pointers?.top === actualIdx
            return (
              <div
                key={`stack-item-${actualIdx}`}
                className={`w-full py-1.5 px-3 rounded-lg border text-center font-mono font-bold text-sm flex justify-between items-center ${
                  isTop 
                    ? 'bg-emerald-600/10 border-emerald-500 text-emerald-700 font-extrabold' 
                    : theme === 'chalkboard' ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-950/20'
                }`}
              >
                <span className="text-[10px] text-gray-400">[{actualIdx}]</span>
                <span>{val}</span>
                {isTop ? (
                  <span className="text-[8px] bg-emerald-500 text-white font-serif px-1 py-0.5 rounded uppercase">Top</span>
                ) : <span className="w-6"></span>}
              </div>
            )
          })}
          {arrayState.length === 0 && (
            <div className="text-xs font-serif text-gray-400 italic mb-4">Stack is Empty</div>
          )}
        </div>
      )
    }

    if (algorithm === 'queue') {
      return (
        <div className="flex items-center justify-center gap-2 border-t-4 border-b-4 border-amber-950/40 py-5 px-3 w-full max-w-md min-h-[90px] rounded-lg bg-amber-50/5 relative">
          <div className="absolute top-1 left-2 text-[8px] uppercase tracking-wider text-gray-400">Front (Exit)</div>
          <div className="absolute top-1 right-2 text-[8px] uppercase tracking-wider text-gray-400">Rear (Entry)</div>
          {arrayState.map((val, idx) => {
            const isFront = idx === 0
            const isRear = idx === arrayState.length - 1
            return (
              <div
                key={`queue-item-${idx}`}
                className={`flex-1 min-w-[50px] p-2 rounded-lg border text-center font-mono text-sm font-bold flex flex-col justify-center items-center relative ${
                  theme === 'chalkboard' ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-950/20'
                }`}
              >
                <span>{val}</span>
                <span className="text-[9px] text-gray-400">[{idx}]</span>
                {isFront && (
                  <span className="absolute -bottom-5 text-[7px] bg-cyan-600 text-white font-serif px-1 py-0.5 rounded uppercase font-bold">Front</span>
                )}
                {isRear && (
                  <span className="absolute -top-5 text-[7px] bg-purple-600 text-white font-serif px-1 py-0.5 rounded uppercase font-bold">Rear</span>
                )}
              </div>
            )
          })}
          {arrayState.length === 0 && (
            <div className="text-xs font-serif text-gray-400 italic">Queue is Empty</div>
          )}
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center gap-2.5 w-full flex-wrap py-2">
        {arrayState.map((val, idx) => {
          const isLow = pointers?.low === idx
          const isMid = pointers?.mid === idx
          const isHigh = pointers?.high === idx
          
          return (
            <div key={`array-item-${idx}`} className="flex flex-col items-center gap-1">
              {/* Pointers Label */}
              <div className="h-5 flex items-center justify-center">
                {isLow && <span className="text-[9px] uppercase font-bold text-cyan-600 tracking-wider">Low</span>}
                {isMid && <span className="text-[9px] uppercase font-bold text-amber-600 tracking-wider">Mid</span>}
                {isHigh && <span className="text-[9px] uppercase font-bold text-purple-600 tracking-wider">High</span>}
              </div>

              {/* Element Box */}
              <div
                className={`w-11 h-11 rounded-lg border flex flex-col items-center justify-center transition-all ${getElementStyle(idx, indices, pointers)}`}
              >
                <span className="text-sm font-extrabold font-mono">{val}</span>
                <span className="text-[8px] text-gray-400">i = {idx}</span>
              </div>

              {/* Exam Markers */}
              {showExamFormat && indices?.includes(idx) && (
                <div className="h-3 flex items-center justify-center text-[9px] text-rose-500 font-extrabold font-serif animate-bounce">
                  ↑ Trace
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderStepCard = (step: ExamPassStep, idx: number, isActive: boolean) => {
    return (
      <div 
        key={`exam-step-card-${idx}`}
        className={`w-full rounded-xl p-5 border flex flex-col gap-4 transition-all relative ${
          isActive 
            ? 'ring-2 ring-amber-500 border-amber-500 scale-[1.01]' 
            : theme === 'chalkboard'
              ? 'bg-slate-800/40 border-slate-700/50'
              : 'bg-white border-amber-900/10 shadow-sm'
        }`}
      >
        {/* Step Header */}
        <div className="w-full flex items-center justify-between border-b pb-2 border-current border-opacity-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">
              Step {idx + 1}
            </span>
            <h4 className="text-md font-bold font-serif">{step.label}</h4>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400">
            {algorithm.replace('-', ' ')}
          </span>
        </div>

        {/* Chalkboard Explanation snippet */}
        <div className="text-sm font-serif leading-relaxed italic text-gray-500 border-l-3 border-amber-500 pl-3">
          {step.explanation}
        </div>

        {/* Exam style snippet */}
        {showExamFormat && (
          <div className="font-mono text-[11px] text-amber-800 bg-amber-50/50 p-2 rounded border border-amber-900/5">
            {algorithm === 'stack' || algorithm === 'queue' ? (
              <span>Operation: <strong className="text-amber-950 font-bold">{step.action || 'Initial'}</strong></span>
            ) : (
              <span>
                State: <strong className="text-amber-950 font-extrabold">[{step.arrayState.join(', ')}]</strong>
                {step.comparison && <> | Compare: <span className="text-blue-700 font-semibold">{step.comparison}</span></>}
                {step.action && <> | Result: <span className="text-emerald-700 font-semibold">{step.action}</span></>}
              </span>
            )}
          </div>
        )}

        {/* Dynamic visual representation */}
        <div className="flex justify-center items-center py-2">
          {renderArray(step)}
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl p-4 border-2 border-dashed flex flex-col gap-6 ${boardBg}`}>
      {/* Workspace Subheading */}
      <div className="flex items-center justify-between border-b pb-2.5 border-current border-opacity-15 print:hidden">
        <h3 className="text-sm font-bold font-serif uppercase tracking-wider">
          {viewMode === 'all' ? 'Exam Sheet: Continuous Tracing List' : 'Exam Sheet: Active Iteration'}
        </h3>
        <span className="text-xs italic text-gray-400 font-serif">
          {viewMode === 'all' ? `Showing all ${allSteps.length} steps` : `Step ${currentStepIndex + 1} of ${allSteps.length}`}
        </span>
      </div>

      {/* Sequential display list */}
      <div className="flex flex-col gap-6">
        {viewMode === 'all' ? (
          allSteps.map((step, idx) => renderStepCard(step, idx, idx === currentStepIndex))
        ) : (
          currentStep && renderStepCard(currentStep, currentStepIndex, true)
        )}
      </div>

      {/* Chalkboard Legend */}
      <div className="flex gap-4 text-[10px] font-serif border-t pt-3 border-current border-opacity-10 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-red-500 border border-red-700 rounded-sm"></span>
          <span>Trace index highlight</span>
        </div>
        {allSteps.some(s => s.pointers?.mid !== undefined) && (
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-amber-500 border border-amber-700 rounded-sm"></span>
            <span>Midpoint pointer</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-cyan-500 border border-cyan-700 rounded-sm"></span>
          <span>Boundaries & Stack/Queue pointers</span>
        </div>
      </div>
    </div>
  )
}
