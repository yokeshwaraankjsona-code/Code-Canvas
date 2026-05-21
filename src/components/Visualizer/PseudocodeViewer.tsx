import React from 'react'
import { useVisualizer } from '../VisualizerContext'

export const PseudocodeViewer: React.FC = () => {
  const { pseudocode } = useVisualizer()

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-semibold text-white mb-2">Pseudocode</h3>
      <div className="font-mono text-xs space-y-1">
        {pseudocode.map((line) => (
          <div
            key={line.lineNumber}
            className={`p-1 rounded transition-all ${
              line.isHighlighted
                ? 'bg-yellow-500/30 text-yellow-300 border-l-2 border-yellow-500'
                : 'text-gray-400'
            }`}
          >
            <span className="text-gray-600 mr-2">{line.lineNumber}</span>
            {line.code}
          </div>
        ))}
      </div>
    </div>
  )
}
