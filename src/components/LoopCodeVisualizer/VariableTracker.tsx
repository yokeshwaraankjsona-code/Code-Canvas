import React, { useEffect, useState } from 'react'
import { Info, Compass } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VariableTrackerProps {
  variables: Record<string, any>
  prevVariables?: Record<string, any>
}

export const VariableTracker: React.FC<VariableTrackerProps> = ({
  variables,
  prevVariables = {}
}) => {
  const [changedVars, setChangedVars] = useState<Record<string, boolean>>({})

  // Detect which variables changed in this step to trigger a brief flash animation
  useEffect(() => {
    const changes: Record<string, boolean> = {}
    Object.keys(variables).forEach((key) => {
      if (prevVariables && prevVariables[key] !== variables[key]) {
        changes[key] = true
      }
    })
    setChangedVars(changes)

    // Clear flash status after 800ms
    const timer = setTimeout(() => {
      setChangedVars({})
    }, 800)

    return () => clearTimeout(timer)
  }, [variables])

  const renderVal = (val: any) => {
    if (Array.isArray(val)) {
      return `[${val.join(', ')}]`
    }
    if (typeof val === 'object' && val !== null) {
      return JSON.stringify(val)
    }
    return String(val)
  }

  const getVarType = (val: any) => {
    if (Array.isArray(val)) return 'Array'
    if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double'
    if (typeof val === 'boolean') return 'boolean'
    return 'string'
  }

  const varEntries = Object.entries(variables)

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#061018]/70 p-5 shadow-lg backdrop-blur-sm flex flex-col gap-4 relative overflow-hidden">
      {/* Glossy top edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="text-cyan-400" size={18} />
          <h2 className="text-sm font-bold text-gray-200 tracking-wide font-sans">
            Variable Inspector
          </h2>
        </div>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
          Active Environment
        </span>
      </div>

      {varEntries.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center text-gray-500 font-serif">
          <span className="text-xs italic">Variables will load here during parsing</span>
          <span className="text-[10px] opacity-60 mt-1 font-sans">No active registers bound yet</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
          <AnimatePresence>
            {varEntries.map(([key, val]) => {
              const isChanged = changedVars[key]
              const oldVal = prevVariables ? prevVariables[key] : undefined
              const hasOldVal = oldVal !== undefined && oldVal !== val

              return (
                <motion.div
                  key={`var-card-${key}`}
                  layout
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isChanged
                      ? 'bg-cyan-950/20 border-cyan-500/80 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400/20 scale-[1.01]'
                      : 'bg-[#0a1520]/50 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  {/* Flashing glow indicator */}
                  {isChanged && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-black text-gray-300 bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded">
                        {key}
                      </span>
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                        {getVarType(val)}
                      </span>
                    </div>
                    {hasOldVal && (
                      <span className="text-[9px] font-mono text-gray-500">
                        {renderVal(oldVal)} ➔
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <span className={`text-lg font-mono font-bold ${isChanged ? 'text-cyan-300 font-extrabold animate-pulse' : 'text-cyan-400'}`}>
                      {renderVal(val)}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Helper tips */}
      <div className="mt-1 flex items-start gap-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-[10px] text-gray-400 font-sans leading-relaxed">
        <Info size={12} className="text-cyan-400 mt-0.5 shrink-0" />
        <span>Values highlighted in cyber-cyan represent elements changed or re-evaluated during the active execution line.</span>
      </div>
    </div>
  )
}
