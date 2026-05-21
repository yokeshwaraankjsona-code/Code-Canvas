import React from 'react'
import { Search } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="h-14 flex items-center justify-between px-4 glass border-b border-gray-800">
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 rounded-md bg-[#0f1724] text-sm">New</button>
        <div className="hidden md:flex items-center bg-[#071018] rounded p-2 gap-2">
          <Search size={16} />
          <input className="bg-transparent outline-none text-sm text-gray-300" placeholder="Search blocks, algorithms..." />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-300">Dark</div>
      </div>
    </header>
  )
}
