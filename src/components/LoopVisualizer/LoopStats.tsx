import React from 'react'
import { Activity, Clock } from 'lucide-react'

interface LoopStatsProps {
  loopType: string
  totalIterations: number
  totalSteps: number
  timeComplexity: string
  logs: string[]
}

export const LoopStats: React.FC<LoopStatsProps> = ({
  loopType,
  totalIterations,
  totalSteps,
  timeComplexity,
  logs
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Complexity & Summary Grid */}
      <div className="rounded-2xl border border-slate-800 bg-[#061018]/60 p-4 shadow-md">
        <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono mb-3 flex items-center gap-1.5">
          <Clock size={14} />
          <span>Complexity & Summary</span>
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-3 border border-slate-800 bg-[#0a1520] rounded-xl">
            <span className="text-[10px] text-gray-500 font-mono block">Time Complexity</span>
            <span className="text-md font-mono text-cyan-400 font-bold">{timeComplexity}</span>
          </div>

          <div className="p-3 border border-slate-800 bg-[#0a1520] rounded-xl">
            <span className="text-[10px] text-gray-500 font-mono block">Auxiliary Space</span>
            <span className="text-md font-mono text-emerald-400 font-bold">O(1)</span>
          </div>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between p-2 border-b border-slate-800/40">
            <span className="text-gray-500">Total Iterations</span>
            <span className="text-gray-300 font-bold">{totalIterations}</span>
          </div>
          <div className="flex justify-between p-2 border-b border-slate-800/40">
            <span className="text-gray-500">Execution Steps</span>
            <span className="text-gray-300 font-bold">{totalSteps}</span>
          </div>
        </div>
      </div>

      {/* 2. Live Console Logs */}
      <div className="rounded-2xl border border-slate-800 bg-[#061018]/60 p-4 shadow-md flex-1 flex flex-col min-h-[160px] max-h-[300px]">
        <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono mb-3 flex items-center gap-1.5">
          <Activity size={14} />
          <span>Live Console Output</span>
        </h3>

        <div 
          className="flex-1 font-mono text-[10px] bg-[#02070c] border border-slate-900 rounded-xl p-3 overflow-y-auto space-y-1.5 text-slate-400"
          style={{ scrollbarWidth: 'thin' }}
        >
          {logs.map((log, idx) => (
            <div key={`log-${idx}`} className="flex gap-2">
              <span className="text-slate-600 select-none">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-slate-600 italic">Console is awaiting execution...</div>
          )}
        </div>
      </div>
    </div>
  )
}
