import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import MainLayout from '../layouts/MainLayout'

export default function Landing() {
  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 pb-24" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { display: none; }
        `}} />
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <header className="w-full max-w-6xl flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">CodeCanvas</h1>
            <nav className="space-x-4">
              <a href="#features" className="text-sm text-gray-300">Features</a>
              <a href="/visualizer" className="text-sm text-gray-300">Visualizer</a>
              <a href="/app" className="text-sm text-gray-300">Open App</a>
            </nav>
          </header>

          <main className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <section>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-extrabold text-white leading-tight"
              >
                Visual programming for learning and prototyping
              </motion.h2>
              <p className="mt-6 text-gray-300 max-w-lg">
                Build algorithms with draggable blocks, watch execution step-by-step, and explore complexities — all in a futuristic, interactive workspace.
              </p>
              <div className="mt-8 flex gap-4">
                <Button as="a" href="/visualizer">Algorithm Visualizer</Button>
                <Button as="a" href="/app">Open Dashboard</Button>
              </div>
            </section>

            <section className="relative">
              <div className="glass rounded-2xl p-6 neon-glow">
                <div className="h-80 bg-gradient-to-br from-[#071013] to-[#071021] rounded-xl grid-bg flex items-center justify-center">
                  <p className="text-sm text-gray-400">Animated workspace preview</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </MainLayout>
  )
}
