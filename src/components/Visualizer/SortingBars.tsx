import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useVisualizer } from '../VisualizerContext'

export const SortingBarsVisualizer: React.FC = () => {
  const { algorithmState, playbackState } = useVisualizer()

  const currentStep = algorithmState?.history[playbackState.currentStepIndex]
  const data = currentStep?.visualizationState?.data || algorithmState?.data || []
  const visualData = currentStep?.visualizationState?.visualData || data.map((val: number, idx: number) => ({ id: `id-${idx}`, val }))
  const max = useMemo(() => Math.max(...data, 1), [data])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02 }
    }
  }

  const barVariants = {
    hidden: { scaleY: 0 },
    visible: { scaleY: 1 }
  }

  const getBarColor = (idx: number) => {
    if (currentStep?.visualizationState?.sorted) {
      return 'from-green-400 to-emerald-600'
    }

    const sortedFrom = currentStep?.visualizationState?.sortedFrom
    if (sortedFrom && idx >= sortedFrom) {
      return 'from-green-400 to-emerald-600' // Already sorted
    }
    
    if (currentStep?.indices?.includes(idx)) {
      if (currentStep.action === 'swap') {
        return 'from-red-400 to-red-600' // Swapping
      }
      if (currentStep.action === 'compare' || currentStep.action === 'merge') {
        return 'from-yellow-400 to-amber-500' // Comparing or merging
      }
      if (currentStep.action === 'merge_step') {
        return 'from-green-400 to-emerald-500' // Placed element during merge
      }
      if (currentStep.action === 'split') {
        return 'from-purple-400 to-pink-600' // Splitting range
      }
    }
    
    return 'from-cyan-400 via-blue-500 to-purple-600' // Normal
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-lg h-full relative overflow-hidden">
      <div className="flex-1 flex items-end justify-center gap-1 bg-slate-700/20 rounded p-4">
        <motion.div
          className="flex items-end justify-center gap-1 h-full flex-1 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data.map((value: number, idx: number) => {
            const barId = visualData[idx]?.id || `fallback-${idx}`;
            return (
            <motion.div
              key={barId}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`flex-1 bg-gradient-to-b ${getBarColor(idx)} rounded-sm cursor-pointer transition-colors shadow-lg max-w-[40px]`}
              style={{
                height: `${(value / max) * 100}%`,
                opacity: 0.85
              }}
              variants={barVariants}
              whileHover={{ opacity: 1 }}
              layoutId={barId}
              animate={{
                opacity: currentStep?.indices?.includes(idx) ? 1 : 0.7,
                boxShadow: currentStep?.indices?.includes(idx) 
                  ? '0 0 20px rgba(255,255,255,0.5)' 
                  : '0 0 0px rgba(0,0,0,0)'
              }}
            >
              <div className="text-xs text-white font-bold text-center pt-1">{value}</div>
            </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="text-xs text-gray-400">
        {data.length} elements • Comparisons: {algorithmState?.comparisons || 0} • Swaps: {algorithmState?.swaps || 0}
      </div>
    </div>
  )
}
