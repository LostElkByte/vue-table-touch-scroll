# Quick Start

## Global Registration

```ts
import { createApp } from 'vue'
import VueTableTouchScroll from 'vue-table-touch-scroll'
import App from './App.vue'

const app = createApp(App)
app.use(VueTableTouchScroll)
app.mount('#app')
```

## Local Registration

```vue
<script setup>
import { vTableTouchScroll } from 'vue-table-touch-scroll'
</script>

<template>
  <div v-table-touch-scroll class="table-container">
    <table>
      <!-- your table content -->
    </table>
  </div>
</template>
```

## Basic Usage

```vue
<template>
  <div v-table-touch-scroll class="scrollable">
    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
          <td>Data 3</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.scrollable {
  max-width: 600px;
  overflow: auto;
}
</style>
```

## With Options

```vue
<template>
  <div 
    v-table-touch-scroll="{
      scrollSpeed: 1.5,
      cursor: 'grab',
      onScrollStart: handleScrollStart,
      onScrollEnd: handleScrollEnd
    }"
    class="scrollable"
  >
    <table>
      <!-- content -->
    </table>
  </div>
</template>

<script setup>
function handleScrollStart() {
  console.log('Scrolling started')
}

function handleScrollEnd() {
  console.log('Scrolling ended')
}
</script>
```
