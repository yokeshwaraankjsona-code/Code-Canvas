import React, { useState } from 'react'
import { FileSpreadsheet, Edit3 } from 'lucide-react'
import { LoopExecutionStep } from '../../utils/customLoopParser'

interface ExamTableProps {
  steps: LoopExecutionStep[]
  currentStepIndex: number
  loopVar: string
}

export const ExamTable: React.FC<ExamTableProps> = ({
  steps,
  currentStepIndex,
  loopVar
}) => {
  const [subTab, setSubTab] = useState<'handwritten' | 'tabular'>('handwritten')

  // Generate standard trace row records from timeline up to the current step
  const getTableRows = () => {
    const rows: Array<{
      pass: number
      varValue: string
      condition: string
      output: string
      status: string
    }> = []

    steps.slice(0, currentStepIndex + 1).forEach((step, idx) => {
      // Look for condition check frames to extract condition
      if (step.flowchartNode === 'condition') {
        const loopVal = step.variables[loopVar] !== undefined ? String(step.variables[loopVar]) : 'N/A'
        
        // Find corresponding print/output inside this iteration if any
        let printOut = '-'
        // Look ahead to find prints in the same iteration
        for (let j = idx; j < steps.length && j <= currentStepIndex; j++) {
          if (steps[j].currentIterationIdx === step.currentIterationIdx && steps[j].activeLine !== step.activeLine) {
            // Check if stdout grew
            const prevOut = j > 0 ? steps[j - 1].stdout.length : 0
            if (steps[j].stdout.length > prevOut) {
              printOut = steps[j].stdout[steps[j].stdout.length - 1]
            }
          }
        }

        rows.push({
          pass: step.currentIterationIdx + 1,
          varValue: loopVal,
          condition: String(step.conditionResult),
          output: printOut,
          status: step.conditionResult === false ? 'Exited' : 'Completed'
        })
      }
    })

    return rows
  }

  // Generate handwriting text blocks for ruled notebook sheet simulation
  const getHandwrittenLogs = () => {
    const logs: string[] = []
    
    steps.slice(0, currentStepIndex + 1).forEach((step, idx) => {
      const vVal = step.variables[loopVar] !== undefined ? String(step.variables[loopVar]) : '0'

      if (step.flowchartNode === 'start') {
        logs.push(`Step 1: Declare & Initialize Counter variable: [${loopVar} = ${vVal}]`)
      } else if (step.flowchartNode === 'condition' && step.conditionResult === true) {
        logs.push(`Pass ${step.currentIterationIdx + 1}: Check condition (${loopVar} < limit)`)
        logs.push(`   ↳ ${loopVar} = ${vVal}. Condition evaluated to TRUE. Entering body.`)
      } else if (step.flowchartNode === 'body') {
        // If it's a print statement
        const prevStdout = idx > 0 ? steps[idx - 1].stdout.length : 0
        if (step.stdout.length > prevStdout) {
          logs.push(`   ↳ Body Execution: stdout.print("${step.stdout[step.stdout.length - 1]}")`)
        } else {
          logs.push(`   ↳ Body Execution: Scoped variable environment re-evaluated.`)
        }
      } else if (step.flowchartNode === 'update') {
        logs.push(`   ↳ Increment: ${loopVar} updates to ${vVal}`)
      } else if (step.flowchartNode === 'end' || (step.flowchartNode === 'condition' && step.conditionResult === false)) {
        logs.push(`Termination Check: Is ${loopVar} (${vVal}) < limit? FALSE.`)
        logs.push(`Loop completes successfully. Program pointer exits.`)
      }
    })

    return logs
  }

  const tableRows = getTableRows()
  const handwrittenLogs = getHandwrittenLogs()

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#061018]/70 p-5 shadow-lg backdrop-blur-sm flex flex-col gap-4 relative overflow-hidden h-[460px]">
      {/* Glossy top edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-0.5 rounded-lg">
          <button
            onClick={() => setSubTab('handwritten')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md inline-flex items-center gap-1.5 transition duration-200 ${
              subTab === 'handwritten'
                ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Edit3 size={13} />
            Handwritten Sheet
          </button>
          <button
            onClick={() => setSubTab('tabular')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md inline-flex items-center gap-1.5 transition duration-200 ${
              subTab === 'tabular'
                ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileSpreadsheet size={13} />
            Tracing Table
          </button>
        </div>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
          Exam Representation
        </span>
      </div>

      {/* Sheet Frame Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {subTab === 'handwritten' ? (
          /* High-fidelity handwritten ruled exam paper simulation */
          <div 
            className="flex-1 overflow-y-auto rounded-xl bg-[#fdfbfa] border border-orange-200/40 p-5 shadow-inner relative flex flex-col select-text font-serif leading-[28px] text-[13px] text-blue-900 shadow-md shadow-amber-900/5"
            style={{
              backgroundImage: 'linear-gradient(#cce3f0 1px, transparent 1px)',
              backgroundSize: '100% 28px',
              scrollbarWidth: 'thin'
            }}
          >
            {/* Left red margin line */}
            <div className="absolute top-0 bottom-0 left-[35px] w-[1px] bg-red-400/50" />

            {/* Notebook lines */}
            <div className="pl-6 space-y-0 text-left font-medium select-text">
              {handwrittenLogs.length === 0 ? (
                <div className="py-16 text-center text-slate-400 font-serif italic">
                  Exam tracing sheet is empty.<br />Start loop simulation step-by-step.
                </div>
              ) : (
                handwrittenLogs.map((log, idx) => (
                  <div 
                    key={`hw-log-${idx}`} 
                    className="min-h-[28px] flex items-center pl-4 font-mono font-bold tracking-tight text-[#1e3a8a] select-text filter drop-shadow-[0.5px_0.5px_0.5px_rgba(30,58,138,0.15)]"
                    style={{
                      fontFamily: 'Courier New, Courier, monospace'
                    }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Standard algorithmic grid table representation */
          <div className="flex-1 overflow-hidden flex flex-col bg-[#03080c] border border-slate-900 rounded-xl">
            <div className="overflow-x-auto flex-1 scrollbar-thin">
              <table className="w-full text-left text-xs font-mono text-gray-300">
                <thead className="bg-[#020508] border-b border-slate-800 text-[10px] text-gray-400 uppercase font-extrabold tracking-wider sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Iteration</th>
                    <th className="py-3 px-4">Counter ({loopVar})</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Stdout</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {tableRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-gray-500 italic">
                        No iterations trace recorded yet. Run visualize!
                      </td>
                    </tr>
                  ) : (
                    tableRows.map((row, idx) => (
                      <tr 
                        key={`table-row-${idx}`}
                        className={`hover:bg-[#07131e]/30 transition duration-150 ${
                          idx === tableRows.length - 1 ? 'bg-cyan-500/5 text-cyan-200' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-extrabold text-cyan-400">#{row.pass}</td>
                        <td className="py-3 px-4">{row.varValue}</td>
                        <td className="py-3 px-4">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                            row.condition === 'true' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {row.condition}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-100">{row.output}</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] text-gray-500">{row.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Summary details */}
            <div className="bg-[#020508] border-t border-slate-950 p-3 text-[10px] font-mono text-gray-500 flex justify-between">
              <span>Total Pass Runs: {tableRows.length}</span>
              <span>Standard DSA Exam Format</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
