<script setup lang="ts">
import { SudokuCell } from '@/sudoku'
import { SudokuCellValidityState } from '@/sudoku/Cell'
import { ref, computed } from 'vue'

const emit = defineEmits(['change'])
const props = defineProps<{
  cell: SudokuCell,
  cellLocation: { x: number, y: number }
}>()

const cellValueStr = computed<string>(() => {
  if (props.cell.value === 0) return ''
  else return props.cell.value.toString()
})

const inputId = ref<string>(`${props.cellLocation.x}-${props.cellLocation.y}`)

function onKeyDown (event: KeyboardEvent) {
  if (!event.code.startsWith('Arrow')) return

  event.preventDefault()

  const loc = props.cellLocation
  let newInputId: string

  switch (event.code) {
    case 'ArrowLeft':
      newInputId = `${loc.x - 1}-${loc.y}`
      break
    case 'ArrowRight':
      newInputId = `${loc.x + 1}-${loc.y}`
      break
    case 'ArrowUp':
      newInputId = `${loc.x}-${loc.y - 1}`
      break
    case 'ArrowDown':
      newInputId = `${loc.x}-${loc.y + 1}`
      break
    default:
      return
  }

  const newInput = document.getElementById(newInputId)
  if (!newInput) return
  newInput.focus()
}

function onFocus (event: FocusEvent) {
  const currentInput = event.target as HTMLInputElement
  setTimeout(() => {
    currentInput.setSelectionRange(1, 2)
  }, 0)
}
</script>

<template>
  <td
    :class="{
      'sudoku-cell': true,
      'sudoku-cell_valid': cell.validity === SudokuCellValidityState.Valid,
      'sudoku-cell_invalid': cell.isDuplicate
    }"
    :title="`validity = ${cell.validity}`"
  >
    <input
      :id="inputId"
      class="sudoku-cell__input"
      :value="cellValueStr"
      @input="event => emit('change', event)"
      @keydown="onKeyDown"
      @focus="onFocus"
    >
  </td>
</template>

<style lang="scss">
.sudoku-cell {
  width: 48px;
  height: 48px;
  border: 1px solid rgba(black, 0.3);

  &_valid > input {
    color: green;
  }

  &_invalid > input {
    color: red;
  }

  &__input {
    font-size: 24px;
    width: 40px;
    text-align: center;
    border: none;
    outline: none;
  }
}
</style>
