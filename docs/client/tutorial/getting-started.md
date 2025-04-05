# Getting started with WiRL Client

In this section, we will see how to use the WiRL client module. First, we will look at the `TWiRLClient` component, which handles low-level HTTP calls. Then, we will explore the `TWiRLClientResource` component, which, through a simple configuration, can significantly simplify the interaction with a REST API, whether developed with WiRL or any other library.

## Introduction

The main class that implements the HTTP protocol is `TWiRLClient`; its use is very simple and resembles that of the [THTTPClient](http://docwiki.embarcadero.com/Libraries/Alexandria/en/System.Net.HttpClient.THTTPClient) class (present from Delphi XE8). This class is the heart of the client module of WiRL and the various classes such as `TWiRLClientApplication` and `TWiRLClientResource` use it to communicate with the server.

```pascal
procedure TForm1.Button1Click(Sender: TObject);
var
  LResponse: IWiRLResponse;
  LHeader: TWiRLHeader;
  LRequestHeader: IWiRLHeaders;
begin
  LRequestHeader := TWiRLHeaders.Create;
  LRequestHeader.Accept := 'application/json';
  LResponse := WiRLClient1.Get('http://localhost:9999/', nil, LRequestHeader);
  Memo1.Lines.Add(LResponse.ContentText);
end;
```

In the example, the `Get` method uses three arguments: the **URL** to be called, a **stream** to be used for the body of the response and the list of **headers**. If the stream is nil, as in the example, a *TMemoryStream* is created by WiRL and it will be destroyed automatically together with the *IWiRLResponse* object).

The TWiRLClient object, in order to make the calls, in turn relies on THTTP (Indy) or THttpClient (native Delphi with HTTPS support). You can choose which one to use through the `ClientVendor` property. **Attention**: depending on the vendor chosen, the unit `WiRL.http.Client.Indy` or `WiRL.http.Client.NetHttp` must be included. 

It is also possible to create custom implementations based for example on [ICS](http://www.overbyte.be/frame_index.html) or [Synapse](https://sourceforge.net/projects/synalist/) simply by implementing the `IWiRLClient` and `IWiRLResponse` interfaces. 

In addition, the `TWiRLClient` component has the `WiRLEngineURL` property which is used by `TWiRLClientApplication` and `TWiRLClientResource` as the main entry point for HTTP(S) calls.

## TWiRLClientApplication

As on the server, the `TWiRLClientApplication` class is used to configure message body readers and writers, filters and all registered plugins. The easiest way to initialize it is through the [fluent interface](https://www.martinfowler.com/bliki/FluentInterface.html):

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
    // Configure Neon
    .Plugin.Configure<IWiRLConfigurationNeon>
      .SetUseUTCDate(True)
      .SetVisibility([mvPublic, mvPublished])
      .SetMemberCase(TNeonCase.CamelCase)
    .BackToApp;
  FApp.AppName := 'app';
  // Specify the TWiRLClient to use
  FApp.Client := FClient;
  // ...
end;
```

The **message body readers and writers** are the same as the server and allow you to transform the data streams sent to the server or arriving from the server into objects. In this way a stream with a [JSON](https://www.json.org/json-it.html) like this:

```json
{
  "name": "Luca",
  "role": "ADMIN"
}
```

can be used to initialize a hypothetical *TUser* object.

**Filters** can be used a bit like events to intercept the request sent to the server or the response and perform some action (perform a log, manage authentication, save cookies, etc.).

## TWiRLClientResource

Once *TWiRLClient* and *TWiRLClientApplication* have been initialized, it is possible to make the ReST calls. Also in this case it is possible to use the *fluent syntax* and, since the implementation is done through interfaces, it is not necessary to destroy the WiRL objects.

```pascal
function TMainDataModule.GetPerson(Id: Integer): TPerson;
begin
  Result := WiRLClientApplication1
    // Create the invokation object for the resource
    .Resource('person')
    // Set the accept header (necessary for the server
    // to decide the format of the response)
    .Accept('application/json')
    // Set the *Id* parameter
    .QueryParam('Id', Id.ToString)
    // Make the call deserializing the response
    // into an object of type TPerson
    .Get<TPerson>;
end;
```

With this example, *WiRLClientApplication1* is asked to generate a new `TWiRLInvocation` on the indicated resource. Through the `Accept` and `QueryParam` methods, the headers and parameters required by the server are set. The `Get` method will start the actual request and the body of the message returned by the server will be used to create an object of type `TPerson` as indicated.

## User-created objects

Another way of use `TWiRLInvocation` is to give to the `Get` method (the same thing also applies to `Post`, `Put`, `Delete`, etc.) an object created by us that will be "filled" with the data provided by the server.

```pascal
function TMainDataModule.GetPersonName(Id: Integer): string;
var
  LPerson: TPerson;
begin
  LPerson := TPerson.Create;
  try
    WiRLClientApplication1
      .Resource('person')
      .Accept('application/json')
      .QueryParam('Id', Id.ToString)
      .Get(LPerson);
    Result := LPerson.Name;
  finally
    LPerson.Free;
  end;
end;
```

This approach is very useful when the server returns an *array* of objects. For examples if the properties of the objects are equivalent to the fields of a *dataset*, WiRL is able to populate the fields of the DataSet (for example a *memory table*) automatically.

```pascal
procedure TMainDataModule.GetPeople(ADataSet: TDataSet);
begin
  WiRLClientApplication1
    .Resource('person')
    .Accept('application/json')
    .Get(ADataSet);
end;
```

## Read the response at a low level

In some cases it may be useful to read the server response in more detail. For example, the server could return different JSONs depending on certain *headers* or the [status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). In this case we need to access `IWiRLResponse` which contains all the information of the response.

```pascal
function TMainDataModule.GetPerson(Id: Integer): TPerson;
var
  LResponse: IWiRLResponse;
begin
  LResponse := WiRLClientApplication1
    .Resource('person')
    .Accept('application/json')
    .QueryParam('Id', Id.ToString)
    .Get<IWiRLResponse>;
  // Do something with the response
  if LResponse.Headers.ContentType <> 'application/json' then
    Abort;
  Result := LResponse.Content.AsType<TPerson>();
end;
```

## Exception handling

In case of protocol errors (status code 400 or 500) the calls to the server raise an exception of type `EWiRLClientProtocolException` this object, in addition to the error message, contains the entire response of the server (in the `Response` property); it is therefore possible to retrieve any information returned by the server.

```pascal
procedure TMainDataModule.GetPeople(ADataSet: TDataSet);
begin
  try
    WiRLClientApplication1
      .Resource('person')
      .Accept('application/json')
      .Get(ADataSet);
  except
    on E: EWiRLClientProtocolException do
    begin
      Log.Error('ERROR: ' + E.Response.ContentText);
      raise;
    end;
  end;
end;
```

Alternatively, you can disable the exceptions and handle the *status code* manually.

```pascal
procedure TMainDataModule.GetPeople(ADataSet: TDataSet);
var
  LResponse: IWiRLResponse;
begin
  LResponse := WiRLClientApplication1
    .Resource('person')
    // Disable protocol exceptions
    .DisableProtocolException
    .Accept('application/json')
    .Get<IWiRLResponse>(IWiRLResponse);
  if LResponse.Status = TWiRLResponseStatus.Success then
    LResponse.Content.AsType(ADataSet);
end;
```

In the example, the `Status` property of the response was used. It contains an enumeration with the category of the HTTP status code (Informational, Success, Redirect, ClientError, ServerError).

## More

There are many other useful features of WiRL Client such as:
- [Filter management](/server/filters)
- [Message body readers and writers](/server/entity-providers)
- [Usage of "vendors" for TWiRLClient](/client/configuration)

