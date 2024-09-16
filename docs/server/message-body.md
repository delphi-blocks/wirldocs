# Message Body Readers and Writers

Message Body Readers and Writers are crucial components in WiRL, serving as the bridge between HTTP request/response bodies and your application's data structures. They enable seamless conversion between various data formats and your Delphi objects, allowing you to focus on your business logic rather than low-level data parsing.

## How They Work

When you define a resource in WiRL, like this:

```pascal
[Path('order')]
TOrderResource = class
public
  [POST]
  [Consumes(TMediaType.APPLICATION_JSON)]
  [Produces(TMediaType.APPLICATION_JSON)]
  function PostOrder([BodyParam] AOrderProposal: TOrderProposal): TOrder;
end;
```

WiRL uses Message Body Readers and Writers to handle the incoming and outgoing data:

1. **Message Body Reader**: When a request arrives, WiRL looks for a reader that can transform the incoming JSON (specified by `Consumes(TMediaType.APPLICATION_JSON)`) into a `TOrderProposal` object.

2. **Your Business Logic**: WiRL then calls your `PostOrder` method with the created `TOrderProposal`.

3. **Message Body Writer**: After your method returns a `TOrder` object, WiRL finds a writer to convert it back to JSON (as specified by `Produces(TMediaType.APPLICATION_JSON)`).

## Content Negotiation

WiRL supports multiple `Consumes` and `Produces` attributes on a single resource. It selects the appropriate reader or writer based on the request's `Content-Type` and `Accept` headers, allowing your API to be flexible with different data formats.

## Built-in Readers and Writers

WiRL provides a variety of pre-built Message Body Readers and Writers:

1. **Core Types** (WiRL.Core.MessageBody.Default):
   - Handles strings, simple types (integer, double, etc.), arrays, records, and objects (via the [Neon library plugin](neon)).
   - Supports streams and MultipartFormData.

2. **Data-aware Types** (WiRL.Data.MessageBody.Default):
   - Manages DataSets, DataSet arrays, and conversions to XML and CSV.

3. **FireDAC Specific** (WiRL.Data.FireDAC.MessageBody.Default):
   - Provides readers and writers tailored for FireDAC components.

## Using Built-in Readers and Writers

To use these pre-built components, simply include the necessary units in your project:

```pascal
uses
  WiRL.Core.MessageBody.Default,
  WiRL.Data.MessageBody.Default,
  WiRL.Data.FireDAC.MessageBody.Default;
```

This inclusion automatically registers the readers and writers with WiRL, making them available for use in your resources.

## Custom Readers and Writers

While WiRL provides a comprehensive set of built-in readers and writers, you can also create custom ones for specific needs. This allows you to handle unique data formats or complex object transformations tailored to your application.

## Conclusion

Message Body Readers and Writers in WiRL provide a powerful abstraction layer, handling the complexities of data transformation between HTTP and your application's domain objects. By leveraging these components, you can create clean, type-safe REST APIs while maintaining flexibility in data formats and focusing on your core business logic.