import React, { useState, useEffect } from 'react'
import { useVisualizer } from '../VisualizerContext'

export const InputForm: React.FC = () => {
  const { algorithm, setInputData, searchTarget, setSearchTarget } = useVisualizer()
  const [inputValue, setInputValue] = useState('64, 34, 25, 12, 22, 11, 90, 88, 45, 50')
  const [targetValue, setTargetValue] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isSearchAlgo = algorithm === 'linear-search' || algorithm === 'binary-search'

  useEffect(() => {
    if (searchTarget !== null && searchTarget !== undefined) {
      setTargetValue(searchTarget.toString())
    }
  }, [searchTarget])

  const handleSubmit = () => {
    try {
      const numbers = inputValue
        .split(',')
        .map(s => {
          const num = parseInt(s.trim())
          if (isNaN(num)) throw new Error(`Invalid number: ${s}`)
          if (num < 0 || num > 1000) throw new Error(`Number out of range (0-1000): ${num}`)
          return num
        })
      
      if (numbers.length === 0) {
        setError('Please enter at least one number')
        return
      }
      
      if (numbers.length > 100) {
        setError('Maximum 100 elements allowed')
        return
      }

      let parsedTarget = null;
      if (isSearchAlgo && targetValue.trim() !== '') {
        const targetNum = parseInt(targetValue.trim())
        if (isNaN(targetNum)) {
          setError('Invalid target number')
          return
        }
        parsedTarget = targetNum;
      }
      
      setError('')
      setSuccess(true)
      if (isSearchAlgo) {
        setSearchTarget(parsedTarget)
      }
      setInputData(numbers)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input')
      setSuccess(false)
    }
  }

  const handleRandom = () => {
    const size = Math.floor(Math.random() * 11) + 5 // 5-15 elements
    const random = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
    setInputValue(random.join(', '))
    if (isSearchAlgo) {
      setTargetValue(random[Math.floor(Math.random() * random.length)].toString())
    }
  }

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mt-4">
      <h3 className="text-sm font-semibold text-white mb-2">Input Data</h3>
      <div className="space-y-3">
        <textarea
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setError(''); setSuccess(false); }}
          placeholder="Enter comma-separated numbers (0-1000)"
          className="w-full h-24 p-2 bg-slate-700 text-white rounded text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {isSearchAlgo && (
          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-1">Search Target</h3>
            <input
              type="text"
              value={targetValue}
              onChange={(e) => { setTargetValue(e.target.value); setError(''); setSuccess(false); }}
              placeholder="Target to search for"
              className="w-full p-2 bg-slate-700 text-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {error && <div className="text-xs text-red-400 mt-2 flex items-center gap-1">⚠️ {error}</div>}
      {success && <div className="text-xs text-green-400 mt-2 flex items-center gap-1">✓ Data loaded successfully</div>}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded text-sm font-medium transition-all active:scale-95"
        >
          Load Data
        </button>
        <button
          onClick={handleRandom}
          className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded text-sm font-medium transition-all active:scale-95"
        >
          Random
        </button>
      </div>
    </div>
  )
}
