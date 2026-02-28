import { defineConfig, presetUno, presetAttributify, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
  ],
  theme: {
    colors: {
      primary: {
        50: '#f0f9ff',
        400: '#7c91f7',
        500: '#667eea',
        600: '#5a67d8',
        700: '#4c51bf',
      },
      gray: {
        950: '#0a0a0a',
        900: '#111111',
        800: '#1a1a1a',
        700: '#2a2a2a',
        600: '#3a3a3a',
        500: '#4a4a4a',
        400: '#9ca3af',
        300: '#d1d5db',
      }
    },
  },
  shortcuts: {
    'glass-effect': 'bg-white/5 backdrop-blur-md border border-white/10',
    'gradient-text': 'bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent',
    'hover-lift': 'transition-all duration-300 hover:transform hover:-translate-y-1',
    'tab-active': 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/25',
  },
})
