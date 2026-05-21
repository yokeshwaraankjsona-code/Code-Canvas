import React from 'react'
import { ExamPass } from './ExamModeContainer'

interface ExamTableProps {
  algorithm: string
  passes: ExamPass[]
  theme: 'notebook' | 'chalkboard'
}

export const ExamTable: React.FC<ExamTableProps> = ({
  algorithm,
  passes,
  theme
}) => {
  const tableStyles = theme === 'chalkboard' 
    ? 'border-slate-700 bg-slate-800 text-slate-100' 
    : 'border-amber-900/20 bg-amber-50/10 text-amber-950 font-serif'

  const headerStyles = theme === 'chalkboard'
    ? 'bg-slate-700 text-slate-300'
    : 'bg-amber-100/70 text-amber-950 font-bold font-serif'

  const borderStyles = theme === 'chalkboard' ? 'border-slate-700' : 'border-amber-900/15'

  const renderTableContent = () => {
    if (algorithm === 'stack') {
      return (
        <table className={`w-full text-left border-collapse border ${borderStyles}`}>
          <thead>
            <tr className={headerStyles}>
              <th className="p-3 border">Step</th>
              <th className="p-3 border">Operation</th>
              <th className="p-3 border">Value</th>
              <th className="p-3 border">Stack State (Bottom → Top)</th>
              <th className="p-3 border">Top Pointer</th>
            </tr>
          </thead>
          <tbody>
            {[
              { step: 1, op: 'Push', val: 5, state: '[5]', top: 0 },
              { step: 2, op: 'Push', val: 12, state: '[5, 12]', top: 1 },
              { step: 3, op: 'Pop', val: 12, state: '[5]', top: 0 },
              { step: 4, op: 'Push', val: 8, state: '[5, 8]', top: 1 },
              { step: 5, op: 'Push', val: 24, state: '[5, 8, 24]', top: 2 },
              { step: 6, op: 'Pop', val: 24, state: '[5, 8]', top: 1 }
            ].map((row, idx) => (
              <tr key={`stack-row-${idx}`} className={`hover:bg-amber-50/20 ${idx % 2 === 0 ? 'bg-amber-50/5' : ''}`}>
                <td className="p-3 border font-mono">{row.step}</td>
                <td className="p-3 border font-bold text-amber-700">{row.op}</td>
                <td className="p-3 border font-mono">{row.val}</td>
                <td className="p-3 border font-mono font-bold">{row.state}</td>
                <td className="p-3 border font-mono">{row.top}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (algorithm === 'queue') {
      return (
        <table className={`w-full text-left border-collapse border ${borderStyles}`}>
          <thead>
            <tr className={headerStyles}>
              <th className="p-3 border">Step</th>
              <th className="p-3 border">Operation</th>
              <th className="p-3 border">Value</th>
              <th className="p-3 border">Queue State (Front → Rear)</th>
              <th className="p-3 border">Front Pointer</th>
              <th className="p-3 border">Rear Pointer</th>
            </tr>
          </thead>
          <tbody>
            {[
              { step: 1, op: 'Enqueue', val: 3, state: '[3]', f: 0, r: 0 },
              { step: 2, op: 'Enqueue', val: 8, state: '[3, 8]', f: 0, r: 1 },
              { step: 3, op: 'Enqueue', val: 15, state: '[3, 8, 15]', f: 0, r: 2 },
              { step: 4, op: 'Dequeue', val: 3, state: '[8, 15]', f: 1, r: 2 },
              { step: 5, op: 'Enqueue', val: 22, state: '[8, 15, 22]', f: 1, r: 3 },
              { step: 6, op: 'Dequeue', val: 8, state: '[15, 22]', f: 2, r: 3 }
            ].map((row, idx) => (
              <tr key={`queue-row-${idx}`} className={`hover:bg-amber-50/20 ${idx % 2 === 0 ? 'bg-amber-50/5' : ''}`}>
                <td className="p-3 border font-mono">{row.step}</td>
                <td className="p-3 border font-bold text-cyan-700">{row.op}</td>
                <td className="p-3 border font-mono">{row.val}</td>
                <td className="p-3 border font-mono font-bold">{row.state}</td>
                <td className="p-3 border font-mono">{row.f}</td>
                <td className="p-3 border font-mono">{row.r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (algorithm === 'linear-search') {
      return (
        <table className={`w-full text-left border-collapse border ${borderStyles}`}>
          <thead>
            <tr className={headerStyles}>
              <th className="p-3 border">Iteration</th>
              <th className="p-3 border">Index Checked</th>
              <th className="p-3 border">Element Value</th>
              <th className="p-3 border">Comparison Statement</th>
              <th className="p-3 border">Match Outcome</th>
            </tr>
          </thead>
          <tbody>
            {passes[0]?.steps.filter(s => s.comparison).map((step, idx) => (
              <tr key={`search-row-${idx}`} className={`hover:bg-amber-50/20 ${idx % 2 === 0 ? 'bg-amber-50/5' : ''}`}>
                <td className="p-3 border font-mono">{idx + 1}</td>
                <td className="p-3 border font-mono">i = {step.indices?.[0]}</td>
                <td className="p-3 border font-mono font-bold">{step.arrayState[step.indices?.[0] || 0]}</td>
                <td className="p-3 border font-serif italic">{step.comparison}</td>
                <td className={`p-3 border font-bold ${step.action === 'Found!' ? 'text-emerald-600' : 'text-red-500'}`}>{step.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (algorithm === 'binary-search') {
      return (
        <table className={`w-full text-left border-collapse border ${borderStyles}`}>
          <thead>
            <tr className={headerStyles}>
              <th className="p-3 border">Iteration</th>
              <th className="p-3 border">Low Index</th>
              <th className="p-3 border">High Index</th>
              <th className="p-3 border">Mid Index</th>
              <th className="p-3 border">A[Mid]</th>
              <th className="p-3 border">Comparison</th>
              <th className="p-3 border">Next Pointers Set</th>
            </tr>
          </thead>
          <tbody>
            {passes[0]?.steps.filter(s => s.pointers && s.pointers.mid !== undefined).map((step, idx) => {
              const mid = step.pointers?.mid ?? 0
              return (
                <tr key={`binary-row-${idx}`} className={`hover:bg-amber-50/20 ${idx % 2 === 0 ? 'bg-amber-50/5' : ''}`}>
                  <td className="p-3 border font-mono">{idx + 1}</td>
                  <td className="p-3 border font-mono">{step.pointers?.low}</td>
                  <td className="p-3 border font-mono">{step.pointers?.high}</td>
                  <td className="p-3 border font-mono font-bold">{mid}</td>
                  <td className="p-3 border font-mono font-bold">{step.arrayState[mid]}</td>
                  <td className="p-3 border font-serif italic">{step.comparison}</td>
                  <td className="p-3 border font-mono text-cyan-600 font-bold">{step.action}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )
    }

    // Default Sorting Tables
    return (
      <table className={`w-full text-left border-collapse border ${borderStyles}`}>
        <thead>
          <tr className={headerStyles}>
            <th className="p-3 border w-16">Pass</th>
            <th className="p-3 border">Step Name</th>
            <th className="p-3 border">Comparison / Key</th>
            <th className="p-3 border">Action Taken</th>
            <th className="p-3 border">Array State After Step</th>
          </tr>
        </thead>
        <tbody>
          {passes.map((pass, passIdx) => (
            <React.Fragment key={`pass-group-${passIdx}`}>
              <tr className={theme === 'chalkboard' ? 'bg-slate-700/30' : 'bg-amber-100/20'}>
                <td colSpan={5} className="p-3 border font-bold font-serif text-sm">
                  Pass {pass.passNumber}
                </td>
              </tr>
              {pass.steps.map((step, stepIdx) => (
                <tr key={`step-row-${passIdx}-${stepIdx}`} className={`hover:bg-amber-50/20`}>
                  <td className="p-3 border text-gray-400 font-mono text-xs">{pass.passNumber}.{stepIdx}</td>
                  <td className="p-3 border font-serif text-sm font-semibold">{step.label.split('-')[1]?.trim() || step.label}</td>
                  <td className="p-3 border font-serif italic text-sm">{step.comparison || 'N/A'}</td>
                  <td className="p-3 border font-mono text-xs text-amber-700 font-bold">{step.action || 'Initialize'}</td>
                  <td className="p-3 border font-mono font-bold tracking-wider text-sm">
                    [{step.arrayState.join(', ')}]
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className={`overflow-x-auto rounded-xl border p-4 ${tableStyles}`}>
      <div className="flex items-center justify-between mb-4 border-b pb-2 border-amber-950/10">
        <h4 className="text-md font-bold font-serif">University Exam Tracing Table</h4>
        <span className="text-xs uppercase tracking-wider text-gray-400 font-sans font-bold">Standard Exam Grading Format</span>
      </div>
      
      {renderTableContent()}

      <div className="mt-4 text-xs text-gray-400 font-serif italic">
        * Tip: Copy this tracing table exactly onto your physical exam sheets for full manual tracing marks.
      </div>
    </div>
  )
}
