# WiRL Documentation Project

This repository contains the official documentation for the WiRL framework. WiRL is designed to simplify the implementation of RESTful services in Delphi, while ensuring high interoperability with REST clients written in other languages. Inspired by the JAX-RS specification, WiRL adheres to the six REST constraints and provides a powerful, attribute-based approach to creating RESTful web services using plain Delphi objects.

## Documentation Build with VitePress

The WiRL documentation is built using [VitePress](https://vitepress.dev/), a modern, fast static site generator powered by Vite and Vue.js. Below are the steps to set up the environment, build the documentation, and serve it locally.

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) version 18 or higher.
- Terminal for accessing VitePress via its command line interface (CLI).

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/delphi-blocks/wirl-docs.git
   cd wirl-docs
   ```

2. **Install Dependencies**:
   You can use npm to install the required packages:

   ```bash
   npm install
   ```

### Running the Documentation Locally

To run the documentation on a local server for development purposes, use the following command:

```bash
npm run docs:dev
```

This will start a local server, and the documentation will be available at `http://localhost:5173/`. VitePress will automatically reload when changes are made to the documentation files.

### Building the Documentation for Production

To generate a production build of the documentation, run the following command:

```bash
npm run docs:build
```

This command will create a static version of the site in the `docs/.vitepress/dist` directory, which can then be deployed to any static hosting service.

## Contributions

We welcome contributions to both the WiRL documentation and its underlying build process. If you have suggestions or improvements, feel free to open a pull request or file an issue. Let’s work together to keep the documentation clear and up-to-date!

---

For more information about WiRL, please visit the main [WiRL repository](https://github.com/delphi-blocks/WiRL).