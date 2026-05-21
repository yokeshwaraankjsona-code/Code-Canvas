import React from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 bg-[#071018] p-4">{children}</main>
      </div>
    </div>
  )
}
