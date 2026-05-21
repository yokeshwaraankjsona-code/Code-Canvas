import React, { useState } from 'react'

export default function BinarySearchVisualizer() {
  const [arr, setArr] = useState<number[]>([3, 7, 12, 19, 23, 31, 45, 56])
  const [target, setTarget] = useState(23)
  const [low, setLow] = useState(0)
  const [high, setHigh] = useState(arr.length - 1)
  const [mid, setMid] = useState<number | null>(null)

  function reset() {
    setLow(0)
    setHigh(arr.length - 1)
    setMid(null)
  }

  function step() {
    if (low > high) return setMid(null)
    const m = Math.floor((low + high) / 2)
    setMid(m)
    if (arr[m] === target) return
    if (arr[m] < target) setLow(m + 1)
    else setHigh(m - 1)
  }

  return (
    <div className="glass p-4 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <button className="px-3 py-1 bg-[#13222b] rounded" onClick={step}>Step</button>
        <button className="px-3 py-1 bg-[#13222b] rounded" onClick={reset}>Reset</button>
      </div>
      <div className="flex gap-3">
        {arr.map((v, i) => (
          <div key={i} className={`px-3 py-6 rounded ${i === mid ? 'bg-[#7C3AED] text-white' : 'bg-[#071018] text-gray-300'}`}>
            {v}
          </div>
        ))}
      </div>
    </div>
  )
}
