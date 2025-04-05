# WiRL Concepts

![Delphi RESTful Library](/logo.png){class=center-25}

## PODO as REST resources

The main feature of WiRL is to transform a normal PODO (**P**lain **O**ld **D**elphi **O**bject) into a full featured REST resource.

You can create a class (or use an old one) and decorate it with the WiRL attributes API like in the example below:

```pascal
[Path('books')]
TBookResource = class
public
  [GET]
  [Produces('TMediaType.APPLICATION_JSON')]
  function GetBooks: TBookList;

  [POST]
  [Consumes('TMediaType.APPLICATION_JSON')]
  [Produces('TMediaType.APPLICATION_JSON')]
  function NewBook(ABook: TBook): TBook;
end;
```

This is now a resource class, which is decorated with the [Path] attribute. The value *books* indicates that the resource will be available at a location similar to the following URI:

```http
http://localhost:port/rest/app/books
```

Then we can add methods to this resource so that, when a request with GET, POST, PUT, etc... hits this resource, a particular method in the class is invoked to produce the response.

To add a method to this resource, we annotate the method with `[GET]`, `[POST]`, `[PUT]`, or `[DELETE]`. In the following example, we chose to annotate using a `[GET]` attribute:


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

So, using attributes, WiRL lets you use (or create a brand new) a Delphi class to manage HTTP requests following the REST principles.

## Entities as Request/Response

## MessageBody Readers & Writers

## Filters

## WiRL Attributes

## Automatic serialization for Entities

## Attribute-based Auth

