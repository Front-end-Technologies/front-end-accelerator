// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  // SSR should be enabled, but for webcontainers, it is disabled
  // since webcontainers do not support server-side rendering
  ssr: false,
});
