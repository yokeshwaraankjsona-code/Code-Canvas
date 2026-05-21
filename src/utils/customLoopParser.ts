// Custom Code Loop Parser and virtual execution engine for CodeCanvas Loop Visualizer
// Supports: for, while, do-while, nested loops, array printing, simple conditionals

export interface InnerIteration {
  j: number
  status: 'active' | 'completed' | 'pending'
}

export interface IterationState {
  i: number
  val: any
  status: 'active' | 'completed' | 'pending'
  innerIterations?: InnerIteration[]
  explanation?: string
}

export interface LoopExecutionStep {
  activeLine: number
  variables: Record<string, any>
  conditionResult: boolean | string
  currentIterationIdx: number
  explanation: string
  iterationsState: IterationState[]
  log: string
  stdout: string[]
  flowchartNode: 'start' | 'condition' | 'body' | 'update' | 'end' | 'idle'
}

export interface ParseResult {
  steps: LoopExecutionStep[]
  error: string | null
  originalCleanedLines: string[]
  conditionStr: string
}

// Safely evaluates simple mathematical expressions using active variables
const evaluateExpression = (expr: string, vars: Record<string, any>): any => {
  let cleanExpr = expr.trim()
  if (cleanExpr.endsWith(';')) {
    cleanExpr = cleanExpr.slice(0, -1).trim()
  }

  if (!cleanExpr) return undefined

  try {
    const fn = new Function('vars', `with(vars) { return (${cleanExpr}); }`)
    return fn(vars)
  } catch (err) {
    try {
      if (/^[a-zA-Z_]\w*$/.test(cleanExpr) && !(cleanExpr in vars)) {
        return cleanExpr
      }
      if (/^["'].*["']$/.test(cleanExpr)) {
        return cleanExpr.replace(/^["']|["']$/g, '')
      }
      return cleanExpr
    } catch {
      return cleanExpr
    }
  }
}

// Cleans C/C++/Java type declarations and brace array initializers for JavaScript execution
const cleanCodeLineForJS = (line: string, vars: Record<string, any>): string => {
  let cleaned = line.trim()
  if (cleaned.endsWith(';')) {
    cleaned = cleaned.slice(0, -1).trim()
  }

  // 1. Convert C/Java brace array initializer to JS bracket array
  // e.g. = {10, 20, 30} -> = [10, 20, 30]
  const braceArrayMatch = cleaned.match(/=\s*\{([^}]+)\}/)
  if (braceArrayMatch) {
    cleaned = cleaned.replace(/=\s*\{([^}]+)\}/, `= [$1]`)
  }

  // 2. Match type declarations and extract variable name
  // Standard types: int, double, float, char, long, boolean, bool, String, let, var, const, auto
  // Also support array type brackets: int[] arr or int arr[]
  if (cleaned.includes('=')) {
    const declMatch = cleaned.match(/^(?:int|double|float|char|long|boolean|bool|String|let|var|const|auto)\s*(?:\[\s*\])?\s*([a-zA-Z_]\w*)\s*(?:\[\s*\])?\s*=/)
    if (declMatch) {
      const varName = declMatch[1]
      if (!(varName in vars)) {
        vars[varName] = undefined
      }
      cleaned = cleaned.replace(/^(?:int|double|float|char|long|boolean|bool|String|let|var|const|auto)\s*(?:\[\s*\])?\s*([a-zA-Z_]\w*)\s*(?:\[\s*\])?\s*=/, `${varName} =`)
    }
  } else {
    // Declarations without assignment, e.g. int x;
    const declOnlyMatch = cleaned.match(/^(?:int|double|float|char|long|boolean|bool|String|let|var|const|auto)\s*(?:\[\s*\])?\s*([a-zA-Z_]\w*)\s*(?:\[\s*\])?$/)
    if (declOnlyMatch) {
      const varName = declOnlyMatch[1]
      if (!(varName in vars)) {
        vars[varName] = undefined
      }
      cleaned = '' // Declared, nothing to execute
    }
  }

  return cleaned
}

// Executes an arbitrary statement in a dynamic, scoped vars context
const executeStatement = (statement: string, vars: Record<string, any>): void => {
  const cleanStmt = cleanCodeLineForJS(statement, vars)
  if (!cleanStmt) return

  try {
    const fn = new Function('vars', `with(vars) { ${cleanStmt}; }`)
    fn(vars)
  } catch (err) {
    console.warn("Failed to execute statement:", cleanStmt, err)
  }
}

// Detect block ends for braces (C/Java) or indentation (Python)
const findBlockEndLineIdx = (lines: string[], startIdx: number, isPython: boolean): number => {
  if (isPython) {
    const startLine = lines[startIdx]
    const startIndent = startLine.length - startLine.trimStart().length
    
    let blockIndent = -1
    for (let idx = startIdx + 1; idx < lines.length; idx++) {
      const line = lines[idx]
      if (line.trim() === '') continue
      blockIndent = line.length - line.trimStart().length
      break
    }

    if (blockIndent === -1 || blockIndent <= startIndent) {
      return startIdx + 1
    }

    for (let idx = startIdx + 1; idx < lines.length; idx++) {
      const line = lines[idx]
      if (line.trim() === '') continue
      const currentIndent = line.length - line.trimStart().length
      if (currentIndent < blockIndent) {
        return idx - 1
      }
    }
    return lines.length - 1
  } else {
    let braceCount = 0
    let hasBraces = false

    for (let idx = startIdx; idx < lines.length; idx++) {
      const line = lines[idx]
      const openBraces = (line.match(/{/g) || []).length
      const closeBraces = (line.match(/}/g) || []).length

      if (openBraces > 0) {
        hasBraces = true
      }

      braceCount += openBraces - closeBraces

      if (hasBraces && braceCount <= 0) {
        return idx
      }
    }

    return lines.length - 1
  }
}

const getBodyLineIndices = (startIdx: number, endIdx: number, isPython: boolean): number[] => {
  const indices: number[] = []
  const maxEnd = isPython ? endIdx : endIdx - 1
  for (let idx = startIdx + 1; idx <= maxEnd; idx++) {
    indices.push(idx)
  }
  return indices
}

export const parseCustomLoop = (code: string, language: 'c' | 'cpp' | 'java' | 'python'): ParseResult => {
  const steps: LoopExecutionStep[] = []
  
  // 1. Pre-validation and Safety Checks
  const lowerCode = code.toLowerCase()
  const forbiddenKeywords = [
    { word: 'class', msg: 'Classes and OOP are not supported in loop visualizer.' },
    { word: 'def ', msg: 'Function definitions are not supported. Write flat loop code directly.' },
    { word: 'function', msg: 'Custom functions are not supported. Write flat loop code directly.' },
    { word: 'import', msg: 'External library imports are not supported yet.' },
    { word: '#include', msg: 'C/C++ headers are not required. Focus directly on the loop logic!' },
    { word: 'recursion', msg: 'Recursion is not supported. Use iteration variables instead.' },
    { word: 'try', msg: 'Exception handling blocks are not supported.' },
    { word: 'public class', msg: 'Java class boilerplate is not needed. Type code directly.' }
  ]

  for (const item of forbiddenKeywords) {
    if (lowerCode.includes(item.word)) {
      return { steps: [], error: item.msg, originalCleanedLines: [], conditionStr: '' }
    }
  }

  // 2. Clean and format the lines
  const rawLines = code.split('\n')
  const originalCleanedLines = rawLines.map(line => {
    // Retain indentation but trim trailing spaces/comments
    const commentIdx = line.indexOf('//')
    const pyCommentIdx = line.indexOf('#')
    let clean = line
    if (commentIdx !== -1) clean = line.substring(0, commentIdx)
    else if (pyCommentIdx !== -1 && !line.includes('"#"')) clean = line.substring(0, pyCommentIdx)
    return clean.trimEnd()
  }).filter(line => line.trim() !== '')

  if (originalCleanedLines.length === 0) {
    return { steps: [], error: 'Please enter some loop-based program code.', originalCleanedLines: [], conditionStr: '' }
  }

  // Determine loop style and variables
  let outerLoopLineIdx = -1
  let innerLoopLineIdx = -1
  let isDoWhile = false
  let doLineIdx = -1

  // Scan lines to identify loops
  for (let idx = 0; idx < originalCleanedLines.length; idx++) {
    const line = originalCleanedLines[idx].trim()
    if (line.startsWith('for') || line.startsWith('while')) {
      if (outerLoopLineIdx === -1) {
        outerLoopLineIdx = idx
      } else if (innerLoopLineIdx === -1) {
        innerLoopLineIdx = idx
      }
    } else if (line.startsWith('do')) {
      isDoWhile = true
      doLineIdx = idx
      outerLoopLineIdx = idx // treat do line as outer loop start
    }
  }

  if (outerLoopLineIdx === -1) {
    return {
      steps: [],
      error: 'No valid loop structure (for, while, do-while) detected in your code. Please check your syntax.',
      originalCleanedLines,
      conditionStr: ''
    }
  }

  // 3. Extract Loop Parameters using Regex
  const vars: Record<string, any> = {}
  let stdout: string[] = []
  let iterations: IterationState[] = []

  // Check for pre-loop variable initializations (e.g., int i = 0;)
  for (let idx = 0; idx < outerLoopLineIdx; idx++) {
    const line = originalCleanedLines[idx].trim()
    executeStatement(line, vars)
  }

  const isPython = language === 'python'
  const outerLoopEndIdx = findBlockEndLineIdx(originalCleanedLines, outerLoopLineIdx, isPython)
  const innerLoopEndIdx = innerLoopLineIdx !== -1 
    ? findBlockEndLineIdx(originalCleanedLines, innerLoopLineIdx, isPython)
    : -1

  // Parse Outer Loop Details
  const outerLine = originalCleanedLines[outerLoopLineIdx].trim()
  let loopVar = 'i'
  let startVal = 0
  let limitVal = 5
  let stepVal = 1
  let stepOp = '+='
  let conditionStr = 'i < 5'
  let conditionVar = 'i'
  let isArrayLoop = false
  let arrayVarName = ''

  // A. For Loop C/Java style: for(int i=0; i<5; i++)
  const forCstyle = outerLine.match(/for\s*\(\s*(?:int\s+|let\s+|var\s+)?([a-zA-Z_]\w*)\s*=\s*([^;]+)\s*;\s*([a-zA-Z_]\w*)\s*([<>=!]+)\s*([^;]+)\s*;\s*([^)]+)\)/)
  // B. Python range loop: for i in range(5): or for i in range(0, 5)
  const forPystyle = outerLine.match(/for\s+([a-zA-Z_]\w*)\s+in\s+range\(\s*([^)]+)\s*\)\s*:/)
  // C. Array For-Of loop: for (int x : arr) or for x in arr:
  const forOfStyle = outerLine.match(/for\s*\(\s*(?:int\s+|let\s+|const\s+|var\s+)?([a-zA-Z_]\w*)\s*(?::|\bin\b)\s*([a-zA-Z_]\w*)\s*\)/)
  const forOfPyStyle = outerLine.match(/for\s+([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*)\s*:/)

  if (forCstyle) {
    loopVar = forCstyle[1]
    if (!(loopVar in vars)) {
      vars[loopVar] = undefined
    }
    executeStatement(`${loopVar} = ${forCstyle[2]}`, vars)
    startVal = vars[loopVar]
    conditionVar = forCstyle[3]
    const compOp = forCstyle[4]
    const limitExpr = forCstyle[5]
    limitVal = evaluateExpression(limitExpr, vars)
    conditionStr = `${conditionVar} ${compOp} ${limitExpr}`
  } else if (forPystyle) {
    loopVar = forPystyle[1]
    const rangeArgs = forPystyle[2].split(',').map(arg => evaluateExpression(arg.trim(), vars))
    if (rangeArgs.length === 1) {
      startVal = 0
      limitVal = rangeArgs[0]
      stepVal = 1
    } else if (rangeArgs.length === 2) {
      startVal = rangeArgs[0]
      limitVal = rangeArgs[1]
      stepVal = 1
    } else {
      startVal = rangeArgs[0]
      limitVal = rangeArgs[1]
      stepVal = rangeArgs[2]
    }
    vars[loopVar] = startVal
    conditionVar = loopVar
    conditionStr = `${loopVar} < ${limitVal}`
  } else if (forOfStyle || forOfPyStyle) {
    const match = forOfStyle || forOfPyStyle
    if (match) {
      loopVar = match[1]
      arrayVarName = match[2]
      isArrayLoop = true
      if (!vars[arrayVarName] || !Array.isArray(vars[arrayVarName])) {
        // Create a dummy array if not declared before
        vars[arrayVarName] = [10, 20, 30, 40]
      }
      startVal = 0
      limitVal = vars[arrayVarName].length
      stepVal = 1
      vars[loopVar] = vars[arrayVarName][0]
    }
  } else if (outerLine.startsWith('while')) {
    // While condition: while (i < 5)
    const whileMatch = outerLine.match(/while\s*\(?\s*([^)]+)\s*\)?/) || outerLine.match(/while\s+([^:]+)\s*:/)
    if (whileMatch) {
      conditionStr = whileMatch[1].trim()
      // Guess the loop variable
      const varMatch = conditionStr.match(/([a-zA-Z_]\w*)/)
      if (varMatch) {
        conditionVar = varMatch[1]
        loopVar = conditionVar
      }
    }
  } else if (isDoWhile) {
    // Do line has no condition, but scan for while at bottom
    let whileLineIdx = -1
    for (let idx = outerLoopLineIdx; idx < originalCleanedLines.length; idx++) {
      if (originalCleanedLines[idx].trim().startsWith('} while') || originalCleanedLines[idx].trim().startsWith('while')) {
        whileLineIdx = idx
        break
      }
    }
    if (whileLineIdx !== -1) {
      const match = originalCleanedLines[whileLineIdx].match(/while\s*\(?\s*([^);\n]+)\s*\)?/)
      if (match) {
        conditionStr = match[1].trim()
        const varMatch = conditionStr.match(/([a-zA-Z_]\w*)/)
        if (varMatch) {
          conditionVar = varMatch[1]
          loopVar = conditionVar
        }
      }
    }
  }

  // Parse Inner loop if nested
  let innerLoopVar = 'j'
  let innerStartVal = 0
  let innerLimitVal = 3
  let innerStepVal = 1
  let innerConditionStr = 'j < 3'
  let innerCstyle: RegExpMatchArray | null = null
  let innerPystyle: RegExpMatchArray | null = null

  if (innerLoopLineIdx !== -1) {
    const innerLine = originalCleanedLines[innerLoopLineIdx].trim()
    innerCstyle = innerLine.match(/for\s*\(\s*(?:int\s+|let\s+|var\s+)?([a-zA-Z_]\w*)\s*=\s*([^;]+)\s*;\s*([a-zA-Z_]\w*)\s*[<>=!]+\s*([^;]+)\s*;\s*([^)]+)\)/)
    innerPystyle = innerLine.match(/for\s+([a-zA-Z_]\w*)\s+in\s+range\(\s*([^)]+)\s*\)\s*:/)

    if (innerCstyle) {
      innerLoopVar = innerCstyle[1]
      vars[innerLoopVar] = evaluateExpression(innerCstyle[2], vars)
      innerStartVal = vars[innerLoopVar]
      innerLimitVal = evaluateExpression(innerCstyle[4], vars)
      innerConditionStr = `${innerLoopVar} < ${innerLimitVal}`
    } else if (innerPystyle) {
      innerLoopVar = innerPystyle[1]
      const rangeArgs = innerPystyle[2].split(',').map(arg => evaluateExpression(arg.trim(), vars))
      if (rangeArgs.length === 1) {
        innerLimitVal = rangeArgs[0]
      } else {
        innerStartVal = rangeArgs[0]
        innerLimitVal = rangeArgs[1]
      }
      vars[innerLoopVar] = innerStartVal
      innerConditionStr = `${innerLoopVar} < ${innerLimitVal}`
    }
  }

  // 4. Build simulation steps
  let safetyCounter = 0
  const maxSimulationSteps = 120

  // Standard step framework template builder
  const createStep = (
    lineIdx: number,
    explanation: string,
    condResult: boolean | string,
    node: 'start' | 'condition' | 'body' | 'update' | 'end',
    currIterIdx: number,
    stepLog: string
  ): LoopExecutionStep => {
    return {
      activeLine: lineIdx,
      variables: { ...vars },
      conditionResult: condResult,
      currentIterationIdx: currIterIdx,
      explanation,
      iterationsState: JSON.parse(JSON.stringify(iterations)),
      log: stepLog,
      stdout: [...stdout],
      flowchartNode: node
    }
  }

  // Push Initial Variable Declarations Step
  if (outerLoopLineIdx > 0) {
    const initVarsList = Object.entries(vars)
      .map(([k, v]) => `${k} = ${Array.isArray(v) ? `[${v.join(', ')}]` : v}`)
      .join(', ')

    steps.push({
      activeLine: 0,
      variables: { ...vars },
      conditionResult: 'checking...',
      currentIterationIdx: -1,
      explanation: `Initializing global workspace variables: ${initVarsList}.`,
      iterationsState: [],
      log: `Variable space initial bindings: ${initVarsList}`,
      stdout: [...stdout],
      flowchartNode: 'start'
    })
  }

  // Check loop execution structure
  const isFor = outerLine.startsWith('for')
  const isWhile = outerLine.startsWith('while')

  // Run virtual execution loops based on structure
  if (isFor || isArrayLoop) {
    if (isArrayLoop) {
      let arrayIdx = 0
      vars[loopVar] = vars[arrayVarName][0]

      steps.push(
        createStep(
          outerLoopLineIdx,
          `Initializing outer loop with array element: ${loopVar} = ${vars[loopVar]}.`,
          'checking...',
          'start',
          -1,
          `Initialized array traversal. First element ${loopVar} = ${vars[loopVar]}`
        )
      )

      while (safetyCounter < maxSimulationSteps) {
        const isConditionTrue = arrayIdx < vars[arrayVarName].length
        if (!isConditionTrue) {
          steps.push(
            createStep(
              outerLoopLineIdx,
              `End of array ${arrayVarName} reached. Loop terminates!`,
              false,
              'end',
              -1,
              `Loop terminated. Array bounds reached`
            )
          )
          break
        }

        const currIdx = iterations.length
        iterations.push({
          i: currIdx,
          val: vars[loopVar],
          status: 'active',
          explanation: `Executing iteration block ${currIdx + 1} with element ${loopVar} = ${vars[loopVar]}`
        })

        steps.push(
          createStep(
            outerLoopLineIdx,
            `Array loop: processing element at index ${arrayIdx} (${loopVar} = ${vars[loopVar]}).`,
            true,
            'condition',
            currIdx,
            `Processing index ${arrayIdx}: ${loopVar} = ${vars[loopVar]}`
          )
        )

        // Execute flat prints/operations inside outer body
        const outerBodyIndices = getBodyLineIndices(outerLoopLineIdx, outerLoopEndIdx, isPython)
        for (const bodyIdx of outerBodyIndices) {
          const bodyLine = originalCleanedLines[bodyIdx].trim()
          if (bodyLine === '}' || bodyLine === 'end' || bodyLine === '') continue

          const stdoutText = parseAndExecutePrint(bodyLine, vars)
          if (stdoutText !== null) {
            stdout.push(stdoutText)
            steps.push(
              createStep(
                bodyIdx,
                `Executing print output: printing value "${stdoutText}" to stdout console.`,
                'running',
                'body',
                currIdx,
                `Console print stdout: ${stdoutText}`
              )
            )
            continue
          }

          const oldVars = { ...vars }
          executeStatement(bodyLine, vars)

          let explanation = `Executing statement: ${bodyLine}.`
          let logMsg = `Executed: ${bodyLine}`
          for (const [k, val] of Object.entries(vars)) {
            if (oldVars[k] !== val) {
              explanation = `Updating variable state: calculating ${bodyLine}. Value updates: ${oldVars[k] !== undefined ? oldVars[k] : 'undefined'} ➔ ${val}.`
              logMsg = `Updated variable ${k} = ${val}`
              break
            }
          }

          steps.push(
            createStep(
              bodyIdx,
              explanation,
              'running',
              'body',
              currIdx,
              logMsg
            )
          )
        }

        const oldIdx = arrayIdx
        arrayIdx++
        if (arrayIdx < vars[arrayVarName].length) {
          vars[loopVar] = vars[arrayVarName][arrayIdx]
        }
        iterations[currIdx].status = 'completed'

        steps.push(
          createStep(
            outerLoopLineIdx,
            `Advancing array pointer to index ${arrayIdx}.`,
            'updating...',
            'update',
            currIdx,
            `Advanced index to ${arrayIdx}`
          )
        )

        safetyCounter++
      }
    } else {
      // Standard C-style or Python range for loop
      steps.push(
        createStep(
          outerLoopLineIdx,
          `Initializing outer loop counter: ${loopVar} = ${vars[loopVar]}.`,
          'checking...',
          'start',
          -1,
          `Initialized outer variable ${loopVar} = ${vars[loopVar]}`
        )
      )

      while (safetyCounter < maxSimulationSteps) {
        const evalVal = evaluateExpression(conditionStr, vars)
        const isConditionTrue = typeof evalVal === 'boolean' ? evalVal : Boolean(evalVal)

        if (!isConditionTrue) {
          steps.push(
            createStep(
              outerLoopLineIdx,
              `Evaluating condition: is ${conditionStr}? No (false). Loop terminates!`,
              false,
              'end',
              -1,
              `Loop terminated. Condition evaluated to false`
            )
          )
          break
        }

        const currIdx = iterations.length
        iterations.push({
          i: currIdx,
          val: vars[loopVar],
          status: 'active',
          explanation: `Executing iteration block ${currIdx + 1} with ${loopVar} = ${vars[loopVar]}`
        })

        steps.push(
          createStep(
            outerLoopLineIdx,
            `Evaluating condition: is ${conditionStr}? Yes (true). Entering outer loop body.`,
            true,
            'condition',
            currIdx,
            `Condition ${conditionStr} check is true`
          )
        )

        let innerActive = false
        if (innerLoopLineIdx !== -1) {
          innerActive = true
          let j = innerStartVal
          vars[innerLoopVar] = j
          const innerState: InnerIteration[] = []

          iterations[currIdx].innerIterations = innerState
          iterations[currIdx].explanation = `Running nested traversal inside iteration ${currIdx + 1}.`

          steps.push(
            createStep(
              innerLoopLineIdx,
              `Entering nested inner loop: initializing inner counter ${innerLoopVar} = ${j}.`,
              'nested start',
              'body',
              currIdx,
              `Nested inner loop initialized with ${innerLoopVar} = ${j}`
            )
          )

          let innerSafety = 0
          while (innerSafety < 100) {
            vars[innerLoopVar] = j
            const evalInner = evaluateExpression(innerConditionStr, vars)
            const isInnerTrue = typeof evalInner === 'boolean' ? evalInner : Boolean(evalInner)

            if (!isInnerTrue) {
              steps.push(
                createStep(
                  innerLoopLineIdx,
                  `Evaluating inner condition: is ${innerConditionStr}? No. Exiting inner loop.`,
                  'nested false',
                  'body',
                  currIdx,
                  `Inner condition false. Leaving inner loop`
                )
              )
              break
            }

            innerState.push({ j, status: 'active' })
            steps.push(
              createStep(
                innerLoopLineIdx,
                `Evaluating inner condition: is ${innerConditionStr}? Yes (true). Entering nested body.`,
                'nested true',
                'body',
                currIdx,
                `Inner check true for ${innerLoopVar} = ${j}`
              )
            )

            const innerBodyIndices = getBodyLineIndices(innerLoopLineIdx, innerLoopEndIdx, isPython)
            for (const bodyIdx of innerBodyIndices) {
              const bodyLine = originalCleanedLines[bodyIdx].trim()
              if (bodyLine === '}' || bodyLine === 'end' || bodyLine === '') continue

              const stdoutText = parseAndExecutePrint(bodyLine, vars)
              if (stdoutText !== null) {
                stdout.push(stdoutText)
                steps.push(
                  createStep(
                    bodyIdx,
                    `Nested print statement: outputting coordinate/value: "${stdoutText}".`,
                    'running',
                    'body',
                    currIdx,
                    `Printed nested coordinate: ${stdoutText}`
                  )
                )
              } else {
                executeStatement(bodyLine, vars)
              }
            }

            const oldJ = j
            if (innerCstyle) {
              const innerIncrementExpr = innerCstyle[5].trim()
              executeStatement(innerIncrementExpr, vars)
              j = vars[innerLoopVar]
            } else {
              j += innerStepVal
              vars[innerLoopVar] = j
            }
            innerState[innerState.length - 1].status = 'completed'

            steps.push(
              createStep(
                innerLoopLineIdx,
                `Incrementing inner counter: ${innerLoopVar} advances from ${oldJ} to ${j}.`,
                'incrementing inner',
                'body',
                currIdx,
                `Incremented inner counter ${innerLoopVar} = ${j}`
              )
            )
            innerSafety++
          }
        }

        if (!innerActive) {
          const outerBodyIndices = getBodyLineIndices(outerLoopLineIdx, outerLoopEndIdx, isPython)
          for (const bodyIdx of outerBodyIndices) {
            const bodyLine = originalCleanedLines[bodyIdx].trim()
            if (bodyLine === '}' || bodyLine === 'end' || bodyLine === '') continue

            const stdoutText = parseAndExecutePrint(bodyLine, vars)
            if (stdoutText !== null) {
              stdout.push(stdoutText)
              steps.push(
                createStep(
                  bodyIdx,
                  `Executing print output: printing value "${stdoutText}" to stdout console.`,
                  'running',
                  'body',
                  currIdx,
                  `Console print stdout: ${stdoutText}`
                )
              )
              continue
            }

            const oldVars = { ...vars }
            executeStatement(bodyLine, vars)

            let explanation = `Executing statement: ${bodyLine}.`
            let logMsg = `Executed: ${bodyLine}`
            for (const [k, val] of Object.entries(vars)) {
              if (oldVars[k] !== val) {
                explanation = `Updating variable state: calculating ${bodyLine}. Value updates: ${oldVars[k] !== undefined ? oldVars[k] : 'undefined'} ➔ ${val}.`
                logMsg = `Updated variable ${k} = ${val}`
                break
              }
            }

            steps.push(
              createStep(
                bodyIdx,
                explanation,
                'running',
                'body',
                currIdx,
                logMsg
              )
            )
          }
        }

        const oldVal = vars[loopVar]
        if (isPython) {
          vars[loopVar] += stepVal
        } else if (forCstyle) {
          const incrementExpr = forCstyle[6].trim()
          executeStatement(incrementExpr, vars)
        } else {
          vars[loopVar]++
        }
        const newVal = vars[loopVar]
        iterations[currIdx].status = 'completed'

        steps.push(
          createStep(
            outerLoopLineIdx,
            `Updating loop counter: ${loopVar} changes from ${oldVal} to ${newVal}.`,
            'updating...',
            'update',
            currIdx,
            `Incremented counter ${loopVar} = ${newVal}`
          )
        )

        safetyCounter++
      }

      if (safetyCounter >= maxSimulationSteps) {
        return {
          steps,
          error: 'Execution safety check triggered: potential infinite loop detected (exceeded max iteration cycles).',
          originalCleanedLines,
          conditionStr
        }
      }
    }
  }

  // WHILE / DO-WHILE LOOPS
  else if (isWhile || isDoWhile) {
    steps.push(
      createStep(
        outerLoopLineIdx,
        `Loop initialization: Preparing variable counters. Current value of ${loopVar} = ${vars[loopVar]}.`,
        'checking...',
        'start',
        -1,
        `Initialized while loop variable ${loopVar} = ${vars[loopVar]}`
      )
    )

    let isDoBlockRunOnce = false

    while (safetyCounter < maxSimulationSteps) {
      let isConditionTrue = false

      if (isDoWhile && !isDoBlockRunOnce) {
        isConditionTrue = true
      } else {
        const evalVal = evaluateExpression(conditionStr, vars)
        isConditionTrue = typeof evalVal === 'boolean' ? evalVal : Boolean(evalVal)
      }

      if (!isConditionTrue) {
        let termLine = outerLoopLineIdx
        if (isDoWhile) {
          const matchingWhile = originalCleanedLines.findIndex(l => l.includes('while') && l.includes('}'))
          if (matchingWhile !== -1) termLine = matchingWhile
        }
        steps.push(
          createStep(
            termLine,
            `Validating loop condition: is ${conditionStr}? No (false). Exiting loop.`,
            false,
            'end',
            -1,
            `While condition false. Loop exited successfully`
          )
        )
        break
      }

      const currIdx = iterations.length
      iterations.push({
        i: currIdx,
        val: vars[loopVar],
        status: 'active',
        explanation: `Running while iteration block ${currIdx + 1} with ${loopVar} = ${vars[loopVar]}`
      })

      if (!isDoWhile || isDoBlockRunOnce) {
        steps.push(
          createStep(
            outerLoopLineIdx,
            `Validating loop condition: is ${conditionStr}? Yes (true). Entering while loop body.`,
            true,
            'condition',
            currIdx,
            `Condition check is true`
          )
        )
      } else {
        steps.push(
          createStep(
            outerLoopLineIdx,
            `Do-While loop enters execution body first pass unconditionally.`,
            'run once',
            'condition',
            currIdx,
            `Unconditional body entry`
          )
        )
        isDoBlockRunOnce = true
      }

      let incrementSeenInBody = false
      let incrementLineIdx = -1
      const oldVal = vars[loopVar]

      const whileBodyIndices = getBodyLineIndices(outerLoopLineIdx, outerLoopEndIdx, isPython)
      for (const bodyIdx of whileBodyIndices) {
        const bodyLine = originalCleanedLines[bodyIdx].trim()
        if (bodyLine === '}' || bodyLine === 'end' || bodyLine === '' || bodyLine.startsWith('while') || bodyLine.startsWith('} while')) continue

        const isUpdate = bodyLine.match(new RegExp('\\b' + loopVar + '\\s*(?:\\+\\+|--|\\+=|-=|\\*=|/=|\\s*=)'))
        if (isUpdate) {
          incrementSeenInBody = true
          incrementLineIdx = bodyIdx
          executeStatement(bodyLine, vars)
          continue
        }

        const stdoutText = parseAndExecutePrint(bodyLine, vars)
        if (stdoutText !== null) {
          stdout.push(stdoutText)
          steps.push(
            createStep(
              bodyIdx,
              `Executing print: outputting value "${stdoutText}" inside while body.`,
              'running',
              'body',
              currIdx,
              `Printed loop value: ${stdoutText}`
            )
          )
        } else {
          const oldVars = { ...vars }
          executeStatement(bodyLine, vars)

          let explanation = `Executing statement: ${bodyLine}.`
          let logMsg = `Executed: ${bodyLine}`
          for (const [k, val] of Object.entries(vars)) {
            if (oldVars[k] !== val) {
              explanation = `Updating variable state: calculating ${bodyLine}. Value updates: ${oldVars[k] !== undefined ? oldVars[k] : 'undefined'} ➔ ${val}.`
              logMsg = `Updated variable ${k} = ${val}`
              break
            }
          }

          steps.push(
            createStep(
              bodyIdx,
              explanation,
              'running',
              'body',
              currIdx,
              logMsg
            )
          )
        }
      }

      iterations[currIdx].status = 'completed'

      if (incrementSeenInBody) {
        steps.push(
          createStep(
            incrementLineIdx,
            `Updating variable counter: incrementing ${loopVar} from ${oldVal} to ${vars[loopVar]}.`,
            'updating...',
            'update',
            currIdx,
            `Incremented outer counter ${loopVar} = ${vars[loopVar]}`
          )
        )
      } else {
        // Fallback default update to prevent infinite looping
        vars[loopVar]++
      }

      safetyCounter++
    }

    if (safetyCounter >= maxSimulationSteps) {
      return {
        steps,
        error: 'Safety Limit Exceeded: Potential infinite while loop detected. Please make sure your counter is incremented inside the body.',
        originalCleanedLines,
        conditionStr
      }
    }
  }

  return { steps, error: null, originalCleanedLines, conditionStr }
}

// Sub-utility to extract print statement outputs
const parseAndExecutePrint = (line: string, vars: Record<string, any>): string | null => {
  // C-style print: print(i) or printf("%d", i)
  const printfMatch = line.match(/printf\s*\(\s*"([^"]+)"\s*(?:,\s*([^)]+))?\s*\)/)
  const printMatch = line.match(/print\s*\(\s*([^)]+)\s*\)/)
  // C++ Style: cout << i;
  const coutMatch = line.match(/(?:std::)?cout\s*<<\s*([^;]+)/)
  // Java style: System.out.println(i)
  const javaMatch = line.match(/System\.out\.print(?:ln)?\s*\(\s*([^)]+)\s*\)/)

  const printTarget = printfMatch ? printfMatch[2] : (printMatch ? printMatch[1] : (coutMatch ? coutMatch[1] : (javaMatch ? javaMatch[1] : null)))

  if (printTarget) {
    const rawExpr = printTarget.replace(/<<\s*(?:std::)?endl/g, '').trim()
    const evaluated = evaluateExpression(rawExpr, vars)
    if (Array.isArray(evaluated)) {
      return `[${evaluated.join(', ')}]`
    }
    return String(evaluated)
  }

  // Handle plain print matches with string quotes e.g. print("hello")
  if (printfMatch && !printfMatch[2]) {
    return printfMatch[1]
  }

  return null
}
