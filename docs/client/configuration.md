# Configuring the Client

Often WiRL is used only as a library to write ReST APIs. But since the first versions there is a module for creating ReST clients that can adapt to servers written with **any technology**. WiRL tries to simplify the use of this part of the library using the **same concepts of server development** also for the client part. In fact, many classes present on the server are presented in a similar way on the client:

| Server               | Client                    |
| -------------------- |:-------------------------:|
| TWiRLServer          | TWiRLClient               | 
| TWiRLApplication     | TWiRLClientApplication    |
| Resource (any class*) | TWiRLClientResource       |
| TWiRLFilterRegistry  | TWiRLClientFilterRegistry |
| TMessageBodyReader** | TMessageBodyReader        |
| TMessageBodyWriter** | TMessageBodyWriter        |

\* Any class registered with `RegisterResource`

** Client and server share the same readers and writers!!

## Basic Configuration

The most straightforward way to initialize a `TWiRLClientApplication` is through its fluent interface. Here's an example:

```pascal
constructor TMyClass.InitWiRLClient;
begin
  // Create the instance of TWiRLClientApplication
  FApp := TWiRLClientApplication.Create(nil);
  FApp
    // Add all registered readers
    .SetReaders('*.*')
    // Add all registered writers
    .SetWriters('*.*')
    // Add all registered filters
    .SetFilters('*.*')
    // Configure Neon (JSON serialization library)
    .Plugin.Configure<IWiRLConfigurationNeon>
      .SetUseUTCDate(True)
      .SetVisibility([mvPublic, mvPublished])
      .SetMemberCase(TNeonCase.CamelCase)
    .BackToApp;
  FApp.AppName := 'app';
  // Specify the TWiRLClient to use
  FApp.Client := FClient;
  // ... Additional configuration as needed
end;
```

Let's break down this configuration:

1. **Readers and Writers**: `SetReaders('*.*')` and `SetWriters('*.*')` add all registered message body readers and writers. These components handle data transformation between streams and objects.

2. **Filters**: `SetFilters('*.*')` adds all registered filters, which can intercept requests and responses for logging, authentication, etc.

3. **Neon Configuration**: The `Plugin.Configure<IWiRLConfigurationNeon>` section sets up the JSON serialization options using the Neon library.

4. **Application Name**: `FApp.AppName := 'app';` sets a name for your client application. This name is used solely for logging and documentation purposes. It helps identify the client in logs and debug sessions without affecting functionality. Choose a descriptive name that reflects your application's purpose.

5. **Client Assignment**: `FApp.Client := FClient;` specifies the `TWiRLClient` instance to use for HTTP communications. `TWiRLClient` is the component responsible for managing the actual HTTP calls. Through its `Vendor` property, you can choose between different HTTP client implementations: Indy or NetHttpClient.


## TWiRLClient

The TWiRLClient object, responsible for making HTTP calls, relies on either THTTP (Indy) or THttpClient (native Delphi with HTTPS support). You can choose which one to use through the `ClientVendor` property. 

**Important**: Depending on the vendor chosen, you must include the appropriate unit in your project:
- For Indy: `WiRL.http.Client.Indy`
- For NetHttpClient: `WiRL.http.Client.NetHttp`

WiRL also supports custom implementations. For example, you can create implementations based on [ICS](http://www.overbyte.be/frame_index.html) or [Synapse](https://sourceforge.net/projects/synalist/) by simply implementing the `IWiRLClient` and `IWiRLResponse` interfaces.


## Message Body Readers and Writers

Message body readers and writers are shared between client and server sides in WiRL. They allow seamless transformation between data streams and objects. For example, a JSON stream like this:

```json
{
  "name": "Luca",
  "role": "ADMIN"
}
```

can be automatically converted into a `TUser` object (and vice versa) when the appropriate reader/writer is registered.

## Filters

Filters in WiRL act similarly to events, allowing you to intercept requests and responses. Common use cases for filters include:

- Logging requests and responses
- Managing authentication (e.g., adding authentication headers)
- Handling cookies
- Performing custom transformations on data

## Customization

While the example shows a basic configuration, you can customize various aspects:

- Selectively add readers, writers, or filters instead of using `'*.*'`
- Configure additional plugins
- Set up custom error handling
- Configure proxy settings, if needed
