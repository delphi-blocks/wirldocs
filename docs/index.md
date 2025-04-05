---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  image:
    src: ./logo.png
    alt: WiRL
  name: "WiRL Project"
  text: "The Delphi REST Library"
  tagline: An approachable, performant and versatile framework for building REST API in Delphi.
  actions:
    - theme: brand
      text: What is WiRL?
      link: /concepts/what-is-wirl
    - theme: alt
      text: WiRL Server
      link: /server/tutorial/getting-started
    - theme: alt
      text: WiRL Client
      link: /client/tutorial/getting-started

features:
  - title: Simplicity
    icon: ❗
    details: Experience the elegance of declarative programming with WiRL's powerful annotation system. Define your RESTful services with clean, intuitive syntax that keeps your code readable and maintainable. 
  - title: Robust Content Negotiation
    icon: 🤝
    details: Let WiRL handle the complexities of data exchange. With built-in support for JSON, XML, and more, your API adapts to client needs on the fly. Focus on your business logic while WiRL takes care of the rest.
  - title: Advanced Customization
    icon: 🔧
    details: Elevate your API's capabilities with WiRL's flexible filter system. From authentication to serialization, easily inject custom behaviors into your request pipeline for a truly tailored RESTful experience.
---
