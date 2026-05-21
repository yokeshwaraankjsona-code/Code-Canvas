import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart2, 
  Network, 
  Layers, 
  Search, 
  Play, 
  Award, 
  Activity, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Cpu,
  BookOpen,
  Repeat
} from 'lucide-react'
import MainLayout from '../layouts/MainLayout'

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 text-white pb-24" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { display: none; }
        `}} />
        <motion.div 
          className="max-w-6xl mx-auto space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="relative rounded-3xl overflow-hidden glass p-8 lg:p-12 border border-slate-700/50 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-2">
                  <Zap size={16} />
                  <span>Interactive Learning Environment</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  Master Algorithms <br/> Visually.
                </h1>
                <p className="text-slate-400 text-lg max-w-xl">
                  Dive into beautifully animated data structures and algorithms. Build your intuition by seeing code come to life.
                </p>
                <div className="pt-4 flex gap-4">
                  <Link to="/visualizer" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 hover:-translate-y-0.5">
                    <Play size={20} fill="currentColor" />
                    Enter Visualizer
                  </Link>
                  <Link to="/exam-mode" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 border border-slate-700 font-semibold hover:bg-slate-700 transition-all hover:-translate-y-0.5 text-amber-400">
                    <BookOpen size={20} className="text-amber-400" />
                    Exam Prep Board
                  </Link>
                  <Link to="/loop-visualizer" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 border border-slate-700 font-semibold hover:bg-slate-700 transition-all hover:-translate-y-0.5 text-cyan-400">
                    <Repeat size={20} className="text-cyan-400" />
                    Loop Tracing
                  </Link>
                </div>
              </div>

              {/* Progress Circle Widget */}
              <div className="w-full md:w-auto flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-800" strokeWidth="8" fill="none" />
                    <motion.circle 
                      cx="50" cy="50" r="40" 
                      className="stroke-indigo-500" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "251.2", strokeDashoffset: "251.2" }}
                      animate={{ strokeDashoffset: "150.72" }} /* 40% completion */
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">40%</span>
                    <span className="text-xs text-slate-400">Mastery</span>
                  </div>
                </div>
                <div className="flex gap-4 text-sm font-medium text-slate-300">
                  <div className="flex items-center gap-1.5"><Award size={16} className="text-yellow-500"/> 4 Modules</div>
                  <div className="flex items-center gap-1.5"><Activity size={16} className="text-green-500"/> 12 Algorithms</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium DSA & Loop Modules Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Exam Mode */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 p-6 flex flex-col justify-between bg-[#050c12]/60 backdrop-blur-sm shadow-xl hover:border-amber-500/40 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <BookOpen size={20} />
                  </div>
                  <div className="inline-flex items-center gap-1 bg-amber-600/15 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20">
                    DSA Classroom Prep
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors">Exam Mode Algorithm dry-run</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Simulate traditional university classroom tracing, blackboard dry-runs, handwritten pass-by-pass steps, and exam-standard grading tables to master DSA algorithms!
                </p>
              </div>
              <div className="pt-6">
                <Link 
                  to="/exam-mode" 
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-950/40 active:scale-[0.98]"
                >
                  <BookOpen size={13} />
                  Start Exam Prep Tracing
                </Link>
              </div>
            </div>

            {/* Card 2: Loop Tracing Sandbox */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 p-6 flex flex-col justify-between bg-[#050c12]/60 backdrop-blur-sm shadow-xl hover:border-cyan-500/40 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Repeat size={20} />
                  </div>
                  <div className="inline-flex items-center gap-1 bg-cyan-600/15 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/20">
                    Interactive Sandbox
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">Loop Tracing & Sandbox</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Master the art of tracing for, while, and nested loops! Step through interactive preset visualizations or write and execute your own custom programs in our code sandbox.
                </p>
              </div>
              <div className="pt-6">
                <Link 
                  to="/loop-visualizer" 
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-950/40 active:scale-[0.98]"
                >
                  <Repeat size={13} />
                  Start Loop Tracing & Sandbox
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Algorithm of the Day */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 relative group rounded-2xl overflow-hidden glass border border-slate-700/50 p-8 cursor-pointer hover:border-emerald-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                    Algorithm of the Day
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Merge Sort</h2>
                  <p className="text-slate-400 mb-6 max-w-md">
                    A highly efficient, general-purpose sorting algorithm based on the divide and conquer principle.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">O(n log n) Time</span>
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">O(n) Space</span>
                  </div>
                  <Link to="/visualizer" className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                    <Play size={18} fill="currentColor" className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-span-1 rounded-2xl glass border border-slate-700/50 p-6 flex flex-col justify-between">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold flex items-center gap-2"><TrendingUp size={20} className="text-blue-400"/> Recent Activity</h3>
               </div>
               <div className="space-y-4 flex-1">
                 {[
                   { name: 'Binary Search', time: '2 hours ago', icon: Search, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                   { name: 'Bubble Sort', time: 'Yesterday', icon: BarChart2, color: 'text-rose-400', bg: 'bg-rose-400/10' },
                   { name: 'Tree Traversal', time: '3 days ago', icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
                 ].map((activity, i) => (
                   <Link to="/visualizer" key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.bg} ${activity.color}`}>
                       <activity.icon size={20} />
                     </div>
                     <div className="flex-1">
                       <div className="font-medium text-sm text-slate-200">{activity.name}</div>
                       <div className="text-xs text-slate-500">{activity.time}</div>
                     </div>
                     <ChevronRight size={16} className="text-slate-600" />
                   </Link>
                 ))}
               </div>
            </div>
          </motion.div>

          {/* Categories Grid */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Cpu size={24} className="text-indigo-400"/> Explore Modules</h2>
              <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { title: 'Sorting', desc: 'Organize data efficiently', icon: BarChart2, color: 'from-orange-500 to-rose-500', shadow: 'shadow-orange-500/20', path: '/visualizer' },
                { title: 'Searching', desc: 'Find elements quickly', icon: Search, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20', path: '/visualizer' },
                { title: 'Data Structures', desc: 'Stacks, Queues, & more', icon: Layers, color: 'from-purple-500 to-indigo-500', shadow: 'shadow-purple-500/20', path: '/visualizer' },
                { title: 'Loop Tracing', desc: 'Master for, while & nested loops', icon: Repeat, color: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/20', path: '/loop-visualizer' },
                { title: 'Graphs & Trees', desc: 'Traverse complex networks', icon: Network, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20', path: '/visualizer' }
              ].map((cat, i) => (
                <Link to={cat.path} key={i} className={`group relative overflow-hidden rounded-2xl glass border border-slate-700/50 p-6 hover:border-slate-500/50 transition-all hover:-translate-y-1 hover:shadow-lg ${cat.shadow}`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none`}></div>
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-lg`}>
                    <cat.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-slate-200">{cat.title}</h3>
                  <p className="text-sm text-slate-400">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </MainLayout>
  )
}
