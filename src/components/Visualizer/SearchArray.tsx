import React from 'react'
import { useVisualizer } from '../VisualizerContext'

export const SearchArrayVisualizer: React.FC = () => {
  const { algorithmState, playbackState } = useVisualizer()
  const data = algorithmState?.data || []
  const currentStep = algorithmState?.history[playbackState.currentStepIndex]

  const isActive = (idx: number) => currentStep?.indices?.includes(idx)

  return (
    <div className="p-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-lg h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Array Visualization</h3>
      <div className="flex gap-2 flex-wrap flex-1 items-center justify-center">
        {data.map((val, idx) => (
          <div
            key={idx}
            className={`w-14 h-14 rounded flex items-center justify-center text-white font-bold transition-all ${
              isActive(idx)
                ? currentStep?.action === 'compare'
                  ? 'bg-yellow-500 ring-2 ring-yellow-300 shadow-lg'
                  : currentStep?.action === 'found'
                  ? 'bg-green-500 ring-2 ring-green-300 shadow-lg scale-110'
                  : 'bg-cyan-500 ring-2 ring-cyan-300 shadow-lg'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {val}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-4">
        Comparisons: {algorithmState?.comparisons || 0}
      </div>
    </div>
  )
}
