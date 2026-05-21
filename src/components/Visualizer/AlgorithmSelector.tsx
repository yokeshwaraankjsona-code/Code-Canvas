import React from 'react'
import { useVisualizer } from '../VisualizerContext'
import { ALGORITHM_METADATA } from '../../data/algorithmMetadata'

export const AlgorithmSelector: React.FC = () => {
  const { algorithm, selectAlgorithm } = useVisualizer()

  const categories = {
    sorting: [] as Array<[string, any]>,
    searching: [] as Array<[string, any]>,
    'data-structure': [] as Array<[string, any]>,
    graph: [] as Array<[string, any]>
  }

  Object.entries(ALGORITHM_METADATA).forEach(([key, metadata]) => {
    categories[metadata.category as keyof typeof categories].push([key, metadata])
  })

  return (
    <div className="w-64 flex flex-col gap-4">
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h2 className="text-lg font-bold text-white mb-4">Algorithms</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(categories).map(([category, items]) => (
            items.length > 0 && (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">{category}</h3>
                <div className="space-y-2">
                  {items.map(([key, metadata]) => (
                    <button
                      key={key}
                      onClick={() => selectAlgorithm(key as any)}
                      className={`w-full text-left p-2 rounded text-sm transition-all ${
                        algorithm === key
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      <div className="font-medium">{metadata.name}</div>
                      <div className="text-xs text-gray-400">{metadata.timeComplexity}</div>
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
