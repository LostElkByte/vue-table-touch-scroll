const e=`<script setup lang="ts">
const isLandscape = ref(false)

const scrollOptions = computed(() => ({
  preset: 'element-plus' as const,
  rotation: isLandscape.value ? 90 : 0,
  disableEdgeDetection: isLandscape.value,
}))

const toggleLandscape = () => {
  isLandscape.value = !isLandscape.value
}

const tableData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  age: 20 + (i % 40),
  email: \`user\${i + 1}@example.com\`,
  phone: \`+1 \${String(i).padStart(3, '0')}-\${String(i * 10).padStart(4, '0')}\`,
  department: ['Engineering', 'Design', 'Marketing', 'Sales'][i % 4],
  address: \`No. \${i + 1}, Street \${i % 10}, City \${i % 5}\`,
  date: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
}))
<\/script>

<template>
  <div class="w-full space-y-3">
    <div class="flex items-center gap-3">
      <button
        class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        @click="toggleLandscape"
      >
        📱 Enter Landscape
      </button>
    </div>

    <div
      v-mobile-table="{ preset: 'element-plus' }"
      class="border rounded-lg overflow-hidden"
    >
      <el-table :data="tableData" height="340" border stripe size="small">
        <el-table-column prop="id" label="ID" width="60" fixed="left" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="age" label="Age" width="80" />
        <el-table-column prop="email" label="Email" width="280" />
        <el-table-column prop="phone" label="Phone" width="180" />
        <el-table-column prop="department" label="Department" width="120" />
        <el-table-column prop="address" label="Address" width="280" />
        <el-table-column prop="date" label="Date" width="120" />
      </el-table>
    </div>

    <Teleport to="body">
      <Transition name="landscape-fade">
        <div v-if="isLandscape" class="landscape-overlay">
          <button class="landscape-exit-btn" @click="toggleLandscape">✕</button>

          <div v-mobile-table="scrollOptions" class="landscape-container">
            <el-table
              :data="tableData"
              height="100%"
              border
              stripe
              size="small"
            >
              <el-table-column prop="id" label="ID" width="60" fixed="left" />
              <el-table-column prop="name" label="Name" width="120" />
              <el-table-column prop="age" label="Age" width="80" />
              <el-table-column prop="email" label="Email" width="280" />
              <el-table-column prop="phone" label="Phone" width="180" />
              <el-table-column
                prop="department"
                label="Department"
                width="120"
              />
              <el-table-column prop="address" label="Address" width="280" />
              <el-table-column prop="date" label="Date" width="120" />
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
}

.landscape-exit-btn {
  position: fixed;
  top: calc(12px + env(safe-area-inset-top));
  right: calc(12px + env(safe-area-inset-right));
  z-index: 10000;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #111827;
  font-size: 16px;
  cursor: pointer;
}

.dark .landscape-exit-btn {
  border-color: #363637;
  background: #141414;
  color: #f9fafb;
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

.landscape-fade-enter-active,
.landscape-fade-leave-active {
  transition: opacity 0.25s ease;
}

.landscape-fade-enter-from,
.landscape-fade-leave-to {
  opacity: 0;
}
</style>
`;export{e as default};
