import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVisualizer } from '../VisualizerContext'
import { MergeTreeNode } from '../../data/MergeSort'

export const MergeSortTreeVisualizer: React.FC = () => {
  const { algorithmState, playbackState } = useVisualizer()
  const [examMode, setExamMode] = useState(false)

  const currentStep = algorithmState?.history[playbackState.currentStepIndex]
  const treeNodes: MergeTreeNode[] = currentStep?.visualizationState?.treeNodes || []
  
  // Group nodes by level for layout
  const maxLevel = treeNodes.length > 0 ? Math.max(...treeNodes.map(n => n.level)) : 0
  const levels = Array.from({ length: maxLevel + 1 }, (_, i) => {
    return treeNodes.filter(n => n.level === i).sort((a, b) => a.leftIdx - b.leftIdx)
  })

  // Get color for element based on status
  const getElementColor = (status?: string) => {
    switch (status) {
      case 'compare': return 'bg-yellow-500 border-yellow-300 text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
      case 'merged': return 'bg-emerald-600 border-emerald-400 text-white'
      default: return 'bg-slate-700 border-slate-500 text-slate-100'
    }
  }

  // Get node container styling based on status
  const getNodeStyling = (status: string) => {
    switch (status) {
      case 'active': return 'ring-2 ring-cyan-500/50'
      case 'split': return 'opacity-50 grayscale-[50%]'
      case 'merging': return 'ring-2 ring-yellow-500/80 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
      case 'sorted': return 'ring-2 ring-emerald-500/50'
      default: return ''
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50 p-4 rounded-lg relative overflow-hidden">
      {/* Header / Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-200">Merge Sort Recursion Tree</h3>
        <button
          onClick={() => setExamMode(!examMode)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            examMode 
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          {examMode ? '🎓 Exam Mode Active' : '🎬 Animation Mode'}
        </button>
      </div>

      {/* Tree Container */}
      <div className="flex-1 overflow-auto flex flex-col items-center gap-10 p-4 min-h-[500px]">
        <AnimatePresence mode="popLayout">
          {levels.map((levelNodes, levelIdx) => (
            <motion.div 
              key={`level-${levelIdx}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-center items-start gap-12 w-full relative"
            >
              {levelNodes.map(node => (
                <div key={node.id} className="flex flex-col items-center gap-2">
                  
                  {/* Bracket for Exam Mode (Top) */}
                  {examMode && node.status === 'split' && (
                    <div className="text-purple-400 text-xs font-mono animate-pulse">
                      split({node.leftIdx}, {node.rightIdx})
                    </div>
                  )}

                  {/* Array Node */}
                  <motion.div
                    layout
                    className={`flex items-center gap-1 p-2 rounded-xl bg-slate-800/80 backdrop-blur border border-slate-700 transition-all duration-300 ${getNodeStyling(node.status)}`}
                  >
                    {node.elements.length === 0 ? (
                      <div className="h-10 w-10 flex items-center justify-center text-slate-500 italic text-sm">
                        ...
                      </div>
                    ) : (
                      <AnimatePresence>
                        {node.elements.map((el, i) => (
                          <motion.div
                            key={el.id}
                            layoutId={el.id}
                            initial={!examMode ? { scale: 0, opacity: 0 } : false}
                            animate={!examMode ? { scale: 1, opacity: 1 } : false}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 font-bold text-sm ${getElementColor(el.status)}`}
                          >
                            {el.val}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </motion.div>

                  {/* Bracket for Exam Mode (Bottom) */}
                  {examMode && node.status === 'merging' && (
                    <div className="text-yellow-400 text-xs font-mono">
                      merge({node.leftIdx}, {node.rightIdx})
                    </div>
                  )}
                  {examMode && node.status === 'sorted' && levelIdx > 0 && (
                    <div className="text-emerald-400 text-xs font-mono">
                      merged
                    </div>
                  )}

                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-md backdrop-blur border border-slate-800">
        Nodes Active: {treeNodes.length} • Max Depth: {maxLevel}
      </div>
    </div>
  )
}
