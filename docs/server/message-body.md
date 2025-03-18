# Entity Providers


## Entities in WiRL

In WiRL terminology Entities are simply data, often structured data (classes and records) but they can be of any Delphi type.

![Delphi Entities](/entities.png){class=center}

The main part of an HTTP interaction consists of the request and response entities. Entities are also referred to as the payload or message body in some contexts.

Entities are sent via a request, usually an HTTP `POST` and `PUT` method is used, or they are returned in a response, this is relevant for all the HTTP methods. The `Content-Type` HTTP header is used to indicate the type of entity being sent. Common content types are "text/plain", "text/xml", "application/json", and "application/pdf".

Media types are also used in the `Accept` header to indicate what type of resource representation the client wants to receive.


## Custom Entity Providers (MBR/W)

![Entity Providers](/entity-provider.png){class=center}

WiRL enables developers to add custom entity providers to the application. The custom entity providers can be used for dealing with user-defined classes in the requests as well as responses.

Adding a custom entity provider allows a way to deserialize user-defined classes from the message body and serialize any media type to your user specific class.

There are two types of entity providers:

- MessageBodyReader
- MessageBodyWriter

MessageBody Readers and Writers are crucial components in WiRL, serving as the bridge between HTTP request/response bodies and your application's data structures. They enable seamless conversion between various data formats and your Delphi objects, allowing you to focus on your business logic rather than low-level data parsing.

### MessageBodyReader

An application can provide an implementation of the `IMessageBodyReader` interface by implementing the `ReadFrom()` method to map the entity to the desired Delphi type.

The following figure shows how the MessageBodyReader reads an InputStream object and converts it to a user-defined Delphi object.

![MessageBodyReader](/mbr.png){class=center}

### MessageBodyWriter

The MessageBodyWriter interface represents a contract for a provider that supports the conversion from a Delphi type to a stream.

An application can provide an implementation of the `IMessageBodyWriter` interface by implementing the `WriteTo()` method to write the Delphi type to the Response Stream.

The following figure shows how MessageBodyWriter can take a user-defined class, Book, and marshal it to the Response's Stream object.

![MessageBodyReader](/mbw.png){class=center}

## How Do They Work

Suppose you define a resource in WiRL, like this:

```pascal
[Path('books')]
TBookResource = class
public
  [POST]
  [Consumes(TMediaType.APPLICATION_JSON)]
  [Produces(TMediaType.APPLICATION_JSON)]
  function NewBook([BodyParam] ABook: TBookProposal): TBook;
end;
```

The `Consumes` and `Produces` attributes state that you want the TBookProposal and TBook are in JSON format.

WiRL uses MessageBody Readers and Writers to handle the incoming and outgoing data:

1. **MessageBody Reader**: When a request arrives, WiRL looks for a reader that can transform the incoming JSON (specified by `Consumes(TMediaType.APPLICATION_JSON)`) into a `TBookProposal` object.

2. **Your Business Logic**: WiRL then calls your `NewBook()` method with the created `TBookProposal`.

3. **MessageBody Writer**: After your method returns a `TBook` object, WiRL finds a writer to convert it back to JSON (as specified by `Produces(TMediaType.APPLICATION_JSON)`).

## Content Negotiation

WiRL supports multiple `Consumes` and `Produces` attributes on a single resource. It selects the appropriate provider based on the request's `Content-Type` and `Accept` headers, allowing your API to be flexible with different data formats.

## Built-in Entity Providers

WiRL provides a variety of pre-built Entity Providers:

1. **Core Types** (WiRL.Core.MessageBody.Default):
   - Handles strings, simple types (integer, double, etc.), arrays, records, and objects (via the [Neon library plugin](neon)).
   - Supports streams and MultipartFormData.

2. **Data-aware Types** (WiRL.Data.MessageBody.Default):
   - Manages DataSets, DataSet arrays, and conversions to XML and CSV.

3. **FireDAC Specific** (WiRL.Data.FireDAC.MessageBody.Default):
   - Provides readers and writers tailored for FireDAC components.

4. **UniDAC Specific** (WiRL.Data.UniDAC.MessageBody.Default):
   - Provides readers and writers tailored for UniDAC components.

## Using Built-in Entity Providers

To use these pre-built providers, simply include the necessary units in your project:

```pascal
uses
  WiRL.Core.MessageBody.Default,
  WiRL.Data.MessageBody.Default,
  WiRL.Data.FireDAC.MessageBody.Default;
```

This inclusion automatically registers the readers and writers with WiRL, making them available for use in your resources.

## Custom Entity Providers

While WiRL provides a comprehensive set of built-in entity providers, you can also create custom ones for specific needs. This allows you to handle unique data formats or complex object transformations tailored to your application.

## Conclusion

Entity Providers in WiRL provide a powerful abstraction layer, handling the complexities of data transformation between HTTP and your application's domain objects. By leveraging these components, you can create clean, type-safe REST APIs while maintaining flexibility in data formats and focusing on your core business logic.