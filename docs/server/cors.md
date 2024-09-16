# Cross-Origin Resource Sharing (CORS) in WiRL

Cross-Origin Resource Sharing (CORS) is a security mechanism that allows web servers to specify which origins (domains, schemes, or ports) are permitted to access their resources. This is particularly important in modern web applications where frontend and backend services may be hosted on different domains.

For a comprehensive understanding of CORS, please refer to the [MDN Web Docs on CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Implementing CORS in WiRL

WiRL provides a straightforward way to implement CORS in your REST applications through a configurable plugin. This plugin allows you to fine-tune your CORS settings to meet your specific security requirements.

### Basic Configuration

Here's an example of how to configure CORS in your WiRL application:

```pascal
RESTServer.AddEngine<TWiRLEngine>('/rest')
  .SetEngineName('RESTEngine')
  .AddApplication('/app')
    .SetResources('*')
    .SetFilters('*')
    // CORS plugin configuration
    .Plugin.Configure<IWiRLConfigurationCORS>
      .SetOrigin('*')
      .SetMethods('HEAD, GET, PUT, POST, DELETE, OPTIONS')
      .SetHeaders('Accept, Content-Type, Content-Encoding, Authorization')
```

### Configuration Parameters

The CORS plugin in WiRL can be customized using the `IWiRLConfigurationCORS` interface. Here are the key parameters you can set:

1. **Origin** (`SetOrigin`):
   - Specifies which origins are allowed to access your resources.
   - Use `'*'` to allow all origins.
   - Example for a specific origin: `SetOrigin('https://example.com')`

2. **Methods** (`SetMethods`):
   - Defines which HTTP methods are permitted from external origins.
   - Specify one or more of: HEAD, GET, PUT, POST, DELETE, OPTIONS.
   - Example: `SetMethods('GET, POST, PUT, DELETE')`

3. **Headers** (`SetHeaders`):
   - Indicates which HTTP headers are accepted in requests from external origins.
   - Example: `SetHeaders('Accept, Content-Type, Authorization')`

## Advanced CORS Handling

For more complex scenarios, such as differentiating responses based on the origin of the caller, WiRL allows you to use [custom filters](filters). This approach gives you fine-grained control over CORS responses.

## Troubleshooting

If you encounter CORS-related issues:

1. Check your browser's console for specific CORS error messages.
2. Ensure that your server is correctly sending the CORS headers.
3. Verify that the requesting origin matches the configured allowed origins.
4. For preflight requests (OPTIONS), make sure your server is handling them correctly.
