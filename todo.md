# Todo (Luca)

* Converters
* Validators
* OpenAPI
* Engines: FileSystem, Proxy
* Custom message body writers and readers
* Custom vendors
* Compression
* Cache
* Tuple

# Todo (Paolo)

- podo resources (code reuse, datamodules)

- entity providers (mbrw)
- role-based authorization
- pluggable auth (jwt, cookie, session)
- pluggable configuration
- converters
- content validation
- powerful http parameter management (attribute-based)
- strong content negotiation (media types) (example Accept multi-mime)
- easy exception handling and error management
- attribute-based endpoint redirection
- context injection with custom classes support
- automatic emmory management of parameters and resource results
- request-based garbage collection
- CORS support
- automatic Linux daemon generation
- multiple server app type supported: standalone, console, service, daemon
- support for any database with optimizations for FireDAC and UniDAC
- 
- multi-engine: rest,webserver, proxy
- multi-app: separation between resource groups (security)
- filters, filters, filters: auth, compression, graphql, validation, logging, ...
- chuncked response
- sse
- automatic documentation through openapi
- 
## Client
- idiomatic entity requests: `Get<TBook>`
- independence from the http client library (indy, nethhtp)
- fluent-style requests
- Design-time component editors for easy request configuration