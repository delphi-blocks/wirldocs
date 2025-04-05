# WiRL Features

![Delphi RESTful Library](/logo.png){class=center-25}

WiRL is a Delphi framework that simplifies the development of RESTful web services by providing attributes and interfaces for mapping Plain Old Delphi Objects to web resources and handling HTTP requests and responses.

Here's a breakdown of its key features:

## WiRL Core Concepts

- **Resource Classes**: These are PODOs that represent web resources, and WiRL attributes are used to map them to specific HTTP URIs and methods. Plain Delphi classes are great for code reuse, for example you can use old datamodules and other classes.

- **Content Negotiation**: WiRL supports string content negotiation, allowing clients to request resources in different formats (e.g., JSON, CSV, etc...) and for the server to respond accordingly.

- **Attributes**: WiRL uses attributes to simplify the development of REST web services, allowing developers to map Java classes and methods to HTTP requests and responses. 

- **HTTP Mapping**: WiRL provides attributes to map HTTP methods (GET, POST, PUT, DELETE, etc.) to specific methods within resource classes. 

- **Entity Providers**: WiRL uses entity providers to handle the mapping of request and response entities, such as JSON, to Delphi objects and vice versa. 

- **Client API**: WiRL provides a powerful client API for making HTTP requests to web services, allowing developers to easily consume RESTful services. 

- **Powerful Filters**: Filters are used for everything in WiRL: auth, compression, graphql, validation, logging, etc...

- **Automatic OpenAPI Documentation**: WiRL generates fully automated documentation using the respources code. You can also integrate your documentation trhough XMLDoc.

## WiRL Server Features

- Role-based Authorization
- Pluggable Authentication (JWT, Cookies, Session IDs)
- Pluggable configuration
- Converters for data
- Content validation (attribute-based)
- Powerful http parameter management (attribute-based)
- Easy exception handling and error management
- Attribute-based endpoint redirection
- Context Injection with user classes support
- Automatic Memory Management for parameters and resource results
- Request-based garbage collection
- CORS support and configuration
- Linux 64bit support
- Automatic Linux daemon generation
- Multiple server app type supported: Standalone, Console, Service, Daemon
- Support for any database with optimizations for FireDAC and UniDAC
- Multi-engine: REST, Webserver, Proxy
- Multi-app: separation between resource groups (security)
- Chuncked response
- SSE (Server Side Events)

## WiRL Client Features

- Idiomatic entity requests: `Get<TBook>`
- Independence from the http client library (Indy, NetHttp)
- Fluent-style requests
- Design-time component editors for easy request configuration
- Multi-response through Tuples