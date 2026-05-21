import React, { useState, useEffect, useRef } from 'react'
import { Play, Code2, Sparkles, RefreshCw } from 'lucide-react'

interface CodeEditorProps {
  language: 'c' | 'cpp' | 'java' | 'python'
  onLanguageChange: (lang: 'c' | 'cpp' | 'java' | 'python') => void
  code: string
  onCodeChange: (code: string) => void
  onVisualize: () => void
  activeLine: number
  isSimulating: boolean
  validationError: string | null
}

const TEMPLATES = {
  c: `// C Language Simple For Loop
int i = 0;
for (i = 0; i < 5; i++) {
    print(i);
}`,
  cpp: `// C++ Language While Loop
int i = 0;
while (i < 5) {
    cout << i;
    i++;
}`,
  java: `// Java Do-While Execution
int i = 0;
do {
    System.out.println(i);
    i++;
} while (i < 5);`,
  python: `# Python Nested Coordinate Patterns
for i in range(3):
    for j in range(3):
        print(i)`
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  onVisualize,
  activeLine,
  isSimulating,
  validationError
}) => {
  const [editorText, setEditorText] = useState(code)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  // Sync state changes from parent
  useEffect(() => {
    if (code !== editorText) {
      setEditorText(code)
    }
  }, [code])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setEditorText(val)
    onCodeChange(val)
  }

  // Handle Tab indentation and Enter auto-indent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const updated = editorText.substring(0, start) + '    ' + editorText.substring(end)
      setEditorText(updated)
      onCodeChange(updated)
      
      // Reset cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
        }
      }, 0)
    }
  }

  // Scroll Sync between textarea, code-highlight element, and line numbers
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    if (highlightRef.current) {
      highlightRef.current.scrollTop = target.scrollTop
      highlightRef.current.scrollLeft = target.scrollLeft
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = target.scrollTop
    }
  }

  const handleResetTemplate = () => {
    setEditorText(TEMPLATES[language])
    onCodeChange(TEMPLATES[language])
  }

  // Syntax highlighting processor using Regex tokens
  const renderHighlightedCode = (text: string) => {
    const escapeHtml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    
    let html = escapeHtml(text)

    // Keywords (int, double, float, let, const, var, for, while, do, System, out, println, print, cout, std, endl)
    const keywords = /\b(int|double|float|let|const|var|for|while|do|System|out|println|print|printf|cout|std|endl|range|in)\b/g
    html = html.replace(keywords, '<span class="text-pink-400 font-bold">$1</span>')

    // Numbers
    html = html.replace(/\b(\d+)\b/g, '<span class="text-amber-300">$1</span>')

    // Strings
    html = html.replace(/(["'])(.*?)\1/g, '<span class="text-emerald-400">"$2"</span>')

    // Operators and brackets
    html = html.replace(/([+\-*/%=<>!{}()\[\];])/g, '<span class="text-cyan-400">$1</span>')

    // Comments
    html = html.replace(/(\/\/.*|#.*)/g, '<span class="text-gray-500 italic">$1</span>')

    return <code dangerouslySetInnerHTML={{ __html: html }} />
  }

  // Generate line numbers elements
  const lines = editorText.split('\n')

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#061018]/70 p-5 shadow-lg backdrop-blur-sm flex flex-col gap-4 relative overflow-hidden">
      {/* Glossy header */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="text-cyan-400" size={18} />
          <h2 className="text-sm font-bold text-gray-200 tracking-wide font-sans">
            Interactive Editor
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-0.5 rounded-lg">
            {(['c', 'cpp', 'java', 'python'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 text-[10px] uppercase font-mono rounded transition duration-200 ${
                  language === lang
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {lang === 'cpp' ? 'C++' : lang}
              </button>
            ))}
          </div>

          {/* Reset Template */}
          <button
            onClick={handleResetTemplate}
            title="Reset code template"
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 transition duration-200"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Editor Body Grid */}
      <div className="relative border border-slate-800/80 rounded-xl bg-[#03090e] flex h-[260px] overflow-hidden">
        {/* Sync'd Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="w-10 bg-[#02060a] border-r border-slate-900 select-none py-4 flex flex-col items-center text-[11px] font-mono text-slate-600 overflow-hidden leading-[1.6]"
        >
          {lines.map((_, idx) => {
            const isLineActive = isSimulating && idx === activeLine
            return (
              <div
                key={`line-num-${idx}`}
                className={`w-full text-center transition-all duration-300 ${
                  isLineActive
                    ? 'text-cyan-400 font-black bg-cyan-950/20 border-l-2 border-cyan-400 shadow shadow-cyan-400/5'
                    : ''
                }`}
              >
                {idx + 1}
              </div>
            )
          })}
        </div>

        {/* Textarea + Syntax Highlighter overlays */}
        <div className="flex-1 relative overflow-hidden">
          {/* Layer 1: The Code Highlight Background Pre */}
          <pre
            ref={highlightRef}
            className="absolute inset-0 w-full h-full p-4 font-mono text-[13px] leading-[1.6] pointer-events-none select-none overflow-hidden text-gray-300 whitespace-pre"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
            }}
          >
            {renderHighlightedCode(editorText)}
          </pre>

          {/* Layer 2: The Interactive Transparent Textarea */}
          <textarea
            ref={textareaRef}
            value={editorText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            readOnly={true}
            className="absolute inset-0 w-full h-full p-4 font-mono text-[13px] leading-[1.6] bg-transparent text-transparent caret-transparent select-text resize-none focus:outline-none whitespace-pre overflow-auto"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
            }}
          />

          {/* Locked/Guided overlay indicator */}
          <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-800/80 rounded-lg px-2.5 py-1 flex items-center gap-1.5 pointer-events-none select-none backdrop-blur-sm z-10">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[9px] uppercase font-mono text-cyan-400 font-bold tracking-wider">
              Guided Sandbox Active
            </span>
          </div>
        </div>
      </div>

      {/* Validate / Error Notification panel */}
      {validationError ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex flex-col gap-1.5 animate-fadeIn">
          <span className="text-[10px] uppercase font-mono font-extrabold text-rose-400 tracking-wider">
            Educational Validation Alert
          </span>
          <p className="text-xs text-rose-300 font-sans leading-relaxed">
            {validationError}
          </p>
        </div>
      ) : (
        <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
              <Sparkles size={11} className="animate-pulse" />
              <span>Configurator Controlled: Code generated dynamically.</span>
            </div>
            {isSimulating && (
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                Tracing: Line {activeLine + 1}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
            To modify the code structure, adjust the <strong>Loop Style</strong>, <strong>Templates</strong>, <strong>Limits</strong>, or <strong>Increments</strong> in the sidebar. This ensures safe execution without runtime errors.
          </p>
        </div>
      )}

      {/* Run Action Button */}
      <button
        onClick={onVisualize}
        className="w-full mt-1.5 py-3 rounded-xl font-bold font-sans text-sm inline-flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/35 border border-cyan-400/20 active:scale-[0.98]"
      >
        <Play size={16} fill="currentColor" />
        Visualize Step-by-Step
      </button>
    </div>
  )
}
