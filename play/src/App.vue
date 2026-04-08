<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue'
import ElementPlusExample from './examples/ElementPlusExample.vue'
import VxeTableExample from './examples/VxeTableExample.vue'
import AntdvExample from './examples/AntdvExample.vue'
import NaiveUIExample from './examples/NaiveUIExample.vue'
import VuetifyExample from './examples/VuetifyExample.vue'
import ArcoExample from './examples/ArcoExample.vue'
import PrimeVueExample from './examples/PrimeVueExample.vue'
import NestedTableExample from './examples/NestedTableExample.vue'

interface Tab {
  name: string
  component: Component
  description: string
}

const tabs: Tab[] = [
  {
    name: 'Element Plus',
    component: ElementPlusExample,
    description: 'Enterprise-level UI component library',
  },
  {
    name: 'VXE Table',
    component: VxeTableExample,
    description: 'Powerful Vue table component',
  },
  {
    name: 'Ant Design Vue',
    component: AntdvExample,
    description: 'Enterprise-level UI design language',
  },
  {
    name: 'Naive UI',
    component: NaiveUIExample,
    description: 'Vue 3 component library',
  },
  {
    name: 'Vuetify',
    component: VuetifyExample,
    description: 'Material Design component framework',
  },
  {
    name: 'Arco Design',
    component: ArcoExample,
    description: 'ByteDance design system',
  },
  {
    name: 'PrimeVue',
    component: PrimeVueExample,
    description: 'Rich Vue UI component library',
  },
  {
    name: 'Nested Table',
    component: NestedTableExample,
    description: 'Nested table gesture arbitration demo',
  },
]

const activeTab = ref(0)
const currentComponent = shallowRef(tabs[0].component)

const selectTab = (index: number) => {
  activeTab.value = index
  currentComponent.value = tabs[index].component
}
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Area 1: Title -->
    <section class="relative pt-12">
      <div class="absolute inset-0 flex justify-center pointer-events-none">
        <div class="relative w-full max-w-[1113px] h-full">
          <div class="absolute left-0 top-12 bottom-0 w-px bg-white/10"></div>
          <div class="absolute right-0 top-12 bottom-0 w-px bg-white/10"></div>
          <div class="absolute left-24 top-12 bottom-0 w-px bg-white/10"></div>
          <div class="absolute right-24 top-12 bottom-0 w-px bg-white/10"></div>
          <div class="absolute left-0 right-0 top-12 h-px bg-white/10"></div>

          <div
            class="absolute left-24 top-12 w-5 h-5 -translate-x-1/2 -translate-y-1/2"
          >
            <div
              class="absolute left-1/2 top-0 bottom-0 w-px bg-white/30"
            ></div>
            <div class="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
          </div>
        </div>
      </div>
      <div class="container mx-auto px-4 md:px-6 py-6 md:py-1 relative z-10">
        <div class="max-w-[1113px] mx-auto text-center">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span
              class="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent"
            >
              Vue3 Mobile Table
            </span>
          </h1>
        </div>
      </div>
    </section>

    <!-- Area 2: Description + Buttons -->
    <section class="relative">
      <div class="absolute inset-0 flex justify-center pointer-events-none">
        <div class="relative w-full max-w-[1113px] h-full">
          <div class="absolute left-0 top-0 bottom-0 w-px bg-white/10"></div>
          <div class="absolute right-0 top-0 bottom-0 w-px bg-white/10"></div>
          <div class="absolute left-24 top-0 bottom-0 w-px bg-white/10"></div>
          <div class="absolute right-24 top-0 bottom-0 w-px bg-white/10"></div>
          <div class="absolute left-0 right-0 top-0 h-px bg-white/10"></div>
          <div
            class="absolute right-24 top-0 w-5 h-5 translate-x-1/2 -translate-y-1/2"
          >
            <div
              class="absolute left-1/2 top-0 bottom-0 w-px bg-white/30"
            ></div>
            <div class="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
          </div>
        </div>
      </div>
      <div
        class="container mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-16 relative z-10"
      >
        <div class="max-w-[1113px] mx-auto text-center">
          <p
            class="text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-6 md:mb-8 px-4 md:px-0"
          >
            Bridge the gap between desktop and mobile with one directive that
            makes Vue PC table components feel like native apps on touch
            devices.
          </p>

          <div
            class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3"
          >
            <button
              class="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              Get Started
            </button>
            <button
              class="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg font-mono text-xs sm:text-sm border-1 border-solid border-white/20 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <span class="truncate">$ npm i vue3-mobile-table</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path
                  d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Area 3: Framework Selection + Demo -->
    <section class="py-6 md:py-8 relative">
      <div
        class="absolute inset-0 flex justify-center pointer-events-none hidden md:flex"
      >
        <div class="relative w-full max-w-[1113px] h-full">
          <div class="absolute left-0 top-0 bottom-0 w-px bg-white/10"></div>
          <div class="absolute right-0 top-0 bottom-0 w-px bg-white/10"></div>
          <div class="absolute left-0 right-0 top-0 h-px bg-white/10"></div>
          <div class="absolute left-0 right-0 bottom-0 h-px bg-white/10"></div>
        </div>
      </div>

      <div class="container mx-auto px-4 md:px-6 relative z-10">
        <div class="max-w-[1113px] mx-auto">
          <div class="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            <button
              v-for="(tab, index) in tabs"
              :key="tab.name"
              @click="selectTab(index)"
              :class="[
                'px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200',
                activeTab === index
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10',
              ]"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>
      </div>

      <div
        class="container max-w-[1113px] mx-auto px-4 md:px-6 relative z-10 mt-4 md:mt-8"
      >
        <div class="max-w-[1113px] mx-auto px-0 md:px-12">
          <div class="bg-black overflow-x-auto">
            <component :is="currentComponent" />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/5">
      <div class="container mx-auto px-4 md:px-6">
        <div class="max-w-[1400px] mx-auto py-12 md:py-16 lg:pl-24">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-12"
          >
            <div class="md:col-span-1">
              <div class="flex items-center gap-2">
                <img src="/assets/logo-white.png" alt="Logo" class="h-6 w-6" />
                <span class="text-sm font-semibold text-white"
                  >Vue3 Mobile Table</span
                >
              </div>
            </div>

            <!-- Resources -->
            <div>
              <h3 class="text-sm font-semibold text-white mb-4">Resources</h3>
              <ul class="space-y-3 list-none p-0">
                <li>
                  <a
                    href="#"
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    >Docs</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    >Examples</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    >GitHub</a
                  >
                </li>
              </ul>
            </div>

            <!-- More -->
            <div>
              <h3 class="text-sm font-semibold text-white mb-4">More</h3>
              <ul class="space-y-3 list-none p-0">
                <li>
                  <a
                    href="#"
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    >Playground</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    >Changelog</a
                  >
                </li>
              </ul>
            </div>

            <!-- About -->
            <div>
              <h3 class="text-sm font-semibold text-white mb-4">About</h3>
              <ul class="space-y-3 list-none p-0">
                <li>
                  <a
                    href="#"
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    >Open Source</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    >GitHub</a
                  >
                </li>
              </ul>
            </div>

            <!-- Legal -->
            <div>
              <h3 class="text-sm font-semibold text-white mb-4">Legal</h3>
              <ul class="space-y-3 list-none p-0">
                <li>
                  <a
                    href="#"
                    class="text-sm text-gray-400 hover:text-white transition-colors"
                    >Privacy Policy</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
