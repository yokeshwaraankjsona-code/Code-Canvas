import React from 'react'
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react'

interface LoopControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onReset: () => void
  speed: number
  onSpeedChange: (speed: number) => void
  currentStep: number
  totalSteps: number
}

export const LoopControls: React.FC<LoopControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass border border-slate-800 bg-[#061018]/60 backdrop-blur-md shadow-lg shadow-cyan-950/10">
      {/* Player Navigation Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="p-2.5 rounded-lg border border-slate-800 bg-[#0a1520] hover:bg-[#102030] text-gray-400 hover:text-white transition duration-300 relative group"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={onStepBackward}
          disabled={currentStep === 0}
          className="p-2.5 rounded-lg border border-slate-800 bg-[#0a1520] hover:bg-[#102030] text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition duration-300"
          title="Step Backward"
        >
          <ChevronLeft size={16} />
        </button>

        {isPlaying ? (
          <button
            onClick={onPause}
            className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-semibold flex items-center gap-2 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 hover:scale-[1.02] transition duration-300"
          >
            <Pause size={16} fill="currentColor" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={totalSteps === 0 || currentStep === totalSteps - 1}
            className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.02] disabled:opacity-30 disabled:pointer-events-none transition duration-300"
          >
            <Play size={16} fill="currentColor" />
            <span>Start Loop</span>
          </button>
        )}

        <button
          onClick={onStepForward}
          disabled={totalSteps === 0 || currentStep === totalSteps - 1}
          className="p-2.5 rounded-lg border border-slate-800 bg-[#0a1520] hover:bg-[#102030] text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition duration-300"
          title="Step Forward"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Progress & Speed Slider */}
      <div className="flex items-center gap-6 w-full md:w-auto flex-1 md:justify-end">
        <div className="text-xs font-mono text-gray-400 min-w-[100px] text-right">
          Step <span className="text-cyan-400 font-bold">{currentStep + 1}</span> / {totalSteps || 1}
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-[200px] md:flex-initial md:w-44">
          <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Speed</span>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-[#0a1520] rounded-lg appearance-none cursor-pointer accent-cyan-500 border border-slate-800"
          />
          <span className="text-[10px] font-mono text-cyan-400 font-bold min-w-[40px]">
            {speed}ms
          </span>
        </div>
      </div>
    </div>
  )
}
