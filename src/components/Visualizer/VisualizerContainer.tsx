import React from 'react'
import { useVisualizer } from '../VisualizerContext'
import { ALGORITHM_METADATA } from '../../data/algorithmMetadata'
import { AlgorithmSelector } from './AlgorithmSelector'
import { InputForm } from './InputForm'
import { PlaybackControls } from './PlaybackControls'
import { StatisticsDisplay } from './StatisticsDisplay'
import { ExplanationPanel } from './ExplanationPanel'
import { PseudocodeViewer } from './PseudocodeViewer'
import { SortingBarsVisualizer } from './SortingBars'
import { SearchArrayVisualizer } from './SearchArray'
import { TreeVisualization } from './TreeVisualization'
import { StackQueueVisualizer } from './StackQueueVisualization'

export const VisualizerContainer: React.FC = () => {
  const { algorithm } = useVisualizer()

  const renderVisualization = () => {
    if (!algorithm) return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Select an algorithm to get started</div>
          <div className="text-sm">Choose from the sidebar on the left</div>
        </div>
      </div>
    )

    const metadata = ALGORITHM_METADATA[algorithm]
    
    switch (metadata.visualizationType) {
      case 'bars':
        return <SortingBarsVisualizer />
      case 'array':
        return <SearchArrayVisualizer />
      case 'tree':
        return <TreeVisualization />
      case 'stack':
      case 'queue':
        return <StackQueueVisualizer />
      default:
        return <div className="p-4 text-gray-400">No visualization available</div>
    }
  }

  return (
    <div className="flex gap-6 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg">
      {/* Left Sidebar */}
      <div className="w-64 flex flex-col gap-4">
        <AlgorithmSelector />
        <InputForm />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Visualization */}
        <div className="flex-1 bg-slate-800/30 rounded-lg min-h-96">
          {renderVisualization()}
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-3 gap-4">
          <PlaybackControls />
          <StatisticsDisplay />
        </div>

        {/* Explanation and Pseudocode Row */}
        <div className="grid grid-cols-2 gap-4">
          <ExplanationPanel />
          <PseudocodeViewer />
        </div>
      </div>
    </div>
  )
}
