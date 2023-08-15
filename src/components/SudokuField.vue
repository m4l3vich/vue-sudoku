<script setup lang="ts">
import { reactive } from 'vue'
import { SudokuField } from '@/sudoku'
import SudokuCellVue from './SudokuCell.vue'

defineProps<{ field: SudokuField }>()
const emit = defineEmits(['change'])
</script>

<template>
  <table class="sudoku-field">
    <tr v-for="y in 9" :key="y" class="sudoku-field__row">
      <SudokuCellVue
        v-for="x in 9"
        :key="`${x}-${y}`"
        :cellLocation="{ x, y }"
        :cell="field.cellAt(x, y)"
        @change="event => emit('change', { x, y, event })"
      />
    </tr>
  </table>
</template>

<style lang="scss">
.sudoku-field {
  table-layout: fixed;
  border-collapse: collapse;
  border: 1px solid black;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;

  &__row:nth-child(3n + 3) td {
    border-bottom: 1px solid black;
  }

  &__cell:nth-child(3n + 3) {
    border-right: 1px solid black;
  }

  & tr:first-child td {
    border-top: 0;
  }

  & tr td:first-child {
    border-left: 0;
  }

  & tr:last-child td {
    border-bottom: 0;
  }

  & tr td:last-child {
    border-right: 0;
  }
}
</style>
