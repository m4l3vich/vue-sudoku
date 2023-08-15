<script setup lang="ts">
import { reactive, ref } from 'vue'

import SudokuFieldVue from './components/SudokuField.vue'
import LooperControls from './components/LooperControls.vue'

import { SudokuCell, SudokuField } from '@/sudoku'
import { isSudokuCellValue, SudokuCellValidityState } from './sudoku/Cell'
import { Looper } from './solver/looper'
import { solveBacktrack } from './solver'
const field = reactive(
  new SudokuField(
    [
      5, 0, 1, 0, 0, 4, 0, 0, 2,
      6, 0, 9, 5, 0, 7, 3, 8, 0,
      0, 0, 7, 0, 0, 0, 4, 0, 0,
      0, 0, 6, 3, 0, 2, 0, 1, 0,
      2, 1, 0, 0, 0, 0, 0, 0, 6,
      7, 0, 0, 9, 0, 0, 8, 2, 4,
      3, 0, 0, 6, 0, 1, 2, 0, 8,
      9, 6, 0, 7, 0, 0, 1, 0, 5,
      0, 0, 5, 2, 0, 0, 6, 7, 0
    ].map(e => new SudokuCell(e, e !== 0))
  )
)

const looper = reactive(new Looper(false, 100))
let solver = solveBacktrack(field)

const isFieldValid = ref<boolean>(field.isValid)
const editMode = ref<boolean>(false)

looper.on(looper.event, () => {
  const result = solver.next()

  if (result.done) {
    field.validate()
    isFieldValid.value = field.isValid

    if (field.isValid) looper.automatic = false
  }
})

interface IOnCellChange {
  x: number
  y: number
  event: InputEvent
}

function onCellChange (args: IOnCellChange) {
  const { x, y, event } = args

  const target = event.target as HTMLInputElement

  const cell = field.cellAt(x, y)
  const value = target.value === '' ? 0 : Number(target.value)

  const isEditable = editMode.value || !cell.isFixed

  // TODO: sometimes changes target.value to '0'
  if (!isSudokuCellValue(value) || !isEditable) {
    // Return old value
    target.value = cell.value === 0 ? '' : cell.value.toString()
    return
  }

  // In edit mode...
  if (editMode.value) {
    // ...if the cell value is cleared,
    // make it non-fixed, else make it fixed
    cell.validity = value === 0
      ? SudokuCellValidityState.Unknown
      : SudokuCellValidityState.Fixed
  }

  cell.value = value
  field.validate()
  isFieldValid.value = field.isValid
}

function resetField () {
  for (const cell of field.cells) {
    if (cell.validity !== SudokuCellValidityState.Fixed) {
      cell.value = 0
    }
  }

  field.validate()
  isFieldValid.value = field.isValid
  solver = solveBacktrack(field)
}

function clearField () {
  const answer = window.confirm(
    'ВСЕ клетки поля будут очищены. Вы уверены?'
  )

  if (!answer) return

  for (const cell of field.cells) {
    cell.value = 0
    cell.validity = SudokuCellValidityState.Unknown
  }

  isFieldValid.value = false
}
</script>

<template>
  <SudokuFieldVue
    :field="field"
    @change="onCellChange"
  />

  <div class="controls-container">
    <LooperControls
      :looper="looper"
      :disableControls="isFieldValid"
      @changeDelay="v => looper.delay = v"
      @changeAutomatic="v => looper.automatic = v"
      @reset="resetField"
    />

    <div class="controls">
      <button @click="resetField">
        Сбросить поле
      </button>

      <button @click="() => editMode = !editMode">
        Редакт. поле
      </button>

      <span style="grid-column: 1 / 3;">
        Редактирование поля
        <span v-if="editMode" style="color: green">ВКЛ</span>
        <span v-else style="color: red">ВЫКЛ</span>
      </span>

      <template v-if="editMode">
        <span style="grid-column: 1 / 3; color: gray">
          В режиме редактирования можно изменять значения фиксированных ячеек (подсказок, т.е. значения ячеек черного цвета)
        </span>

        <button @click="clearField" style="grid-column: 1 / 3;">
          ОЧИСТИТЬ ВСЕ ЯЧЕЙКИ
        </button>
      </template>
    </div>
  </div>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.controls-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.controls {

  border: 1px solid black;
  padding: 16px 24px;

  display: grid;
  grid-gap: 8px 8px;
  grid-template-columns: repeat(2, 128px);
  grid-auto-rows: auto;
  justify-items: stretch;
  align-items: center;
}
</style>
