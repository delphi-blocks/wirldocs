# Exception Handling

WiRL provides a robust mechanism for handling exceptions in your web applications. This guide will walk you through the various ways you can manage and customize error responses.

## Default Exception Handling

By default, when an exception is raised in a WiRL application, it generates a 500 HTTP status code. The response body will be a JSON object with the following structure:

```json
{
  "status": 500,
  "exception": "EDivByZero",
  "message": "Division by zero"
}
```

The `exception` field contains the name of the exception class, while the `message` field contains the exception message.

## Custom Exception Responses

### EWiRLWebApplicationException

For more control over the error response, you can use the `EWiRLWebApplicationException` class. This allows you to specify a custom message and HTTP status code. For example:

```pascal
function TDemoResource.GetError: string;
begin
  raise EWiRLWebApplicationException.Create('Invalid input', 400);
end;
```

This will produce the following JSON response:

```json
{
  "status": 400,
  "exception": "EWiRLWebApplicationException",
  "message": "Invalid input"
}
```

### Adding Additional Data

`EWiRLWebApplicationException` also allows you to include additional data in the response. You can do this either by providing a JSON object or by using the fluent `ExceptionValue` syntax:

```pascal
function TDemoResource.GetError: string;
begin
  raise EWiRLWebApplicationException.Create('Invalid input', 400,
    TValuesUtil.MakeValueArray(
      Pair.S('unit', 'Test.pas'), // String value
      Pair.N('Line', 150)         // Numeric value
    )
  );
end;
```

This will generate the following response:

```json
{
  "status": 400,
  "exception": "EWiRLWebApplicationException",
  "message": "Invalid input",
  "data": {
    "unit": "Test.pas",
    "Line": 150
  }
}
```

The `Pair` object supports various data types:
- `S` for strings
- `N` for numeric values
- `D` for TDateTime
- `B` for boolean values

### Pre-defined Exception Classes

WiRL provides several pre-defined exception classes that derive from `EWiRLWebApplicationException`. These classes automatically set the appropriate HTTP status code:

#### Client Errors
- `EWiRLBadRequestException`: 400
- `EWiRLNotAuthorizedException`: 401
- `EWiRLNotFoundException`: 404
- `EWiRLNotAcceptableException`: 406
- `EWiRLUnsupportedMediaTypeException`: 415

#### Server Errors
- `EWiRLServerException`: 500
- `EWiRLNotImplementedException`: 501

## Exception Mappers

In some cases, you might want to associate a specific HTTP error code and response with a particular exception, including standard or third-party exceptions. For instance, you might want to map a dataset's "required field" exception to a 400-series error instead of the default 500.

To achieve this, you can use an exception mapper. Here's how to create and use one:

1. Create a class that inherits from `TWiRLExceptionMapper` and implement the `HandleException` method:

```pascal
TFieldRequiredErrorMapper = class(TWiRLExceptionMapper)
public
  procedure HandleException(AExceptionContext: TWiRLExceptionContext); override;
end;

procedure TFieldRequiredErrorMapper.HandleException(
  AExceptionContext: TWiRLExceptionContext);
const
  StatusCode = 400;
var
  MyException: EFieldRequiredError;
  LJSON: TJSONObject;
begin
  inherited;
  MyException := AExceptionContext.Error as EFieldRequiredError;
  LJSON := TJSONObject.Create;
  try
    EWiRLWebApplicationException.ExceptionToJSON(MyException, StatusCode, LJSON);
    LJSON.AddPair(TJSONPair.Create('ErrorCode', TJSONNumber.Create(MyException.ErrorCode)));
    AExceptionContext.Response.StatusCode := StatusCode;
    AExceptionContext.Response.ContentType := 'application/json';
    AExceptionContext.Response.Content := TJSONHelper.ToJSON(LJSON);
  finally
    LJSON.Free;
  end;
end;
```

2. Register the exception mapper:

```pascal
TWiRLExceptionMapperRegistry.Instance.RegisterExceptionMapper<TFieldRequiredErrorMapper, EFieldRequiredError>();
```

By using exception mappers, you can customize how WiRL handles specific exceptions, providing more meaningful and appropriate responses to your API clients.

### Global exception mapper

By registering an exception mapper for the `Exception` class, you're providing a catch-all handler for any exception that doesn't have a more specific mapper. This allows you to completely customize how WiRL generates error responses for all exceptions.
This approach is particularly useful when you want to:

* Ensure a consistent error response format across your entire application.
* Add additional debugging information to all error responses.
* Implement logging or error tracking for all exceptions.
* Mask internal error details in production environments.