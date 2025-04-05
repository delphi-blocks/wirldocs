# Exception Handling

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
