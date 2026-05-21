import React from 'react'
import { Repeat, ChevronRight } from 'lucide-react'

export type LoopType = 'for' | 'while' | 'do-while' | 'nested' | 'for-of' | 'forEach'

interface LoopSidebarProps {
  selectedLoop: LoopType
  onLoopSelect: (loop: LoopType) => void
  initVal: number
  onInitChange: (val: number) => void
  limitVal: number
  onLimitChange: (val: number) => void
  stepVal: number
  onStepChange: (val: number) => void
  arrayInput: string
  onArrayInputC: (val: string) => void
  innerLimitVal: number
  onInnerLimitChange: (val: number) => void
}

export const LoopSidebar: React.FC<LoopSidebarProps> = ({
  selectedLoop,
  onLoopSelect,
  initVal,
  onInitChange,
  limitVal,
  onLimitChange,
  stepVal,
  onStepChange,
  arrayInput,
  onArrayInputC,
  innerLimitVal,
  onInnerLimitChange
}) => {
  const loops: { id: LoopType; label: string; desc: string }[] = [
    { id: 'for', label: 'For Loop', desc: 'Standard incremental iterations' },
    { id: 'while', label: 'While Loop', desc: 'Condition-first entry validation' },
    { id: 'do-while', label: 'Do While Loop', desc: 'Guarantees at least one execution' },
    { id: 'nested', label: 'Nested Loops', desc: 'Outer-Inner loop tracking' },
    { id: 'for-of', label: 'For...Of Loop', desc: 'Iterate over values of arrays' },
    { id: 'forEach', label: 'forEach Loop', desc: 'Functional array traversals' }
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Loop Selection List */}
      <div className="rounded-2xl border border-slate-800 bg-[#061018]/60 p-4 shadow-md">
        <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono mb-3 flex items-center gap-1.5">
          <Repeat size={14} />
          <span>Select Loop Type</span>
        </h3>
        
        <div className="flex flex-col gap-1.5">
          {loops.map(loop => {
            const isSelected = selectedLoop === loop.id
            return (
              <button
                key={loop.id}
                onClick={() => onLoopSelect(loop.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold shadow-md shadow-cyan-500/5'
                    : 'bg-[#0a1520]/40 border-slate-800 hover:border-slate-700 text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">{loop.label}</div>
                  <div className="text-[10px] text-gray-500 opacity-85">{loop.desc}</div>
                </div>
                <ChevronRight 
                  size={14} 
                  className={`transition duration-300 ${
                    isSelected ? 'translate-x-1 text-cyan-400' : 'text-gray-600 group-hover:text-gray-400'
                  }`} 
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Parameters Configuration */}
      <div className="rounded-2xl border border-slate-800 bg-[#061018]/60 p-4 shadow-md">
        <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono mb-4">
          Configure Inputs
        </h3>

        <div className="space-y-4">
          {/* For non-array based loops */}
          {selectedLoop !== 'for-of' && selectedLoop !== 'forEach' && (
            <>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                  Initialization (i starts at)
                </label>
                <input
                  type="number"
                  value={initVal}
                  onChange={(e) => onInitChange(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg border border-slate-800 bg-[#0a1520] focus:border-cyan-500 text-sm font-mono text-cyan-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                  Terminal Condition (i &lt;)
                </label>
                <input
                  type="number"
                  value={limitVal}
                  onChange={(e) => onLimitChange(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 rounded-lg border border-slate-800 bg-[#0a1520] focus:border-cyan-500 text-sm font-mono text-cyan-300 focus:outline-none"
                />
              </div>

              {selectedLoop !== 'nested' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                    Step / Increment (+1)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stepVal}
                    onChange={(e) => onStepChange(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 rounded-lg border border-slate-800 bg-[#0a1520] focus:border-cyan-500 text-sm font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
              )}

              {selectedLoop === 'nested' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                    Inner Loop Limit (j &lt;)
                  </label>
                  <input
                    type="number"
                    value={innerLimitVal}
                    onChange={(e) => onInnerLimitChange(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 rounded-lg border border-slate-800 bg-[#0a1520] focus:border-cyan-500 text-sm font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
              )}
            </>
          )}

          {/* For array-based loops */}
          {(selectedLoop === 'for-of' || selectedLoop === 'forEach') && (
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                Iterable Array Elements
              </label>
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => onArrayInputC(e.target.value)}
                placeholder="e.g. 10, 20, 30, 40"
                className="w-full p-2.5 rounded-lg border border-slate-800 bg-[#0a1520] focus:border-cyan-500 text-sm font-mono text-cyan-300 focus:outline-none"
              />
              <span className="text-[9px] text-gray-500 block mt-1 font-serif">
                Provide comma-separated numbers or strings.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
