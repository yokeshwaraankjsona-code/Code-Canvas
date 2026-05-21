import React from 'react'

export default function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-md border border-gray-800 px-4 py-2 ${className}`}>{children}</div>
  )
}
