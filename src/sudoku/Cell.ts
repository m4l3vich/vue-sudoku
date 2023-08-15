export type SudokuCellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export enum SudokuCellValidityState {
  Unknown, Fixed, Valid, DuplicateInRow, DuplicateInColumn, DuplicateInSquare
}

export function isSudokuCellValue (value: any): value is SudokuCellValue {
  if (isNaN(value)) return false
  return Number(value) >= 0 && Number(value) <= 9
}

export class SudokuCell {
  value: SudokuCellValue
  validity: SudokuCellValidityState = SudokuCellValidityState.Unknown

  constructor (value: number | null, isFixed: boolean = false) {
    if (!isSudokuCellValue(value)) {
      throw new Error('Invalid value, must be a number between 1 and 9')
    }

    this.value = value

    if (isFixed) {
      this.validity = SudokuCellValidityState.Fixed
    }
  }

  get isDuplicate (): boolean {
    return this.validity !== SudokuCellValidityState.Fixed &&
      this.validity !== SudokuCellValidityState.Valid &&
      this.validity !== SudokuCellValidityState.Unknown
  }

  get isDuplicateOrUnknown (): boolean {
    return this.isDuplicate || this.validity === SudokuCellValidityState.Unknown
  }

  get isEmpty (): boolean {
    return this.value === 0
  }

  get isInvalid (): boolean {
    return this.isDuplicate || this.isEmpty
  }

  get isInvalidOrUnknown (): boolean {
    return this.isInvalid || this.validity === SudokuCellValidityState.Unknown
  }

  get isFixed (): boolean {
    return this.validity === SudokuCellValidityState.Fixed
  }

  get isValid (): boolean {
    return this.isFixed || this.validity === SudokuCellValidityState.Valid
  }
}
