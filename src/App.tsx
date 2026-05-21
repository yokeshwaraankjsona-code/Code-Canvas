import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AlgorithmVisualizer from './pages/AlgorithmVisualizer'
import ExamMode from './pages/ExamMode'
import LoopVisualizer from './pages/LoopVisualizer'
import { VisualizerProvider } from './components/VisualizerContext'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Dashboard />} />
        <Route 
          path="/visualizer" 
          element={
            <VisualizerProvider>
              <AlgorithmVisualizer />
            </VisualizerProvider>
          } 
        />
        <Route path="/exam-mode" element={<ExamMode />} />
        <Route path="/loop-visualizer" element={<LoopVisualizer />} />
      </Routes>
    </BrowserRouter>
  )
}
