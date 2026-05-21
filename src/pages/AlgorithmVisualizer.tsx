import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { VisualizerContainer } from '../components/Visualizer/VisualizerContainer'
import { usePlaybackLoop } from '../data/usePlaybackLoop'
import MainLayout from '../layouts/MainLayout'

export default function AlgorithmVisualizer() {
  usePlaybackLoop()

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 text-white pb-24" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { display: none; }
        `}} />

        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/app" 
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-700/50 w-fit"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Algorithm Visualizer</h1>
            <p className="text-gray-400">Step-by-step visualization of algorithms and data structures</p>
          </div>
          <VisualizerContainer />
        </div>
      </div>
    </MainLayout>
  )
}
