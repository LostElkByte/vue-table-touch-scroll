import CodeViewerTab from '~/components/CodeViewerTab.vue'
import ComponentLoader from '~/components/ComponentLoader.vue'
import ComponentViewer from '~/components/ComponentViewer.vue'
import DemoTabs from '~/components/DemoTabs.vue'
import * as Examples from '~/components/examples'

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp

  // Register demo components
  vueApp.component('ComponentViewer', ComponentViewer)
  vueApp.component('CodeViewerTab', CodeViewerTab)
  vueApp.component('ComponentLoader', ComponentLoader)
  vueApp.component('DemoTabs', DemoTabs)

  // Register example components
  Object.entries(Examples).forEach(([name, component]) => {
    vueApp.component(name, component)
  })
})
