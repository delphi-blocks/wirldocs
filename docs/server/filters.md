# Filters for Requests and Responses

Filters can intercept requests and responses and do whatever you want:

* Modify every header of the request or the response
* Modify the entire content of the response
* Do some logging
* Raise an exception to abort the transaction
* Silently answer to a request instead of calling the right ReST resource

and many more.

::: tip DEMO
You can find a demo demonstrating how to create various types of filters in the `demo\10.Filters` folder.
:::

## Getting started

### Response filters

The following example shows a response filter adding a header to each response.

```pascal
interface

type
  TResponsePoweredByFilter = class(TInterfacedObject, IWiRLContainerResponseFilter)
  public
    procedure Filter(AResponseContext: TWiRLContainerResponseContext);
  end;

implementation

procedure TResponsePoweredByFilter.Filter(AResponseContext: TWiRLContainerResponseContext);
begin
  if AResponseContext.Response.StatusCode >= 500 then
    AResponseContext.Response.HeaderFields['X-Powered-By'] := 'DataSnap' // ;-)
  else
    AResponseContext.Response.HeaderFields['X-Powered-By'] := 'WiRL';
end;

initialization
  TWiRLFilterRegistry.Instance.RegisterFilter<TResponsePoweredByFilter>;

```

The filter must implement the `IWiRLContainerResponseFilter` interface and must be registered. This is a *response filter* so it's executed after the ReST resource does its work, also if the resource raises an exception.

### Request filters

The following example shows a request filter that checks the value of a custom HTTP header.

```pascal
interface

type
  TRequestCheckerFilter = class(TInterfacedObject, IWiRLContainerRequestFilter)
  public
    procedure Filter(ARequestContext: TWiRLContainerRequestContext);
  end;

implementation

procedure TRequestCheckerFilter.Filter(ARequestContext: TWiRLContainerRequestContext);
begin
  if Pos('error', ARequestContext.Request.Query) > 0 then
    raise EWiRLWebApplicationException.Create(Format('Filter error test [%s]', [FApplication.Name]), 400);
end;

initialization
  TWiRLFilterRegistry.Instance.RegisterFilter<TRequestCheckerFilter>;

```
In this example if the filter raise an exception the ReST resource isn't called.

## Pre-matching filters

The previous examples would be applied only after a suitable resource method has been selected to process the actual request. If you want a filter that runs *before* the resource matching you must use a Pre-matching filters. In this case you have to simply decorate the filter with the `PreMatching` attribute.

```pascal
type
  [PreMatching]
  TRequestLoggerFilter = class(TInterfacedObject, IWiRLContainerRequestFilter)
  public
    procedure Filter(ARequestContext: TWiRLContainerRequestContext);
  end;
```

## Name binding

Something can be useful to invoke a filter only to some of the resource methods. What you need is simply a brand new attribute that decorates both the filter class and the resource methods. The attribute itself must be decorated with the `NameBinding` attribute (seems tricky but isn't).

```pascal
type
  // I declare the new attribute
  [NameBinding]
  ContentEncodingAttribute = class(TCustomAttribute);

  // I use the new attribute to decorate the filter
  // than I must decorate the resource method with the same attribute
  [ContentEncoding]
  TResponseEncodingFilter = class(TInterfacedObject, IWiRLContainerResponseFilter)
  private
    const ENC_GZIP = 'gzip';
    const ENC_DEFLATE = 'deflate';
    const ENC_IDENTITY = 'identity';
  public
    procedure Filter(AResponseContext: TWiRLContainerResponseContext);
  end;
```

## Priorities

In a complex application you can have more filter before and after a resource method and you have to choose the exact order in which they are invoked. With WiRL this is possible with the `Priority` attribute that must be used to decorate the filter class. There are some predefined priorities but you can define any value you like:

Name             | Value
---------------- | -------------
AUTHENTICATION   | 1000
AUTHORIZATION    | 2000
HEADER_DECORATOR | 3000
ENTITY_CODER     | 4000
USER             | 5000 (*default*)

The filters are first ordered by theirs priority and then invoked.

```pascal
  [Priority(TWiRLPriorities.AUTHORIZATION)]
  TAuthorizationFilter = class(TInterfacedObject, IWiRLContainerRequestFilter)
  public
    procedure Filter(ARequestContext: TWiRLContainerRequestContext);
  end;
```
