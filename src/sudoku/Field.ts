import { SudokuCell, SudokuCellValidityState } from './Cell'

type Tuple81<T> = [
  T, T, T, T, T, T, T, T, T,
  T, T, T, T, T, T, T, T, T,
  T, T, T, T, T, T, T, T, T,
  T, T, T, T, T, T, T, T, T,
  T, T, T, T, T, T, T, T, T,
  T, T, T, T, T, T, T, T, T,
  T, T, T, T, T, T, T, T, T,
  T, T, T, T, T, T, T, T, T,
  T, T, T, T, T, T, T, T, T
]

function isTuple81<T> (arr: T[]): arr is Tuple81<T> {
  return arr.length === 81
}

export class SudokuField {
  cells: Tuple81<SudokuCell>

  constructor (field: SudokuCell[]) {
    if (!isTuple81<SudokuCell>(field)) {
      throw new Error(`Field should have exactly 81 items, but it has ${field.length}.`)
    }

    for (const i in field) {
      if (!(field[i] instanceof SudokuCell)) {
        throw new Error(`Field item ${i} is not a SudokuCell.`)
      }
    }

    this.cells = field
  }

  get isValid (): boolean {
    return this.cells.find(e => e.isDuplicateOrUnknown) === undefined
  }

  cellAt (x: number, y: number): SudokuCell {
    return this.cells[(x - 1) + 9 * (y - 1)]
  }

  validateCell (i: number): SudokuCellValidityState {
    const cell = this.cells[i]
    if (cell === undefined) return SudokuCellValidityState.Unknown
    if (cell.isFixed) return cell.validity

    const rowValues = []
    const columnValues = []
    const squareValues = []

    const targetRow = Math.floor(i / 9)
    const targetColumn = i % 9
    const targetSquare = Math.floor((i % 9) / 3) + 3 * Math.floor(i / (9 * 3))

    for (const [index, cell] of this.cells.entries()) {
      const i = Number(index)
      const rowIndex = Math.floor(i / 9)
      const columnIndex = i % 9
      const squareIndex = Math.floor((i % 9) / 3) + 3 * Math.floor(i / (9 * 3))

      if (rowIndex === targetRow) {
        rowValues.push(cell.value)
      }

      if (columnIndex === targetColumn) {
        columnValues.push(cell.value)
      }

      if (squareIndex === targetSquare) {
        squareValues.push(cell.value)
      }
    }

    const val = cell.value
    const hasRowDuplicate = rowValues.indexOf(val) !== rowValues.lastIndexOf(val)
    if (hasRowDuplicate) {
      cell.validity = SudokuCellValidityState.DuplicateInRow
      return cell.validity
    }

    const hasColumnDuplicate = columnValues.indexOf(val) !== columnValues.lastIndexOf(val)
    if (hasColumnDuplicate) {
      cell.validity = SudokuCellValidityState.DuplicateInColumn
      return cell.validity
    }

    const hasSquareDuplicate = squareValues.indexOf(val) !== squareValues.lastIndexOf(val)
    if (hasSquareDuplicate) {
      cell.validity = SudokuCellValidityState.DuplicateInSquare
      return cell.validity
    }

    cell.validity = SudokuCellValidityState.Valid
    return cell.validity
  }

  validated: boolean = false
  validate (): void {
    this.validated = false
    const pools: SudokuCell[][] = [
      [], [], [], [], [], [], [], [], [], // rows
      [], [], [], [], [], [], [], [], [], // columns
      [], [], [], [], [], [], [], [], [] /// squares
    ]

    for (const [index, item] of this.cells.entries()) {
      if (!item.isFixed) {
        item.validity = SudokuCellValidityState.Unknown
      }

      const i = Number(index)

      const rowIndex = Math.floor(i / 9)
      const columnIndex = i % 9
      const squareIndex = Math.floor((i % 9) / 3) + 3 * Math.floor(i / (9 * 3))

      pools[rowIndex].push(item)
      pools[columnIndex + 9].push(item)
      pools[squareIndex + 18].push(item)
    }

    for (const [index, pool] of pools.entries()) {
      const poolType = Math.floor(Number(index) / 9)

      for (const [cellIndex, cell] of pool.entries()) {
        const val = cell.value

        if (val === null) {
          cell.validity = SudokuCellValidityState.Unknown
          continue
        }

        if (cell.isFixed || cell.isDuplicate) {
          continue
        }

        const hasDuplicate = pool.find((e, i) => e.value === val && cellIndex !== i)

        if (hasDuplicate === undefined) {
          cell.validity = SudokuCellValidityState.Valid
        } else {
          cell.validity = {
            0: SudokuCellValidityState.DuplicateInRow,
            1: SudokuCellValidityState.DuplicateInColumn,
            2: SudokuCellValidityState.DuplicateInSquare
          }[poolType] as SudokuCellValidityState
        }
      }
    }

    this.validated = true
  }
}
