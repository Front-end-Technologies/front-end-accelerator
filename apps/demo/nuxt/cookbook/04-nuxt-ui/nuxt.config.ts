// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
          defer: true,
        },
      ],
    },
  },
});
