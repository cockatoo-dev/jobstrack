// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes';

const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{fuchsia.50}',
      100: '{fuchsia.100}',
      200: '{fuchsia.200}',
      300: '{fuchsia.300}',
      400: '{fuchsia.400}',
      500: '{fuchsia.500}',
      600: '{fuchsia.600}',
      700: '{fuchsia.700}',
      800: '{fuchsia.800}',
      900: '{fuchsia.900}',
      950: '{fuchsia.950}'
    }
  }
});

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module'
  ],
  googleFonts: {
    families: {
      "Open Sans": [400, 700]
    }
  },
  primevue: {
    options: {
      theme: {
        preset: AppPreset,
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities'
        }
      }
    }
  },
  routeRules: {
    "/": {prerender: true},
    "/dashboard": {ssr: false},
    "/job/*": {ssr: false},
    "/beta/dashboard": {ssr: false},
    "/beta/job/*": {ssr: false}
  }
})