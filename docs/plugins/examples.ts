import * as Examples from '../components/examples'
import ComponentLoader from '../components/ComponentLoader.vue'
import ComponentViewer from '../components/ComponentViewer.vue'
import { vTableTouchScroll } from '@vue-table-touch-scroll/core'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp

  vueApp.use(ElementPlus)
  vueApp.directive('table-touch-scroll', vTableTouchScroll)

  vueApp.component('ComponentLoader', ComponentLoader)
  vueApp.component('ComponentViewer', ComponentViewer)

  Object.entries(Examples).forEach(([name, component]) => {
    vueApp.component(name, component)
  })
})
