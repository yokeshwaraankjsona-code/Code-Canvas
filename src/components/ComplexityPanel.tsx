import React from 'react'

export default function ComplexityPanel({ info }: { info?: any }) {
  return (
    <div className="glass p-4 rounded-lg w-64 neon-glow">
      <div className="text-sm font-semibold mb-2">Complexity</div>
      <div className="text-xs text-gray-300">Time: <span className="font-medium">{info?.time || 'O(n)'}</span></div>
      <div className="text-xs text-gray-300">Space: <span className="font-medium">{info?.space || 'O(1)'}</span></div>
      <div className="text-xs text-gray-300 mt-2">Steps: <span className="font-medium">{info?.steps ?? 0}</span></div>
      <div className="text-xs text-gray-300">Status: <span className="font-medium">{info?.status || 'Idle'}</span></div>
    </div>
  )
}
