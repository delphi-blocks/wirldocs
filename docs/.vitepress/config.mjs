import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: "WiRL Project",
    description: "The Delphi RESTful Library",
    lastUpdated: true,
    ignoreDeadLinks: [/^https?:\/\/localhost/],
    head: [["link", { rel: "icon", href: "/favicon.ico" }]],
    themeConfig: {
      search: {
        provider: "local",
      },
      // https://vitepress.dev/reference/default-theme-config
      logo: "/logo-image-only.png",
      nav: [
        { text: "Home", link: "/" },
        { text: "Guides", link: "/introduction" },
        {
          text: "4.6.0",
          items: [
            {
              text: "Changelog",
              link: "https://github.com/delphi-blocks/WiRL/releases",
            },
            {
              text: "Discussions",
              link: "https://github.com/delphi-blocks/WiRL/discussions",
            },
          ],
        },
      ],

      sidebar: [
        {
          text: "Guide",
          items: [
            { 
              text: "Introduction", 
              link: "/introduction" 
            },
            { 
              text: "Project Structure", 
              link: "/structure" 
            },
            {
              text: "Getting started with Server",
              link: "/getting-started-with-server",
            },
            {
              text: "Getting started with Client",
              link: "/getting-started-with-client",
            },
          ],
        },
        {
          text: "Server",
          items: [
            { text: "Your first resource", link: "/server/first-resource" },
            { text: "Configuration", link: "/server/configuration" },
            { text: "Attributes", link: "/server/attributes" },
            {
              text: "Message body reader and writer",
              link: "/server/message-body",
            },
            { text: "Neon plugin", link: "/server/neon" },
            { text: "Filters", link: "/server/filters" },
            { text: "Context Injection", link: "/server/context-injection" },
            {
              text: "Authentication and Authorization",
              link: "/server/authentication",
            },
            { text: "Exception handling", link: "/server/exception-handling" },
            { text: "Memory Management", link: "/server/memory-management" },
            { text: "OpenAPI Documentation", link: "/server/openapi" },
            { text: "CORS", link: "/server/cors" },
          ],
        },
        {
          text: "Client",
          items: [
            { text: "Configuration", link: "/client/configuration" },
            { text: "Request Handling", link: "/client/request-handling" },
            { text: "Exception handling", link: "/client/exception-handling" },
          ],
        },
      ],

      socialLinks: [
        { icon: "github", link: "https://github.com/delphi-blocks/WiRL" },
        {
          icon: {
            svg: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-comment-discussion UnderlineNav-octicon d-none d-sm-inline">
    <path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z"></path>
</svg>`,
          },
          link: "https://github.com/delphi-blocks/WiRL/discussions",
        },
      ],
    },
  })
);
