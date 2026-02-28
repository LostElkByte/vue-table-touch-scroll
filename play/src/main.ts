import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import './styles/main.css'

// Vuetify - 需要全局注册
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

// PrimeVue - Styled Mode
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(vuetify)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      cssLayer: false,
      darkModeSelector: true,
    }
  }
})

app.mount('#app')
