import React from 'react'
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react'
import { useVisualizer } from '../VisualizerContext'

export const PlaybackControls: React.FC = () => {
  const { playbackState, play, pause, nextStep, previousStep, reset, setSpeed } = useVisualizer()

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex gap-2">
        <button
          onClick={() => playbackState.isPlaying ? pause() : play()}
          className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-all flex items-center gap-2"
        >
          {playbackState.isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {playbackState.isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button
          onClick={previousStep}
          className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-all"
        >
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={nextStep}
          className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-all"
        >
          <SkipForward size={20} />
        </button>
        
        <button
          onClick={reset}
          className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-300">
          Step: {playbackState.currentStepIndex + 1} / {playbackState.totalSteps}
        </div>
        <div className="w-full bg-slate-700 h-2 rounded overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all"
            style={{
              width: playbackState.totalSteps > 0 
                ? `${((playbackState.currentStepIndex + 1) / playbackState.totalSteps) * 100}%`
                : '0%'
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-300">Speed: {playbackState.speed.toFixed(1)}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={playbackState.speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
}
