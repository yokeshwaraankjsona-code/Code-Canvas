import React from 'react'
import { useVisualizer } from '../VisualizerContext'

export const ExplanationPanel: React.FC = () => {
  const { currentExplanation } = useVisualizer()

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 min-h-20">
      <h3 className="text-sm font-semibold text-white mb-2">Explanation</h3>
      <p className="text-sm text-gray-300 leading-relaxed">{currentExplanation}</p>
    </div>
  )
}
