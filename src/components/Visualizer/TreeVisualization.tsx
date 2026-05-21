import React from 'react'
import { useVisualizer } from '../VisualizerContext'

export const TreeVisualization: React.FC = () => {
  const { algorithmState } = useVisualizer()
  
  return (
    <div className="p-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Tree Visualization</h3>
      <div className="text-center text-gray-400">Tree visualization coming soon</div>
    </div>
  )
}
