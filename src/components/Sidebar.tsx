import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Layers, Play, Repeat } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  const linkStyles = (path: string) => 
    `p-2.5 rounded-xl transition duration-300 relative group flex items-center justify-center ${
      isActive(path)
        ? 'bg-[#152737] text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
        : 'text-gray-400 hover:text-slate-100 hover:bg-[#0c1a26]'
    }`

  return (
    <aside className="w-20 bg-[#061018] border-r border-gray-800 p-3 flex flex-col items-center gap-6 z-20 shrink-0">
      {/* Logo */}
      <div className="relative group cursor-pointer">
        <div className="absolute inset-0 bg-cyan-500 rounded-full blur-[8px] opacity-35 group-hover:opacity-60 transition duration-300"></div>
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg border border-cyan-400/20">
          CC
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 flex flex-col items-center gap-5 mt-6 w-full">
        {/* Dashboard Link */}
        <Link to="/app" className={linkStyles('/app')} title="Dashboard">
          <Home size={20} />
          {isActive('/app') && (
            <span className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-md"></span>
          )}
        </Link>

        {/* Algorithm Visualizer Link */}
        <Link to="/visualizer" className={linkStyles('/visualizer')} title="Algorithm Visualizer">
          <Play size={20} />
          {isActive('/visualizer') && (
            <span className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-md"></span>
          )}
        </Link>

        {/* Loop Visualizer Link */}
        <Link to="/loop-visualizer" className={linkStyles('/loop-visualizer')} title="Loop Visualizer">
          <Repeat size={20} />
          {isActive('/loop-visualizer') && (
            <span className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-md"></span>
          )}
        </Link>

        {/* Exam prep Mode Link */}
        <Link to="/exam-mode" className={linkStyles('/exam-mode')} title="Exam Tracing Mode">
          <Layers size={20} className={isActive('/exam-mode') ? 'text-amber-400' : 'text-gray-400 group-hover:text-amber-300'} />
          {isActive('/exam-mode') && (
            <span className="absolute left-0 w-1 h-6 bg-amber-400 rounded-r-md"></span>
          )}
        </Link>
      </nav>
    </aside>
  )
}
