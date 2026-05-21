import React, { useEffect, useRef } from 'react'
import { Terminal, Trash2 } from 'lucide-react'

interface OutputConsoleProps {
  stdout: string[]
  onClear?: () => void
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({
  stdout,
  onClear
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [stdout])

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#040c12]/80 p-5 shadow-lg backdrop-blur-sm flex flex-col gap-3 relative overflow-hidden h-[180px]">
      {/* Glossy top edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Terminal Title */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase text-cyan-400 tracking-wider">
          <Terminal size={14} />
          <span>Stdout Output Console</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
            TTY Sandbox Active
          </span>
          {onClear && stdout.length > 0 && (
            <button
              onClick={onClear}
              className="p-1 rounded text-gray-500 hover:text-rose-400 hover:bg-slate-900 transition duration-200"
              title="Clear terminal"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed text-slate-300 bg-[#020609] border border-slate-900 rounded-xl p-3.5 space-y-1.5 scrollbar-thin"
        style={{ scrollbarWidth: 'thin' }}
      >
        {stdout.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-slate-600 italic">
            <span>stdout console is empty. Start loop tracing to print values.</span>
          </div>
        ) : (
          stdout.map((line, idx) => (
            <div key={`stdout-line-${idx}`} className="flex items-start gap-2 hover:bg-slate-900/40 py-0.5 px-1 rounded transition duration-150">
              <span className="text-emerald-500 font-bold select-none">&gt;</span>
              <span className="font-semibold text-gray-200">{line}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
