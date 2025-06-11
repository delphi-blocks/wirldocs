# WiRL Installation Guide

Installing WiRL is straightforward, but since it depends on several external libraries, it's important to install everything in the correct order.

## Dependencies

WiRL uses the following libraries:
- [Delphi Neon](https://github.com/paolo-rossi/delphi-neon) - for JSON serialization/deserialization
- [OpenAPI](https://github.com/paolo-rossi/OpenAPI-Delphi) - for automatic OpenAPI documentation generation
- [Delphi JOSE and JWT Library](https://github.com/paolo-rossi/delphi-jose-jwt) - for JWT token management

## Installation Methods

### Method 1: Using Git (Recommended)

The easiest way to install WiRL is using Git, since the project is hosted on GitHub at https://github.com/delphi-blocks/WiRL and dependencies are managed with Git submodules.

Use the following command to download WiRL and all its dependencies:

```bash
git clone --recurse-submodules https://github.com/delphi-blocks/WiRL.git
```

### Method 2: Manual Download

Alternatively, you can manually download the ZIP files for all four libraries from GitHub and extract them manually. 

For this guide, we assume that Neon, JWT, and OpenAPI have been extracted into the `libs` directory of WiRL, creating the following structure:

```
WiRL/
├── Demos/
├── Libs/
│   ├── JWT/
│   ├── Neon/
│   └── OpenAPI/
├── media/
├── Packages/
│   ├── ...
│   ├── 11.0Alexandria/
│   └── 12.0Athens/
└── Source/
```

## Configuration

### 1. Create Environment Variable

Create an environment variable in Delphi:
1. Go to **Tools → Options → Environment Options → Environment Variables**
2. Create a new variable named `WiRLPath` 
3. Set its value to the complete installation path of WiRL (e.g., `C:\MyProjects\WiRL`)

### 2. Configure Library Path

Add the source paths to Delphi's Library Path:
1. Go to **Tools → Options → Environment Options → Delphi Options → Library**
2. Add the following paths to the Library Path:

```
$(WiRLPath)\Source\Core
$(WiRLPath)\Source\Data
$(WiRLPath)\Source\Data\FireDAC
$(WiRLPath)\Source\Client
$(WiRLPath)\Source\Extension
$(WiRLPath)\Libs\JWT\Source\Common
$(WiRLPath)\Libs\JWT\Source\JOSE
$(WiRLPath)\Libs\Neon\Source\
$(WiRLPath)\Libs\OpenAPI\Source
```

## Verification

At this point, you should be able to compile the demos and write new applications using WiRL.

## Optional Component Installation

You can optionally install the visual components, which are especially useful for client development and include wizards/experts.

To install the components:

1. Compile all packages for JWT, OpenAPI, and Neon libraries, making sure to use the correct version for your Delphi installation
2. Compile the two WiRL packages
3. Install the `WiRLDesign` package by right-clicking on the package name and selecting "Install"

## Supported Delphi Versions

WiRL supports multiple Delphi versions. Make sure to use the appropriate package folder for your Delphi version (e.g., `11.0Alexandria`, `12.0Athens`).

## Troubleshooting

If you encounter compilation issues:
- Verify that all paths are correctly set in the Library Path
- Ensure you're using the correct package versions for your Delphi installation
- Check that all dependencies are properly extracted/cloned in the expected locations