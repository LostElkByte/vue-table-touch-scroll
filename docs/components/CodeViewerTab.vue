<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import hljs from 'highlight.js'
import '~/assets/css/code-theme.css'

interface Props {
  componentName?: string
  id?: string
  type?: string
  icon?: string
  class?: string
  extension?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'lucide:square-terminal',
  extension: 'vue',
})

const rawString = ref('')
const codeHtml = ref('')

const rawComponents = import.meta.glob('./examples/**/*.{vue,ts,js}', {
  query: '?raw',
  import: 'default',
})

function toFileName(name?: string, ext?: string) {
  if (!name) throw new Error('componentName is required')

  const kebab = name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

  return `${kebab}.${ext || 'vue'}`
}

const componentPath = computed(
  () => `./examples/${toFileName(props.componentName, props.extension)}`
)

onMounted(() => {
  loadAndProcessComponentCode()
})

async function loadAndProcessComponentCode() {
  try {
    const componentCode = await fetchComponentCode()
    rawString.value = componentCode
    codeHtml.value = hljs.highlightAuto(rawString.value, [
      'vue',
      'typescript',
      'javascript',
    ]).value
  } catch (error: any) {
    console.error('Error loading component code:', error)
  }
}

async function fetchComponentCode() {
  const path = componentPath.value
  const loadRawComponent = rawComponents[path]

  if (!loadRawComponent) throw new Error(`Component not found: ${path}`)

  const mod = await loadRawComponent()
  if (typeof mod !== 'string')
    throw new TypeError('Raw component code is not a string')

  return mod.trim()
}
</script>

<template>
  <div :icon="icon" class="relative flex max-h-[32rem]" :code="rawString">
    <CodeCopy class="absolute -top-12 right-0" :code="rawString" />
    <code class="min-w-full overflow-auto px-2 leading-4">
      <pre class="text-sm" v-html="codeHtml" />
    </code>
  </div>
</template>
