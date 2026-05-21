import { AlgorithmExecutor } from './AlgorithmExecutor'
import { ExecutionStep, AlgorithmMetadata, PseudocodeLine } from './algorithmTypes'

const METADATA: AlgorithmMetadata = { name: 'Merge Sort', description: '', type: 'merge-sort', visualizationType: 'bars', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', category: 'sorting' }
const PSEUDOCODE: PseudocodeLine[] = [{ lineNumber: 1, code: 'procedure mergeSort(A, left, right)' }, { lineNumber: 2, code: '  if left < right' }, { lineNumber: 3, code: '    mid = (left + right) / 2' }, { lineNumber: 4, code: '    mergeSort(A, left, mid)' }, { lineNumber: 5, code: '    mergeSort(A, mid+1, right)' }, { lineNumber: 6, code: '    merge(A, left, mid, right)' }]

export class MergeSortExecutor extends AlgorithmExecutor {
  constructor(data: number[]) { super(data, METADATA, PSEUDOCODE); this.state.history = this.generateSteps(); this.state.totalSteps = this.state.history.length; }

  generateSteps(): ExecutionStep[] {
    const steps: ExecutionStep[] = [{ stepNumber: 0, action: 'initialize', explanation: 'Starting Merge Sort', comparisons: 0, swaps: 0, pseudocodeLineNumber: 1, visualizationState: { data: [...this.state.data], visualData: this.state.data.map((val, idx) => ({ id: `id-${idx}`, val })) } }];
    const arr = [...this.state.data];
    const visualArr = arr.map((val, idx) => ({ id: `id-${idx}`, val }));
    let stepNum = 1, comparisons = 0, swaps = 0;
    
    // Simplified merge sort visualization - shows splitting and merging
    const mergeSort = (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        steps.push({ stepNumber: stepNum++, action: 'split', explanation: `Splitting range [${left}, ${right}]`, indices: Array.from({length: right-left+1}, (_,i) => left+i), comparisons, swaps, pseudocodeLineNumber: 4, visualizationState: { data: [...arr], visualData: [...visualArr] } });
        mergeSort(left, mid);
        mergeSort(mid + 1, right);
        merge(left, mid, right);
      }
    };
    
    const merge = (left: number, mid: number, right: number) => {
      const temp = [];
      const tempV = [];
      let i = left, j = mid + 1;
      
      while (i <= mid && j <= right) {
        comparisons++;
        if (arr[i] <= arr[j]) {
          temp.push(arr[i]);
          tempV.push(visualArr[i]);
          i++;
        } else {
          temp.push(arr[j]);
          tempV.push(visualArr[j]);
          j++;
        }
        swaps++;
        steps.push({ stepNumber: stepNum++, action: 'merge', explanation: `Merging elements`, indices: [i, j], comparisons, swaps, pseudocodeLineNumber: 6, visualizationState: { data: [...arr], visualData: [...visualArr] } });
      }
      
      while (i <= mid) { temp.push(arr[i]); tempV.push(visualArr[i]); i++; swaps++; }
      while (j <= right) { temp.push(arr[j]); tempV.push(visualArr[j]); j++; swaps++; }
      
      for (let k = 0; k < temp.length; k++) {
        arr[left + k] = temp[k];
        
        const targetId = tempV[k].id;
        const origIdx = visualArr.findIndex(item => item.id === targetId);
        
        if (origIdx !== -1 && origIdx !== left + k) {
          const tempElement = visualArr[left + k];
          visualArr[left + k] = visualArr[origIdx];
          visualArr[origIdx] = tempElement;
        } else if (origIdx === -1) {
          visualArr[left + k] = tempV[k];
        }

        steps.push({ 
          stepNumber: stepNum++, 
          action: 'merge_step', 
          explanation: `Placed element ${temp[k]} at index ${left + k}`, 
          indices: [left + k], 
          comparisons, 
          swaps, 
          pseudocodeLineNumber: 6, 
          visualizationState: { data: [...arr], visualData: [...visualArr] } 
        });
      }
    };
    
    mergeSort(0, arr.length - 1);
    steps.push({ stepNumber: stepNum++, action: 'complete', explanation: 'Sorted!', comparisons, swaps, pseudocodeLineNumber: 1, visualizationState: { data: [...arr], visualData: [...visualArr], sorted: true } });
    return steps;
  }
}
