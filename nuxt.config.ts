import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-31",
  modules: [
    "@nuxt/content", 
    "@nuxt/icon", 
    "@nuxt/image",
    "@unlazy/nuxt"
  ],
  // ssr: false,
  devtools: { enabled: false },
  devServer: {
    port: 8000,
  },
  css: ["~/assets/css/main.css"],
  
  // Global app configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
  
  // experimental: {
  //   payloadExtraction: false,
  // },
  nitro: {
    preset: "static",
    prerender: {
      concurrency: 1,
      crawlLinks: true,
      routes: ["/", "/about", "/contact", "/work/pieces", "/work/writing", "/media", "/teaching"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["vanilla-tilt", "debug"]
    }
  },
  routeRules: {
    "/": { prerender: true },
    "/**": { prerender: true },
  },
  icon: {
    mode: "css",
    cssLayer: "base",
  },
});
