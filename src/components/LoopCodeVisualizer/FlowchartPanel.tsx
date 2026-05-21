import React from 'react'
import { GitBranch } from 'lucide-react'

interface FlowchartPanelProps {
  activeNode: 'start' | 'condition' | 'body' | 'update' | 'end' | 'idle'
  conditionStr?: string
}

export const FlowchartPanel: React.FC<FlowchartPanelProps> = ({
  activeNode,
  conditionStr
}) => {
  // Helper to determine active styling for flowchart nodes
  const getNodeStyles = (nodeName: typeof activeNode) => {
    const isActive = activeNode === nodeName
    return {
      fill: isActive ? 'url(#activeGlowBg)' : '#071018',
      stroke: isActive ? '#22d3ee' : '#1e293b',
      strokeWidth: isActive ? 2.5 : 1.5,
      filter: isActive ? 'url(#glowShadow)' : 'none',
      textColor: isActive ? 'text-cyan-300 font-extrabold shadow shadow-cyan-500/10' : 'text-gray-400 font-medium'
    }
  }

  const startStyle = getNodeStyles('start')
  const conditionStyle = getNodeStyles('condition')
  const bodyStyle = getNodeStyles('body')
  const updateStyle = getNodeStyles('update')
  const endStyle = getNodeStyles('end')

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#061018]/70 p-5 shadow-lg backdrop-blur-sm flex flex-col gap-4 relative overflow-hidden h-[460px]">
      {/* Glossy top edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="text-cyan-400 rotate-90" size={18} />
          <h2 className="text-sm font-bold text-gray-200 tracking-wide font-sans">
            Flowchart Simulation
          </h2>
        </div>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
          SVG Vector Engine
        </span>
      </div>

      {/* Flowchart SVG */}
      <div className="flex-1 flex items-center justify-center bg-[#03090f] rounded-xl border border-slate-900 overflow-hidden relative">
        <svg 
          viewBox="0 0 320 400" 
          className="w-full h-full max-h-[380px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for gradients and glowing shadow filters */}
          <defs>
            {/* Active glow linear gradient background */}
            <linearGradient id="activeGlowBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#083344" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity={0.4} />
            </linearGradient>

            {/* Neon glowing filter shadow */}
            <filter id="glowShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Standard arrowhead definition */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155" />
            </marker>

            {/* Active arrowhead definition */}
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#22d3ee" />
            </marker>
          </defs>

          {/* Flow Paths (Lines & Arrows) */}
          {/* Start to Condition */}
          <line x1="160" y1="50" x2="160" y2="90" stroke={activeNode === 'start' ? '#22d3ee' : '#334155'} strokeWidth={1.5} markerEnd={activeNode === 'start' ? 'url(#arrow-active)' : 'url(#arrow)'} />

          {/* Condition to Body (True path) */}
          <line x1="160" y1="150" x2="160" y2="190" stroke={activeNode === 'condition' ? '#22d3ee' : '#334155'} strokeWidth={1.5} markerEnd={activeNode === 'condition' ? 'url(#arrow-active)' : 'url(#arrow)'} />
          <text x="170" y="175" fill={activeNode === 'condition' ? '#22d3ee' : '#475569'} className="text-[10px] font-mono font-bold select-none">True</text>

          {/* Body to Update */}
          <line x1="160" y1="240" x2="160" y2="280" stroke={activeNode === 'body' ? '#22d3ee' : '#334155'} strokeWidth={1.5} markerEnd={activeNode === 'body' ? 'url(#arrow-active)' : 'url(#arrow)'} />

          {/* Update loop back to Condition */}
          {/* Path curves to left then goes up, then loops back into condition */}
          <path
            d="M 110 305 L 50 305 L 50 120 L 110 120"
            fill="none"
            stroke={activeNode === 'update' ? '#22d3ee' : '#334155'}
            strokeWidth={1.5}
            markerEnd={activeNode === 'update' ? 'url(#arrow-active)' : 'url(#arrow)'}
          />
          <text x="58" y="110" fill={activeNode === 'update' ? '#22d3ee' : '#475569'} className="text-[9px] font-mono font-medium select-none">Repeat</text>

          {/* Condition to End (False path out of right) */}
          <path
            d="M 210 120 L 270 120 L 270 330 L 210 330"
            fill="none"
            stroke={activeNode === 'end' ? '#22d3ee' : '#334155'}
            strokeWidth={1.5}
            markerEnd="url(#arrow)"
          />
          <text x="220" y="110" fill="#475569" className="text-[10px] font-mono font-bold select-none">False</text>

          {/* 1. START NODE (Oval) */}
          <rect
            x="110"
            y="20"
            width="100"
            height="30"
            rx="15"
            fill={startStyle.fill}
            stroke={startStyle.stroke}
            strokeWidth={startStyle.strokeWidth}
            filter={startStyle.filter}
            className="transition-all duration-300"
          />
          <text
            x="160"
            y="39"
            textAnchor="middle"
            fill={activeNode === 'start' ? '#22d3ee' : '#94a3b8'}
            className="text-[11px] font-mono font-bold select-none"
          >
            START
          </text>

          {/* 2. CONDITION NODE (Diamond) */}
          <polygon
            points="160,90 210,120 160,150 110,120"
            fill={conditionStyle.fill}
            stroke={conditionStyle.stroke}
            strokeWidth={conditionStyle.strokeWidth}
            filter={conditionStyle.filter}
            className="transition-all duration-300"
          />
          <text
            x="160"
            y="124"
            textAnchor="middle"
            fill={activeNode === 'condition' ? '#22d3ee' : '#94a3b8'}
            className="text-[10px] font-mono font-bold select-none"
          >
            {conditionStr ? (conditionStr.length > 15 ? `${conditionStr.slice(0, 13)}...` : conditionStr) : 'i < limit'}?
          </text>

          {/* 3. EXECUTE BODY NODE (Rectangle) */}
          <rect
            x="110"
            y="190"
            width="100"
            height="50"
            rx="6"
            fill={bodyStyle.fill}
            stroke={bodyStyle.stroke}
            strokeWidth={bodyStyle.strokeWidth}
            filter={bodyStyle.filter}
            className="transition-all duration-300"
          />
          <text
            x="160"
            y="214"
            textAnchor="middle"
            fill={activeNode === 'body' ? '#22d3ee' : '#94a3b8'}
            className="text-[10px] font-mono font-bold select-none"
          >
            Execute Body
          </text>
          <text
            x="160"
            y="228"
            textAnchor="middle"
            fill={activeNode === 'body' ? '#22d3ee' : '#64748b'}
            className="text-[8px] font-mono select-none"
          >
            Print &amp; Ops
          </text>

          {/* 4. UPDATE STEP NODE (Rectangle) */}
          <rect
            x="110"
            y="280"
            width="100"
            height="50"
            rx="6"
            fill={updateStyle.fill}
            stroke={updateStyle.stroke}
            strokeWidth={updateStyle.strokeWidth}
            filter={updateStyle.filter}
            className="transition-all duration-300"
          />
          <text
            x="160"
            y="304"
            textAnchor="middle"
            fill={activeNode === 'update' ? '#22d3ee' : '#94a3b8'}
            className="text-[10px] font-mono font-bold select-none"
          >
            Increment / Step
          </text>
          <text
            x="160"
            y="318"
            textAnchor="middle"
            fill={activeNode === 'update' ? '#22d3ee' : '#64748b'}
            className="text-[8px] font-mono select-none"
          >
            i++ / i += step
          </text>

          {/* 5. END NODE (Oval) */}
          <rect
            x="110"
            y="345"
            width="100"
            height="30"
            rx="15"
            fill={endStyle.fill}
            stroke={endStyle.stroke}
            strokeWidth={endStyle.strokeWidth}
            filter={endStyle.filter}
            className="transition-all duration-300"
          />
          <text
            x="160"
            y="364"
            textAnchor="middle"
            fill={activeNode === 'end' ? '#22d3ee' : '#94a3b8'}
            className="text-[11px] font-mono font-bold select-none"
          >
            END
          </text>
        </svg>

        {/* Legend overlays */}
        <div className="absolute bottom-3 left-3 bg-[#020508]/80 border border-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[9px] font-mono text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Cyan glows show active logic</span>
        </div>
      </div>
    </div>
  )
}
