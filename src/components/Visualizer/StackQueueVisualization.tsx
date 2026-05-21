import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVisualizer } from '../VisualizerContext'
import { ArrowDown, ArrowUp, ArrowRight, ArrowLeft } from 'lucide-react'

export const StackQueueVisualizer: React.FC = () => {
  const { algorithmState, playbackState, algorithm } = useVisualizer()
  const currentStep = algorithmState?.history[playbackState.currentStepIndex]
  const contents = currentStep?.visualizationState?.stackContents || currentStep?.visualizationState?.queueContents || []
  const data = algorithmState?.data || []

  const isStack = algorithm?.includes('stack')
  const action = currentStep?.action

  // Determine animations
  const getInitial = () => {
    if (isStack) return { y: -60, opacity: 0, scale: 0.8 }
    return { x: 60, opacity: 0, scale: 0.8 }
  }

  const getExit = () => {
    if (isStack) return { y: -60, opacity: 0, scale: 0.8 }
    return { x: -60, opacity: 0, scale: 0.8 }
  }

  // Find head offset to generate stable keys for Queue layout sliding
  const headOffset = useMemo(() => {
    if (isStack || contents.length === 0) return 0;
    for (let i = 0; i <= data.length - contents.length; i++) {
      let match = true;
      for (let j = 0; j < contents.length; j++) {
        if (data[i + j] !== contents[j]) {
          match = false;
          break;
        }
      }
      if (match) return i;
    }
    return 0;
  }, [contents, data, isStack])

  return (
    <div className="p-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-lg h-full flex flex-col relative overflow-hidden">
      <h3 className="text-lg font-semibold text-white mb-4">{isStack ? 'Stack' : 'Queue'} Visualization</h3>
      
      {/* Action Indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        {action === 'push' && <span className="text-emerald-400 font-bold flex items-center gap-1"><ArrowDown size={18}/> PUSH</span>}
        {action === 'pop' && <span className="text-rose-400 font-bold flex items-center gap-1"><ArrowUp size={18}/> POP</span>}
        {action === 'enqueue' && <span className="text-emerald-400 font-bold flex items-center gap-1">ENQUEUE <ArrowLeft size={18}/></span>}
        {action === 'dequeue' && <span className="text-rose-400 font-bold flex items-center gap-1"><ArrowLeft size={18}/> DEQUEUE</span>}
      </div>

      <div className="flex-1 flex items-center justify-center pt-8 px-4">
        <div className={`flex ${isStack ? 'flex-col-reverse' : 'flex-row'} gap-3 relative`}>
          
          {/* Stack Container Borders */}
          {isStack && (
            <div className="absolute -inset-x-4 -bottom-4 top-0 border-b-4 border-l-4 border-r-4 border-slate-600 rounded-b-xl pointer-events-none"></div>
          )}
          
          {/* Queue Container Borders */}
          {!isStack && (
            <div className="absolute -inset-y-4 -left-2 -right-2 border-t-4 border-b-4 border-slate-600 pointer-events-none"></div>
          )}

          <AnimatePresence mode="popLayout">
            {contents.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-slate-500 font-medium py-4 px-8"
              >
                Empty
              </motion.div>
            ) : (
              contents.map((val: number, idx: number) => {
                const stableKey = isStack ? idx : headOffset + idx;
                
                let isHighlighted = false;
                let bgColor = 'bg-gradient-to-b from-purple-500 to-indigo-600';
                
                if (isStack) {
                  if (idx === contents.length - 1 && action === 'push') bgColor = 'bg-emerald-500 ring-4 ring-emerald-300/50';
                  if (idx === contents.length - 1 && action === 'pop') bgColor = 'bg-rose-500 ring-4 ring-rose-300/50';
                } else {
                  if (idx === contents.length - 1 && action === 'enqueue') bgColor = 'bg-emerald-500 ring-4 ring-emerald-300/50';
                  if (idx === 0 && action === 'dequeue') bgColor = 'bg-rose-500 ring-4 ring-rose-300/50';
                }

                return (
                  <motion.div
                    key={stableKey}
                    layout
                    initial={getInitial()}
                    animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    exit={getExit()}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`w-16 h-16 ${bgColor} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/10 z-10`}
                  >
                    {val}
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 mt-12 text-center font-mono bg-slate-900/50 py-2 rounded-lg border border-slate-800">
        SIZE: {contents.length} | ACTION: {action?.toUpperCase() || 'IDLE'}
      </div>
    </div>
  )
}
