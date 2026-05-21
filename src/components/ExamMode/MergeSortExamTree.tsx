import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExamPassStep, ExamPass } from './ExamModeContainer'

export interface TreeElement {
  id: string;
  val: number;
  status?: 'default' | 'compare' | 'merged';
}

export interface MergeTreeNode {
  id: string;
  level: number;
  leftIdx: number;
  rightIdx: number;
  elements: TreeElement[];
  status: 'active' | 'split' | 'merging' | 'sorted';
  parentId?: string;
}

export const generateMergeSortExamSteps = (data: number[]): ExamPass[] => {
  const arr = [...data];
  const originalElements = arr.map((val, idx) => ({ id: `el-${val}-${idx}`, val, status: 'default' as const }));
  const passSteps: ExamPassStep[] = [];
  
  let treeNodes: Record<string, MergeTreeNode> = {};
  const rootId = `0-${arr.length - 1}-0`;
  
  treeNodes[rootId] = {
    id: rootId,
    level: 0,
    leftIdx: 0,
    rightIdx: arr.length - 1,
    elements: [...originalElements],
    status: 'active'
  };

  const pushStep = (actionLabel: string, explanation: string) => {
    const nodesCopy: Record<string, MergeTreeNode> = {};
    for (const [key, node] of Object.entries(treeNodes)) {
      nodesCopy[key] = {
        ...node,
        elements: node.elements.map(e => ({...e}))
      };
    }
    
    passSteps.push({
      label: actionLabel,
      arrayState: [...arr],
      explanation,
      treeNodes: Object.values(nodesCopy)
    });
  };

  pushStep('Initialize', 'Starting Merge Sort. The entire array is our initial root node.');

  const mergeSort = (left: number, right: number, level: number, parentId: string) => {
    const nodeId = `${left}-${right}-${level}`;
    
    if (nodeId !== rootId) {
      treeNodes[nodeId] = {
        id: nodeId,
        level,
        leftIdx: left,
        rightIdx: right,
        elements: originalElements.slice(left, right + 1).map(e => ({...e, status: 'default'})),
        status: 'active',
        parentId
      };
      pushStep(`Split [${left}, ${right}]`, `Splitting parent array into left and right sub-arrays.`);
    }

    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      treeNodes[nodeId].status = 'split';
      
      mergeSort(left, mid, level + 1, nodeId);
      mergeSort(mid + 1, right, level + 1, nodeId);
      merge(left, mid, right, level, nodeId);
    } else {
      treeNodes[nodeId].status = 'sorted';
      pushStep('Base Case', `Sub-array with single element is inherently sorted.`);
    }
  };

  const merge = (left: number, mid: number, right: number, level: number, nodeId: string) => {
    treeNodes[nodeId].status = 'merging';
    const leftChildId = `${left}-${mid}-${level+1}`;
    const rightChildId = `${mid+1}-${right}-${level+1}`;
    
    treeNodes[nodeId].elements = [];
    pushStep('Merge Start', `Ready to merge sorted left and right child arrays back into parent node.`);
    
    const tempElements = [];
    let i = left, j = mid + 1;
    let leftChildElements = treeNodes[leftChildId].elements;
    let rightChildElements = treeNodes[rightChildId].elements;
    let leftLocalIdx = 0, rightLocalIdx = 0;

    while (i <= mid && j <= right) {
      leftChildElements[leftLocalIdx].status = 'compare';
      rightChildElements[rightLocalIdx].status = 'compare';
      pushStep('Compare', `Comparing ${leftChildElements[leftLocalIdx].val} and ${rightChildElements[rightLocalIdx].val}.`);
      
      if (arr[i] <= arr[j]) {
        leftChildElements[leftLocalIdx].status = 'merged';
        const el = {...leftChildElements[leftLocalIdx], status: 'merged' as const};
        tempElements.push(el);
        treeNodes[nodeId].elements.push(el);
        i++; leftLocalIdx++;
      } else {
        rightChildElements[rightLocalIdx].status = 'merged';
        const el = {...rightChildElements[rightLocalIdx], status: 'merged' as const};
        tempElements.push(el);
        treeNodes[nodeId].elements.push(el);
        j++; rightLocalIdx++;
      }
      pushStep('Pick Smaller', `Placing the smaller element into the merged array.`);
    }
    
    while (i <= mid) { 
      leftChildElements[leftLocalIdx].status = 'merged';
      const el = {...leftChildElements[leftLocalIdx], status: 'merged' as const};
      tempElements.push(el);
      treeNodes[nodeId].elements.push(el);
      i++; leftLocalIdx++;
      pushStep('Copy Leftover', `Copying remaining element from left array.`);
    }
    while (j <= right) { 
      rightChildElements[rightLocalIdx].status = 'merged';
      const el = {...rightChildElements[rightLocalIdx], status: 'merged' as const};
      tempElements.push(el);
      treeNodes[nodeId].elements.push(el);
      j++; rightLocalIdx++;
      pushStep('Copy Leftover', `Copying remaining element from right array.`);
    }
    
    for (let k = 0; k < tempElements.length; k++) {
      arr[left + k] = tempElements[k].val;
      originalElements[left + k] = tempElements[k];
    }
    
    treeNodes[nodeId].status = 'sorted';
    pushStep('Merge Complete', `Successfully merged range [${left}, ${right}].`);
  };

  mergeSort(0, arr.length - 1, 0, "");
  pushStep('Done', 'Merge sort is complete! The entire array is sorted.');

  return [{ passNumber: 1, steps: passSteps }];
}


interface MergeSortExamTreeProps {
  treeNodes: MergeTreeNode[]
  examMode?: boolean
}

export const MergeSortExamTree: React.FC<MergeSortExamTreeProps> = ({ treeNodes, examMode = true }) => {
  const maxLevel = treeNodes.length > 0 ? Math.max(...treeNodes.map(n => n.level)) : 0
  const levels = Array.from({ length: maxLevel + 1 }, (_, i) => {
    return treeNodes.filter(n => n.level === i).sort((a, b) => a.leftIdx - b.leftIdx)
  })

  const getElementColor = (status?: string) => {
    switch (status) {
      case 'compare': return 'bg-yellow-500 border-yellow-300 text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
      case 'merged': return 'bg-emerald-600 border-emerald-400 text-white'
      default: return 'bg-slate-700 border-slate-500 text-slate-100'
    }
  }

  const getNodeStyling = (status: string) => {
    switch (status) {
      case 'active': return 'ring-2 ring-cyan-500/50'
      case 'split': return 'opacity-50 grayscale-[50%]'
      case 'merging': return 'ring-2 ring-yellow-500/80 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
      case 'sorted': return 'ring-2 ring-emerald-500/50'
      default: return ''
    }
  }

  return (
    <div className="flex flex-col h-full p-4 relative overflow-hidden text-slate-100">
      <div className="flex-1 overflow-auto flex flex-col items-center gap-10 p-4 min-h-[500px]">
        <AnimatePresence mode="popLayout">
          {levels.map((levelNodes, levelIdx) => (
            <motion.div 
              key={`level-${levelIdx}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-center items-start gap-12 w-full relative"
            >
              {levelNodes.map(node => (
                <div key={node.id} className="flex flex-col items-center gap-2">
                  {examMode && node.status === 'split' && (
                    <div className="text-purple-400 text-xs font-mono animate-pulse">
                      split({node.leftIdx}, {node.rightIdx})
                    </div>
                  )}

                  <motion.div
                    layout
                    className={`flex items-center gap-1 p-2 rounded-xl bg-slate-800/80 backdrop-blur border border-slate-700 transition-all duration-300 ${getNodeStyling(node.status)}`}
                  >
                    {node.elements.length === 0 ? (
                      <div className="h-10 w-10 flex items-center justify-center text-slate-500 italic text-sm">
                        ...
                      </div>
                    ) : (
                      <AnimatePresence>
                        {node.elements.map((el) => (
                          <motion.div
                            key={el.id}
                            layoutId={el.id}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 font-bold text-sm ${getElementColor(el.status)}`}
                          >
                            {el.val}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </motion.div>

                  {examMode && node.status === 'merging' && (
                    <div className="text-yellow-400 text-xs font-mono">
                      merge({node.leftIdx}, {node.rightIdx})
                    </div>
                  )}
                  {examMode && node.status === 'sorted' && levelIdx > 0 && (
                    <div className="text-emerald-400 text-xs font-mono">
                      merged
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
