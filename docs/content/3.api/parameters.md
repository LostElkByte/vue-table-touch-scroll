---
title: Parameters
description: API parameters and configuration options for Vue Table Touch Scroll
icon: lucide:sliders
---

# API Parameters

Vue Table Touch Scroll provides a flexible configuration system to customize the touch scrolling behavior. You can pass options directly to the directive to fine-tune the experience.

## Usage

Pass configuration options as an object to the directive:

```vue
<template>
  <el-table 
    v-table-touch-scroll="{
      scrollSpeed: 1.5,
      enableMomentum: true,
      threshold: 10
    }"
    :data="tableData"
  >
    <!-- columns -->
  </el-table>
</template>
```

Or define options in your script:

```vue
<script setup lang="ts">
import type { TableTouchScrollOptions } from 'vue-table-touch-scroll'

const scrollOptions: TableTouchScrollOptions = {
  scrollSpeed: 1.5,
  enableMomentum: true,
  threshold: 10,
}
</script>

<template>
  <el-table v-table-touch-scroll="scrollOptions" :data="tableData">
    <!-- columns -->
  </el-table>
</template>
```

## Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `scrollSpeed` | `number` | `1.0` | Controls the scrolling speed multiplier. Higher values result in faster scrolling. Range: `0.1` - `3.0` |
| `enableMomentum` | `boolean` | `true` | Enables momentum scrolling (inertia) after releasing touch. When enabled, the table continues to scroll briefly after the touch ends. |
| `threshold` | `number` | `10` | Minimum pixel distance required to trigger scrolling. Helps distinguish between taps and scroll gestures. Range: `0` - `50` |
| `friction` | `number` | `0.95` | Controls the deceleration rate for momentum scrolling. Higher values (closer to 1) result in longer momentum. Range: `0.8` - `0.99` |
| `enableDesktop` | `boolean` | `false` | Enables touch-like scrolling on desktop devices for testing purposes. Not recommended for production. |
| `direction` | `'horizontal' \| 'vertical' \| 'both'` | `'horizontal'` | Specifies which scroll directions are enabled. Most tables only need horizontal scrolling. |
| `preventDefault` | `boolean` | `true` | Prevents default touch behavior during scrolling. Recommended to keep enabled to avoid conflicts. |
| `stopPropagation` | `boolean` | `false` | Stops touch events from propagating to parent elements. Enable if you have nested scrollable containers. |
| `minVelocity` | `number` | `0.5` | Minimum velocity required to trigger momentum scrolling. Lower values make momentum more sensitive. Range: `0.1` - `2.0` |
| `maxVelocity` | `number` | `10` | Maximum velocity cap for momentum scrolling. Prevents overly fast scrolling. Range: `5` - `50` |
| `bounceEffect` | `boolean` | `false` | Enables a bounce effect when scrolling past the edges (iOS-style). Experimental feature. |
| `disabled` | `boolean` | `false` | Completely disables the touch scroll functionality. Useful for conditional enabling. |

## Examples

### Fast Scrolling with Strong Momentum

```vue
<el-table 
  v-table-touch-scroll="{
    scrollSpeed: 2.0,
    enableMomentum: true,
    friction: 0.98,
    minVelocity: 0.3
  }"
  :data="tableData"
>
```

### Slow, Precise Scrolling

```vue
<el-table 
  v-table-touch-scroll="{
    scrollSpeed: 0.8,
    enableMomentum: false,
    threshold: 5
  }"
  :data="tableData"
>
```

### Vertical Table Scrolling

```vue
<el-table 
  v-table-touch-scroll="{
    direction: 'vertical',
    scrollSpeed: 1.2
  }"
  :data="tableData"
  height="400"
>
```

### Both Horizontal and Vertical

```vue
<el-table 
  v-table-touch-scroll="{
    direction: 'both',
    scrollSpeed: 1.3,
    enableMomentum: true
  }"
  :data="tableData"
>
```

### Conditional Enabling

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const isMobile = ref(window.innerWidth < 768)

const scrollOptions = computed(() => ({
  disabled: !isMobile.value,
  scrollSpeed: 1.5,
}))
</script>

<template>
  <el-table v-table-touch-scroll="scrollOptions" :data="tableData">
    <!-- columns -->
  </el-table>
</template>
```

## TypeScript Support

Vue Table Touch Scroll includes full TypeScript definitions:

```ts
import type { 
  TableTouchScrollOptions,
  ScrollDirection,
  TableTouchScrollDirective 
} from 'vue-table-touch-scroll'

// Options interface
interface TableTouchScrollOptions {
  scrollSpeed?: number
  enableMomentum?: boolean
  threshold?: number
  friction?: number
  enableDesktop?: boolean
  direction?: ScrollDirection
  preventDefault?: boolean
  stopPropagation?: boolean
  minVelocity?: number
  maxVelocity?: number
  bounceEffect?: boolean
  disabled?: boolean
}

// Direction type
type ScrollDirection = 'horizontal' | 'vertical' | 'both'
```

## Default Configuration

If no options are provided, the directive uses these defaults:

```ts
{
  scrollSpeed: 1.0,
  enableMomentum: true,
  threshold: 10,
  friction: 0.95,
  enableDesktop: false,
  direction: 'horizontal',
  preventDefault: true,
  stopPropagation: false,
  minVelocity: 0.5,
  maxVelocity: 10,
  bounceEffect: false,
  disabled: false,
}
```

## Performance Considerations

### Recommended Settings for Large Tables

For tables with many rows or columns:

```vue
<el-table 
  v-table-touch-scroll="{
    scrollSpeed: 1.2,
    enableMomentum: true,
    friction: 0.92,
    threshold: 12
  }"
  :data="tableData"
>
```

### Recommended Settings for Small Tables

For smaller, simpler tables:

```vue
<el-table 
  v-table-touch-scroll="{
    scrollSpeed: 1.5,
    enableMomentum: true,
    friction: 0.96,
    threshold: 8
  }"
  :data="tableData"
>
```

## Browser Compatibility

All parameters are supported across all modern browsers. The `bounceEffect` parameter may have limited support on older browsers and is considered experimental.

## Next Steps

- See [Examples](/examples/element-plus) for real-world usage
- Check the [Troubleshooting](/guide/troubleshooting) guide for common issues
- Visit the [GitHub repository](https://github.com/LostElkByte/vue-table-touch-scroll) for more information
