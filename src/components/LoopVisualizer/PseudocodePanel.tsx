import React from 'react'
import { Code2 } from 'lucide-react'

interface PseudocodePanelProps {
  loopType: string
  activeLine: number
  theme: 'notebook' | 'chalkboard'
  variables?: { i?: number; j?: number; val?: any; limit?: number; innerLimit?: number; step?: number }
}

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({
  loopType,
  activeLine,
  theme,
  variables = {}
}) => {
  const getCodeLines = () => {
    const { i = 0, j = 0, val = 0, limit = 5, innerLimit = 3, step = 1 } = variables

    switch (loopType) {
      case 'for':
        return [
          `// Standard For Loop`,
          `for (let i = ${i}; i < ${limit}; i += ${step}) {`,
          `    console.log("i =", i);`,
          `    // Loop Body execution`,
          `}`
        ]
      case 'while':
        return [
          `// While Loop Entry Validation`,
          `let i = ${i};`,
          `while (i < ${limit}) {`,
          `    console.log("i =", i);`,
          `    i += ${step};`,
          `}`
        ]
      case 'do-while':
        return [
          `// Do While Execution (runs at least once)`,
          `let i = ${i};`,
          `do {`,
          `    console.log("i =", i);`,
          `    i += ${step};`,
          `} while (i < ${limit});`
        ]
      case 'nested':
        return [
          `// Nested Coordinate Traversal`,
          `for (let i = ${i}; i < ${limit}; i++) {`,
          `    for (let j = ${j}; j < ${innerLimit}; j++) {`,
          `        console.log(\`Coordinate (\${i}, \${j})\`);`,
          `    }`,
          `}`
        ]
      case 'for-of':
        return [
          `// For...Of Array Value Extraction`,
          `const array = [...iterable];`,
          `for (const element of array) {`,
          `    console.log("Value:", element); // element = ${JSON.stringify(val)}`,
          `}`
        ]
      case 'forEach':
        return [
          `// forEach Functional Callback`,
          `const array = [...iterable];`,
          `array.forEach((element, index) => {`,
          `    console.log(\`A[\${index}] = \${element}\`);`,
          `});`
        ]
      default:
        return []
    }
  }

  const lines = getCodeLines()

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#061018]/60 p-4 shadow-md">
      <h3 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider font-mono mb-3 flex items-center gap-1.5">
        <Code2 size={14} />
        <span>Active Code Tracing</span>
      </h3>

      <div 
        className="font-mono text-[11px] leading-relaxed p-3.5 rounded-xl bg-[#02070c] border border-slate-900 overflow-x-auto space-y-1"
        style={{ scrollbarWidth: 'thin' }}
      >
        {lines.map((line, idx) => {
          const isActive = idx === activeLine
          return (
            <div
              key={`line-${idx}`}
              className={`px-2 py-0.5 rounded transition-all duration-300 whitespace-pre ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 font-extrabold border-l-2 border-cyan-400 shadow shadow-cyan-500/5'
                  : 'text-gray-500 opacity-60'
              }`}
            >
              <span className="inline-block w-4 text-left select-none text-[9px] opacity-40 mr-2">{idx + 1}</span>
              {line}
            </div>
          )
        })}
      </div>
    </div>
  )
}
