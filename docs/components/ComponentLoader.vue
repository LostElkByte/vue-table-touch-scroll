<script lang="ts" setup>
import Switch from './ui/switch/Switch.vue'
import Slider from './ui/slider/Slider.vue'
import { useI18n } from 'vue-i18n'

interface Props {
  componentName?: string
  id?: string
  type?: string
  label?: string
  class?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'lucide:square-terminal',
})

const { t } = useI18n()

// 控制栏状态
const isEnabled = ref(true)
const friction = ref(0.95)

// 提供给示例组件的上下文
provide('viewerContext', {
  isEnabled: readonly(isEnabled),
  friction: readonly(friction),
})

// 将 PascalCase 转换为 kebab-case
function pascalToKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

// 动态导入示例组件
const ExampleComponent = defineAsyncComponent({
  loader: () => {
    if (!props.componentName) {
      return Promise.reject(new Error('componentName is required'))
    }
    const fileName = pascalToKebab(props.componentName)
    return import(`./examples/${fileName}.vue`)
  },
  errorComponent: {
    setup() {
      return () =>
        h('div', { class: 'p-4 text-red-500' }, 'Failed to load component')
    },
  },
})
</script>

<template>
  <div class="my-4 w-full space-y-4">
    <!-- 工具栏 -->
    <div
      class="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
    >
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium">{{ t('viewer.disabled') }}</span>
        <Switch v-model="isEnabled" />
        <span class="text-sm font-medium">{{ t('viewer.enabled') }}</span>
      </div>
      <div class="hidden h-8 w-px bg-border sm:block" />
      <div class="flex min-w-[200px] flex-1 items-center gap-3">
        <span class="whitespace-nowrap text-sm font-medium">{{
          t('viewer.friction')
        }}</span>
        <Slider
          v-model="friction"
          :min="0.8"
          :max="0.99"
          :step="0.01"
          :disabled="!isEnabled"
          class="flex-1"
        />
        <span
          class="w-12 text-right text-sm tabular-nums text-muted-foreground"
        >
          {{ friction.toFixed(2) }}
        </span>
      </div>
    </div>

    <!-- CodeGroup - 包含预览和代码 -->
    <ClientOnly>
      <CodeGroup>
        <div :label="label || componentName" icon="lucide:laptop-minimal">
          <div class="h-[400px] overflow-auto p-1">
            <ExampleComponent />
          </div>
        </div>

        <CodeViewerTab v-bind="$props" label="Code" />
      </CodeGroup>
    </ClientOnly>
  </div>
</template>
