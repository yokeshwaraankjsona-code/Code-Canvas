import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function BubbleSortVisualizer() {
  const [arr, setArr] = useState<number[]>([])
  const [playing, setPlaying] = useState(false)
  const [iIdx, setIIdx] = useState(0)
  const [jIdx, setJIdx] = useState(0)

  useEffect(() => {
    reset()
  }, [])

  useEffect(() => {
    let t: any
    if (playing) {
      t = setTimeout(step, 300)
    }
    return () => clearTimeout(t)
  }, [playing, arr, iIdx, jIdx])

  function reset() {
    const a = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 8)
    setArr(a)
    setIIdx(0)
    setJIdx(0)
    setPlaying(false)
  }

  function step() {
    const a = [...arr]
    if (iIdx >= a.length) return setPlaying(false)
    if (jIdx < a.length - iIdx - 1) {
      if (a[jIdx] > a[jIdx + 1]) {
        const tmp = a[jIdx]
        a[jIdx] = a[jIdx + 1]
        a[jIdx + 1] = tmp
        setArr(a)
      }
      setJIdx((s) => s + 1)
    } else {
      setJIdx(0)
      setIIdx((s) => s + 1)
    }
  }

  return (
    <div className="glass p-4 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <button className="px-3 py-1 bg-[#13222b] rounded" onClick={() => setPlaying((s) => !s)}>{playing ? 'Pause' : 'Play'}</button>
        <button className="px-3 py-1 bg-[#13222b] rounded" onClick={reset}>Reset</button>
      </div>

      <div className="flex items-end gap-2 h-48">
        {arr.map((v, idx) => (
          <motion.div key={idx} style={{ height: `${v}%` }} className={`w-6 bg-gradient-to-b from-[#39FF14] to-[#7C3AED] rounded ${idx === jIdx || idx === jIdx+1 ? 'ring-2 ring-neon' : ''}`}>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
