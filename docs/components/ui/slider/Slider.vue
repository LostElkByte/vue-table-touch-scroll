<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'radix-vue'

interface Props {
  modelValue?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: undefined,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const sliderValue = computed({
  get: () => (props.modelValue !== undefined ? [props.modelValue] : undefined),
  set: (value) => {
    if (value) {
      emit('update:modelValue', value[0])
    }
  },
})
</script>

<template>
  <SliderRoot
    v-model="sliderValue"
    :default-value="defaultValue !== undefined ? [defaultValue] : undefined"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :name="name"
    class="relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
  >
    <SliderTrack
      class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
    >
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb
      class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
    />
  </SliderRoot>
</template>
