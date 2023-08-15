<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  // TODO: make this a good type
  looper: any,
  disableControls: boolean
}>()

const emit = defineEmits([
  'changeAutomatic', 'changeDelay'
])

// Event handlers
function onAutomaticChange (event: Event) {
  const target = event.target as HTMLInputElement
  emit('changeAutomatic', target.checked)
}

function onDelayChange (event: Event) {
  const target = event.target as HTMLInputElement
  emit('changeDelay', target.valueAsNumber)
}

// Trigger counter
const triggerCount = ref(0)
props.looper.on(props.looper.event, () => {
  triggerCount.value++
})
</script>

<template>
  <div class="looper-controls">
    <div class="looper-controls__title">
      <b>VueSudoku</b><br/>
      <span>
        Cчет шагов: {{ triggerCount }}
      </span>
    </div>

    <label class="looper-controls__automatic-switch">
      Автоматически
      <input
        type="checkbox"
        :disabled="disableControls"
        :checked="looper.automatic"
        @input="onAutomaticChange"
      />
    </label>

    <label class="looper-controls__delay-input">
      Задержка
      <input
        type="number"
        :disabled="disableControls || looper.automatic"
        :value="looper.delay"
        @change="onDelayChange"
      />
    </label>

    <div class="looper-controls__actions">
      <button @click="() => looper.trigger()" :disabled="disableControls">
        Сделать шаг
      </button>

      <button @click="() => triggerCount = 0">
        Сбросить счетчик
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.looper-controls {
  font-family: Avenir, Helvetica, Arial, sans-serif;

  border: 1px solid black;

  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(3, auto);
  gap: 16px 16px;
  padding: 16px;
  justify-items: center;
  align-items: center;
  grid-template-areas:
    "title title"
    "automatic_switch delay_input"
    "actions actions";

  &__title {
    grid-area: title;
    text-align: center;
  }

  &__automatic-switch {
    grid-area: automatic_switch;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__delay-input {
    grid-area: delay_input;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__actions {
    grid-area: actions;

    display: grid;
    grid-gap: 8px 8px;
    grid-template-columns: repeat(2, 128px);
    grid-auto-rows: auto;
    justify-items: stretch;
    align-items: center;
  }
}
</style>
