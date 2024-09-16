# Context Injection

One of the main features of WiRL is the fact that you can use any class to build your resources, there's no need to inherit from a specific class. But sometimes can be useful to ask WiRL some objects to work with, the first two examples that come to mind are the *HTTP request* and the *HTTP response*. As always you can give instructions to WiRL using attributes.

The following example shows how to inject the request and the response to a resource, in this case the attribute is `Context`.

```pascal
type
  [Path('/myresource')]
  TMyResource = class
  private
    [Context] Application: TWiRLApplication;
  public
    [GET]
    [Produces(TMediaType.APPLICATION_JSON)]
    function List([Context] Request: TWiRLRequest; [Context] Response: TWiRLResponse): string;
  end;
 
```

The `Context` attribute can be used to decorate *instance variables*, *properties* and *method parameters*. WiRL provides to inject the correct object to your variables before the resource method is invoked. WiRL matches the right object by its class. These are the class that you can inject:

* `TWiRLServer`: the WiRL server
* `TWiRLEngine`: the WiRL engine
* `TWiRLApplication`: the current WiRL application
* `TWiRLRequest`: the current HTTP request
* `TWiRLResponse`: the current HTTP response
* `TWiRLURL`: the parsed URL of the HTTP request
* `TWiRLAuthContext`: this object is used to work with the JWT token
* `TWiRLSubject`: the JWT claims

## Custom injection

If you have a custom class that you need to use in many resources, you can build your own *context injection factory*. Some examples of objects that you can inject are:

* A configuration
* An object/data module with your business logic
* An object that parses some HTTP headers

The last example is especially interesting because you can write the code to parse an HTTP header (or any part of the request) and simply inject this object wherever you want.

Let's see a basic example:

```pascal
interface

type
  // Class to be injected
  TMyClass = class
  private
    FValue: Integer;
  public
    property Value: Integer read FValue write FValue;
  end;

  // The class factory is responsable to create the context.
  // It will be released by the system unless it's annotated
  // with the Singleton attribute
  TMyClassFactory = class(TInterfacedObject, IContextFactory)
  public
    function CreateContext(const AObject: TRttiObject;
      AContext: TWiRLContext): TValue;
  end;

implementation

function TMyClassFactory.CreateContext(const AObject: TRttiObject;
  AContext: TWiRLContext): TValue;
var
  LInstance: TMyClass;
begin
  LInstance := TMyClass.Create;
  LInstance.Value := 42;
  Result := LInstance;
end;

initialization
  TWiRLContextInjectionRegistry.Instance.RegisterFactory<TMyClass>(TMyClassFactory);
```

So you need to define your class, a factory that is capable of creating the class and register both classes. The interesting part is that in the *CreateContext* method of the factory you have a reference to `TWiRLContext`, so basically you have access to the HTTP request (and much more information) and you can create the class accordingly.