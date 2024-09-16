# Configuration

A WiRL application is basically an HTTP server with a routing system that follows the REST specification. The *core* of the application is the *Engine* that handles all the HTTP requests and sends each one to the right sub-module called *Application*. Each application has its own resources and filters used to process the requests.

## Fluent interface
To configure WiRL you can use the [fluent interface style](https://en.wikipedia.org/wiki/Fluent_interface). The configuration methods return always the Self object so you can call another configuration method on the Result itself.
The main advantage of this technique is to avoid to declare object and sub objects only to configure them. Let me show you an example of the configuration using the fluent interface:
```pascal
procedure TMainForm.ConfigureServerFluent(AServer: TWiRLServer);
begin
  // Server & Apps configuration
  AServer
    .SetPort(StrToIntDef(PortNumberEdit.Text, 8080))

    // Engine configuration
    .AddEngine<TWiRLEngine>('/rest')
      .SetEngineName('WiRL Auth Demo')

      // App base configuration
      .AddApplication('/app')
        .SetAppName('Auth Application')
        .SetResources([
          'Server.Resources.TFormAuthResource',
          'Server.Resources.TBasicAuthResource',
          'Server.Resources.TBodyAuthResource',
          'Server.Resources.TUserResource'
        ])

    // Auth configuration
      .Plugin.Configure<IWiRLConfigurationAuth>
        .SetTokenType(TAuthTokenType.JWT)
        .SetTokenLocation(TAuthTokenLocation.Bearer)
        .BackToApp

    // JWT configuration (App plugin configuration)
    .Plugin.Configure<IWiRLConfigurationJWT>
      .SetClaimClass(TServerClaims)
      .SetAlgorithm(TJOSEAlgorithmId.HS256)
      .SetSecret(TEncoding.UTF8.GetBytes(edtSecret.Text))
  ;
end;

```
Of course you can use the usual "Delphi" style to configure WiRL:

```pascal
procedure TMainForm.ConfigureServer(AServer: TWiRLServer);
var
  LEngineConf: TWiRLEngine;
  LAppConf: IWiRLApplication;
  LAuthConf: IWiRLConfigurationAuth;
  LJWTConf: IWiRLConfigurationJWT;
begin
  // Server & Apps configuration
  AServer.SetPort(StrToIntDef(PortNumberEdit.Text, 8080));

    // Engine configuration
  LEngineConf := AServer.AddEngine<TWiRLEngine>('/rest');
  LEngineConf.SetEngineName('WiRL Auth Demo');

  // App base configuration
  LAppConf := LEngineConf.AddApplication('/app');
  LAppConf.SetAppName('Auth Application');
  LAppConf.SetResources([
    'Server.Resources.TFormAuthResource',
    'Server.Resources.TBasicAuthResource',
    'Server.Resources.TBodyAuthResource',
    'Server.Resources.TUserResource'
  ]);

  // Auth configuration
  LAuthConf := LAppConf.Plugin.Configure<IWiRLConfigurationAuth>;
  LAuthConf.SetTokenType(TAuthTokenType.JWT);
  LAuthConf.SetTokenLocation(TAuthTokenLocation.Bearer);

  // JWT configuration (App plugin configuration)
  LJWTConf := LAppConf.Plugin.Configure<IWiRLConfigurationJWT>;
  LJWTConf.SetClaimClass(TServerClaims);
  LJWTConf.SetAlgorithm(TJOSEAlgorithmId.HS256);
  LJWTConf.SetSecret(TEncoding.UTF8.GetBytes(edtSecret.Text));
end;
```

This configuration defines an *application* that answers to URLs like this:

> http://localhost:8080/rest/app/*<resource_path>*

### CurrentApp, CurrentEngine, BackToApp
Even using the fluent interface when we want to configure more that one engine or app you are forced to save (and declare) the Engine and App objects. To avoid cluttering the configuration code you can use the utility methods:

```pascal
  // Server & Apps configuration
  AServer
    .SetPort(StrToIntDef(PortNumberEdit.Text, 8080))

    // Engine configuration
    .AddEngine<TWiRLEngine>('/rest')
      .SetEngineName('WiRL Auth Demo')

      // First App
      .AddApplication('/auth_app')
        .SetAppName('Auth Application')
        .SetResources('*');

  AServer
    .CurrentEngine<TWiRLEngine>
      // App base configuration
      .AddApplication('/prod_app')
        .SetAppName('Production Application')
        .SetResources('*')
  ;
```

## Engines

Every WiRL server should have at last one engine. An engine is an object that knows what to do with an HTTP request. WiRL offers three engines: `TWiRLEngine` is the basic engine that handles REST request, `TWiRLFileSystemEngine` is capable of server static files and `TWiRLhttpEngine` provides an `OnExecute` event where the developer can handle the request.
The most important Engine is, of course, the REST Engine: `TWiRLEngine` while the others can be useful when you need to serve static files or to act like a "normal" HTTP server.

## Applications

The WiRL engine can handle many *sub-applications*, each application can have different resources, filters and authentication systems but they can also be shared. Most of the configuration it's on the Application object.

Let's try with an example:

```pascal
  // First application
  AServer
    .CurrentEngine<TWiRLEngine>
      .AddApplication('/auth')
        .SetAppName('Autentication Module')
        .SetResources([
        'Server.Auth.TAuthResource,Server',
        'Audit.TMonitorResource'])
  ;

  // Second application
  AServer
    .CurrentEngine<TWiRLEngine>
      .AddApplication('/order')
        .SetAppName('Order Module')
        .SetResources([
          'Server.Order.TOrderResource',
          'Server.Order.TCustomerResource',
          'Server.Audit.TMonitorResource'])
  ;
end;
```
In this example we configure two applications, the first handles two resources: *TAuthResource* and *TMonitorResource* the second three resources: *TOrderResource*, *TCustomerResource* and *TMonitorResource*. As you can see the *TMonitorResource* is used by both applications.

## Application's plugins
Additional configuration in an Application is manages through the concept of "plugins". A (configuration) plugin it's essentially an interface that provide configuration for an Application sub-module. Currently there are 3 sub-modules available.

### Auth configuration plugin
The `IWiRLConfigurationAuth` interface let's you configure the Auth values:
- SetAuthChallenge
- SetAuthChallengeHeader
- SetTokenType
- SetTokenLocation
- SetTokenCustomHeader

Let's see an example of such configuration:

```pascal
  // Auth configuration
  .Plugin.Configure<IWiRLConfigurationAuth>
    .SetTokenType(TAuthTokenType.JWT)
    .SetTokenLocation(TAuthTokenLocation.Bearer);
```
### JWT configuration plugin
The `IWiRLConfigurationJWT` interface let's you configure the JWT settings:
- SetClaimClass
- SetAlgorithm
- SetSecret
- SetSecret
- SetPublicKey
- SetPrivateKey

Let's see an example of such configuration:

```pascal
  // JWT configuration (App plugin configuration)
  .Plugin.Configure<IWiRLConfigurationJWT>
    .SetClaimClass(TServerClaims)
    .SetAlgorithm(TJOSEAlgorithmId.HS256)
    .SetSecret(TEncoding.UTF8.GetBytes(edtSecret.Text));
```

### JSON serializer (Neon) plugin 
The `IWiRLConfigurationNeon` interface let's you configure the Neon settings:
- SetMembers
- SetMemberCase
- SetMemberCustomCase
- SetVisibility
- SetIgnoreFieldPrefix
- SetUseUTCDate
- SetPrettyPrint

Let's see an example of such configuration:

```pascal
  // Neon configuration (App plugin configuration)
  .Plugin.Configure<IWiRLConfigurationNeon>
    .SetPrettyPrint(True)
    .SetUseUTCDate(True)
    .SetMemberCase(TNeonCase.SnakeCase);

```

