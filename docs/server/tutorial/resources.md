# Tutorial: Resources

![Delphi RESTful Library](/logo.png){class=center-25}

## PODO as REST resources

Using the WiRL API, any PODO can be decorated to build a RESTful resource.

### Defining a root resource identified by a URI

You can begin with a simple PODO TBookResource and annotate it with the WiRL Attribute API:

```pascal
[Path('books')]
TBookResource = class
  ...
end;
```

This is now a resource class, which is decorated with the [Path] attribute. The value *books* indicates that the resource will be available at a location similar to the following URI:

```http
http://localhost:8080/rest/app/books
```

Then we can add methods to this resource so that, when a request with GET, POST, PUT, etc... hits this resource, a particular method in the class is invoked to produce the response.

### Defining methods for the resource

To add a method to this resource, we annotate the method with [GET], [POST], [PUT], or [DELETE]. In the following example, we chose to annotate using a [GET] attribute:


```pascal
[Path('books')]
TBookResource = class
public
  [GET]
  function GetBooks: string;
end;

implementation

function TBookResource.GetBooks: string;
begin
  Result := 'This will be a list of books';
end;

```

The `[GET]` attribute is telling WiRL that the `GetBooks` method handles the HTTP GET requests for the resource (URI) `/books`.

### Defining the Media Type (mimetype)

To specify the MIME type that can be handled by the resource, we should decorate the resource method with `[Produces]` and `[Consumes]`:

```pascal
[Path('books')]
TBookResource = class
public
	[GET] [Produces('text/plain')]
	function GetBooks: string;
end

implementation

function TBookResource.GetBooks: string;
begin
  Result := 'This will be a list of books';
end;

```

The `[Produces]` attribute specifies that the media type this method will produce is `text/plain`. Of course in WiRL you can specify all sort of mime types, provided you know how to generate it. How to convert from a Delphi type to a specific format and vice versa, is covered in detail in the tutorial about MBR/W.

### Registering the resource

Once you defined the `TBookResource` class you practically have finished your work because WiRL, each time that an http request "invoke" the `/book` URI, creates for you an instance of that class, execute the `GetBooks` methods, gets the result back, writes the result on the http response body, and finally destroys the instance.

WoW, too good to be true rigth? Well, almost... as a matter of fact there is on small caveat:

The Delphi optimizer usually removes from the executable all the classes "not used": classes that the optimizer sees as not referenced by variables, fields, etc...
In our example the class `TBookResource` will not be present in the executable because is not referenced in the code, so we have to "force" the inclusion of that class by registering the class in a resource registry, with the code below:

```pascal
initialization
  TWiRLResourceRegistry.Instance.RegisterResource<TBookResource>;

```

After that you with a minimal configuration for WiRL (see the configuration tutorial) you can execute your server, fire up some http debugger tool (Postman, Bruno, etc...) type the address and see the response:

```http
http://localhost:8080/rest/app/books
```

and the output should be:
```http
This will be a list of books
```

Of course the adress you have to type depends on the WiRL Server configuration and how to "launch" the executable dependes on the application type (Standalone, Console, Service...)

## Conclusion

In this tutorial we creates our first REST server responding to an http request.
