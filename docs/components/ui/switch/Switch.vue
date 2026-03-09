<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue'

interface Props {
  modelValue?: boolean
  defaultValue?: boolean
  disabled?: boolean
  id?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <SwitchRoot
    :id="id"
    :checked="modelValue"
    :default-checked="defaultValue"
    :disabled="disabled"
    class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
    @update:checked="emit('update:modelValue', $event)"
  >
    <SwitchThumb
      class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
    />
  </SwitchRoot>
</template>
