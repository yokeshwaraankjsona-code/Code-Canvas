import React from 'react'
import { useVisualizer } from '../VisualizerContext'

export const StatisticsDisplay: React.FC = () => {
  const { algorithmState, playbackState, algorithm } = useVisualizer()
  
  if (!algorithm || !algorithmState) return null;

  const currentStep = algorithmState.history[playbackState.currentStepIndex];

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <h3 className="text-sm font-semibold text-white mb-3">Statistics</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-700/50 p-2 rounded">
          <div className="text-gray-400">Comparisons</div>
          <div className="text-lg font-bold text-cyan-400">{currentStep?.comparisons || 0}</div>
        </div>
        <div className="bg-slate-700/50 p-2 rounded">
          <div className="text-gray-400">Swaps</div>
          <div className="text-lg font-bold text-pink-400">{currentStep?.swaps || 0}</div>
        </div>
        <div className="bg-slate-700/50 p-2 rounded">
          <div className="text-gray-400">Operations</div>
          <div className="text-lg font-bold text-purple-400">{currentStep?.operations || 0}</div>
        </div>
        <div className="bg-slate-700/50 p-2 rounded">
          <div className="text-gray-400">Step</div>
          <div className="text-lg font-bold text-green-400">{playbackState.currentStepIndex + 1} / {playbackState.totalSteps}</div>
        </div>
      </div>
    </div>
  )
}
