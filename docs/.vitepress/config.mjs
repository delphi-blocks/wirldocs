import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WiRL Project",
  description: "The Delphi RESTful Library",
  ignoreDeadLinks: [
    /^https?:\/\/localhost/
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
    logo: '/logo-image-only.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/introduction' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Getting started with Server', link: '/getting-started-with-server' },
          { text: 'Getting started with Client', link: '/getting-started-with-client' },
        ]
      }, {
        text: 'Server',
        items: [
          { text: 'Your first resource', link: '/server/first-resource' },
          { text: 'Configuration', link: '/server/configuration' },
          { text: 'Attributes', link: '/server/attributes' },
          { text: 'Message body reader and writer', link: '/server/message-body' },
          { text: 'Neon plugin', link: '/server/neon' },
          { text: 'Filters', link: '/server/filters' },
          { text: 'Context Injection', link: '/server/context-injection' },
          { text: 'Authentication and Authorization', link: '/server/authentication' },
          { text: 'Memory Management', link: '/server/memory-management' },
          { text: 'CORS', link: '/server/cors' }
        ]
      }, {
        text: 'Client',
        items: [
          { text: 'Configuration', link: '/client/configuration' },
          { text: 'Request Handling', link: '/client/request-handling' },
          { text: 'Exception handling', link: '/client/exception-handling' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/delphi-blocks/WiRL' }
    ]
  }
})
