import { SudokuField } from '@/sudoku'
import { SudokuCellValue } from '@/sudoku/Cell'

export function * solveBacktrack (field: SudokuField): IterableIterator<void> {
  let currentCell = 0
  let backtracked = false

  while (true) {
    if (currentCell >= field.cells.length) return

    const cell = field.cells[currentCell]
    console.log('checking cell', currentCell, cell.value)

    const willProceed = (cell.isInvalid || (backtracked && cell.value < 9)) && !cell.isFixed

    if (!willProceed) {
      console.log(currentCell, 'is good, proceeding')
      if (backtracked) {
        if (!cell.isFixed) cell.value = 0
        currentCell--
      } else {
        currentCell++
      }

      continue
    }

    if (!backtracked) cell.value = 0
    do {
      cell.value = cell.value + 1 as SudokuCellValue
      field.validateCell(currentCell)
      yield
    } while (cell.isInvalid && cell.value < 9)

    if (cell.isInvalid) {
      console.log('uh oh backtrack')
      cell.value = 0
      backtracked = true
      currentCell--
    } else {
      currentCell++
      backtracked = false
    }
  }
}
