<script setup lang="ts">
import { useTableData } from '../../composables/useTableData'
import { useTableColumns } from '../../composables/useTableColumns'

const tableData = useTableData(50)
const columns = useTableColumns()

const isLandscape = ref(false)

const viewerContext = inject<{
  isEnabled: Ref<boolean>
  friction: Ref<number>
}>('viewerContext', {
  isEnabled: ref(true),
  friction: ref(0.95),
})

const directiveOptions = computed(() => ({
  preset: 'element-plus' as const,
  friction: viewerContext.friction.value,
  rotation: isLandscape.value ? 90 : 0,
  disableEdgeDetection: isLandscape.value,
}))

const toggleLandscape = () => {
  isLandscape.value = !isLandscape.value
}
</script>

<template>
  <div class="w-full space-y-3">
    <!-- 提示信息 + 进入按钮 -->
    <div class="flex items-center gap-3">
      <button
        class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        @click="toggleLandscape"
      >
        📱 Enter Landscape
      </button>
    </div>

    <!-- 竖屏状态下的正常表格预览 -->
    <div
      v-table-touch-scroll="
        viewerContext.isEnabled.value
          ? { preset: 'element-plus', friction: viewerContext.friction.value }
          : false
      "
      class="border rounded-lg overflow-hidden"
    >
      <el-table :data="tableData" height="340" border stripe size="small">
        <el-table-column
          v-for="col in columns"
          :key="col.key"
          :prop="col.dataIndex"
          :label="col.title"
          :width="col.width"
          :fixed="col.fixed"
        />
      </el-table>
    </div>

    <!-- 全屏横屏 overlay（Teleport 到 body） -->
    <Teleport to="body">
      <Transition name="landscape-fade">
        <div v-if="isLandscape" class="landscape-overlay">
          <!-- 退出按钮（固定在旋转前的视口右上角，即旋转后视觉上的左上角区域） -->
          <button class="landscape-exit-btn" @click="toggleLandscape">✕</button>

          <!-- 旋转容器 -->
          <div
            v-table-touch-scroll="
              viewerContext.isEnabled.value ? directiveOptions : false
            "
            class="landscape-container"
          >
            <el-table
              :data="tableData"
              height="100%"
              border
              stripe
              size="small"
            >
              <el-table-column
                v-for="col in columns"
                :key="col.key"
                :prop="col.dataIndex"
                :label="col.title"
                :width="col.width"
                :fixed="col.fixed"
              />
            </el-table>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.landscape-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--color-background, #fff);
}

.dark .landscape-overlay {
  background: var(--color-background, #0a0a0a);
}

.landscape-exit-btn {
  position: fixed;
  top: calc(12px + env(safe-area-inset-top));
  right: calc(12px + env(safe-area-inset-right));
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
  transition: background 0.2s;
}

.landscape-exit-btn:hover {
  background: hsl(var(--muted));
}

.landscape-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vh;
  height: 100vw;
  transform: rotate(90deg);
  transform-origin: top left;
  translate: 100vw 0;
  overflow: hidden;
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
}

/* Transition */
.landscape-fade-enter-active,
.landscape-fade-leave-active {
  transition: opacity 0.25s ease;
}
.landscape-fade-enter-from,
.landscape-fade-leave-to {
  opacity: 0;
}
</style>
