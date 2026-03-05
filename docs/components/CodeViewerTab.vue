<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import hljs from "highlight.js"
import { computed, onMounted, ref } from "vue"
import "~/assets/css/code-theme.css"

interface Props {
  componentName?: string
  id?: string
  type?: string
  icon?: string
  class?: string
  extension?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: "lucide:square-terminal",
  extension: "vue",
})
const rawString = ref("")
const codeHtml = ref("")

// Create a map of all possible components using import.meta.glob
const rawComponents = import.meta.glob(
  "/components/examples/**/*.{vue,ts,js}",
  {
    query: "?raw",
    import: "default",
  },
)

// helper to convert componentName to a filename in kebab-case
function toFileName(name?: string, ext?: string) {
  if (!name) throw new Error("componentName is required")

  const kebab = name
    .replace(/([a-z])([A-Z0-9])/g, "$1-$2")
    .replace(/(\d)([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()

  return `${kebab}.${ext || "vue"}`
}

// Compute the component path based on props
const componentPath = computed(
  () =>
    `/components/examples/${toFileName(props.componentName, props.extension)}`,
)

// Load and process the component code on mount
onMounted(() => {
  loadAndProcessComponentCode()
})

// Function to load and process the component code
async function loadAndProcessComponentCode() {
  try {
    const componentCode = await fetchComponentCode()
    rawString.value = componentCode
    codeHtml.value = hljs.highlightAuto(rawString.value, [
      "ts",
      "html",
      "css",
      "js",
    ]).value
  } catch (error: any) {
    rawString.value = "// Component code not found"
    codeHtml.value = hljs.highlightAuto(rawString.value, ["ts"]).value
    console.error(error)
  }
}

// Fetch the raw code of the component dynamically
async function fetchComponentCode() {
  const path = componentPath.value
  // 调试：打印所有可用路径和查找的路径

  console.error("Available paths:", Object.keys(rawComponents))

  console.error("Looking for path:", path)
  const loadRawComponent = rawComponents[path]
  if (!loadRawComponent)
    throw new Error(
      `Component not found: ${path}. Available: ${Object.keys(rawComponents).join(", ")}`,
    )

  const mod = await loadRawComponent()
  if (typeof mod !== "string") {
    throw new TypeError("Raw component code is not a string")
  }
  return mod.trim()
}
</script>

<template>
  <div
    :icon="icon"
    class="relative flex max-h-[32rem]"
    :class="$props.class"
    :code="rawString"
  >
    <CodeCopy class="absolute -top-12 right-0" :code="rawString" />
    <code class="min-w-full overflow-auto px-2 leading-4">
      <pre class="text-sm" v-html="codeHtml" />
    </code>
  </div>
</template>
