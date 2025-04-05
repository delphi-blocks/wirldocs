# The attributes

One of WiRL's distinctive features is its ability to let developers write **ordinary classes** using standard native objects and types, and then "remotize" the methods of these classes. To understand how these methods should be used in the context of a REST call, WiRL relies on a series of Attributes that must be applied to the **class**, its **methods**, and **parameters**.
These attributes are found in the WiRL.Core.Attributes unit, and we'll analyze them in detail in the following sections.

::: warning
If you forget to add the unit with the definition of the attributes Delphi will generate a *Warning*: `W1074 Unknown custom attribute`. The program will still compile but will not work. **From Delph 10.3 you can transform the Warning into an error in the Delphi options or for a single project**.
:::

**Attribute**: `Path`

This attribute must be applied to a class, in that way WiRL will consider it a resource. It can applied to a method too, then the two paths will be combined together in a new sub-resource.

```pascal
  [Path('user')]
  TUserResource = class(TObject)
  public
    [GET]
    [Produces(TMediaType.APPLICATION_JSON)]
    function GetUser(...): ...;

    [GET]
    [Path('{id}/todo')]
    [Produces(TMediaType.APPLICATION_JSON)]
    function GetUserTodo(...): ...;
```

In this example the `/user` path will be accessible via the path GetUser method. In the second example the path contains a **template** `Path('{id}/todo')`. Templates are strings that contain variable parts (in this case id) that are accessible to the method via the attribute `PathParam` explained below. This method will then be accessible from URLs like `/user/12/todo` or `/user/lminuti/todo`.

However, the full URL of the resource will also depend on the configuration set to `TWiRLServer`, `TWiRLEngine` and `TWiRLApplication` as explained [here](/server/tutorial/getting-started).

![Url](/WiRLURL.png)


**Attribute**: `GET`

Applied to a class method. The method should be called only if the HTTP method is `GET`.

**Attribute**: `PUT`

Applied to a class method. The method should be called only if the HTTP method is `PUT`.

**Attribute**: `POST`

Applied to a class method. The method should be called only if the HTTP method is `POST`.

**Attribute**: `DELETE`

Applied to a class method. The method should be called only if the HTTP method is `DELETE`.

**Attribute**: `Produces`

As we saw previously, WiRL associates the resource with the method of a class based on the attributes indicating the HTTP method and the path. However, the client can also indicate, via the [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) header, the desired response format. The `Produces` attribute must indicate one or more formats in which the method is capable of returning the response.

> *Warning* : This attribute is used only to "match" between request and method. That WiRL will execute the method code which will presumably return something as output. It's only at the end of this process that WiRL, through the **message body writers**, will attempt to convert the output into the required format. In the absence of an appropriate message body writer WiRL will return the error `415 - MediaType [%s] not supported on resource [%s]`.

**Attribute**: `Consumes`

This attribute behaves similarly to `Produces` but with respect to a resource's input. With the *PUT* and *POST* methods, for example, a message is sent to the server. The format of the message is indicated by the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header. In this case the header must match what is declared with the `Consumes` attribute. Once this has been done via the attribute `BodyParam` it will be possible to read the message sent by the client.

```pascal
  [Path('user')]
  TUserResource = class(TObject)
  public
    [POST]
    [Consumes(TMediaType.APPLICATION_JSON)]
    [Produces(TMediaType.APPLICATION_JSON)]
    function AppendUser([BodyParam] AUser: TUser): TUser;

  end;
```

In this example the method `AppendUser` expects a message in *JSON* format. If the message is indeed in this format WiRL will look for a **message body reader** capable of transforming a *JSON* into *TUser*. If it doesn't find it it will return the error `Unsupported media type [%s] for param [%s]`.

**Attribute**: `PathParam`

If a URL has been defined via the attribute `Path` containing a *template*, the content of the template will be associated with the parameter decorated with the attribute `PathParam`.

```pascal
  [Path('user')]
  TUserResource = class(TObject)
  public
    [GET]
    [Produces(TMediaType.APPLICATION_JSON)]
    function GetAllUsers(): TObjectList<TUser>;

    [GET]
    [Path('{id}')]
    [Produces(TMediaType.APPLICATION_JSON)]
    function GetUserById([PathParam('id')] AId: Integer): TUser;

    [GET]
    [Path('{id}/todo/{category}')]
    [Produces(TMediaType.APPLICATION_JSON)]
    function GetUserTodo(
        [PathParam('id')] AId: Integer
        [PathParam('category')] const ACategory: string
    ): TObjectList<TTodo>;
```

Let's consider several URLs:

* `/user`: This path will cause the method to be called `GetAllUsers`
* `/user/12`: In this case the method will be called `GetUserById` and the value *12*, which is part of the template, will be passed to the parameter `AId`. In fact, the name of the template parameter `Id` matches the value of the attribute `PathParam`.
* `/user/12/todo/done`: in this case the `GetUserTodo` method will be called and the parameters `AId` and `ACategory` receive 12 and the *done* string.

**Attribute**: `QueryParam`

QueryParam allows you to capture parameters passed via [query string](https://en.wikipedia.org/wiki/Query_string).

```pascal
  [Path('user')]
  TUserResource = class(TObject)
  public    
    [GET]
    [Produces(TMediaType.APPLICATION_JSON)]
    function GetUser(
        [QueryParam('name')] const AName: string;
        [QueryParam('email')] const AEmail: string
    ): TObjectList<TUser>;
```

In this example with a URL like: `/user?name=lminuti&email=lminuti@examples.com` WiRL will set the parameters `AName` and `AEmail` with the appropriate values.

**Attribute**: `FormParam`

This attribute works similarly to `QueryParam` but searches for parameters in the message body. *WiRL*, in this case, expects the body of the message to be in the `application/x-www-form-urlencoded` format, then decodes it and passes the values to the method parameters.

**Attribute**: `BodyParam`

This attribute allows you to read the entire body of the message as long as the format used is compatible with that indicated in the `Consumes` attribute and there is someone **message body reader** capable of transforming the message into the indicated object.

```pascal
  [Path('user')]
  TUserResource = class(TObject)
  public
    [POST]
    [Consumes(TMediaType.APPLICATION_JSON)]
    [Produces(TMediaType.APPLICATION_JSON)]
    function AppendUser([BodyParam] AUser: TUser): TUser;

  end;
```

In this example the `AppendUser` method expects a message in *JSON* format. If this is true WiRL will look for a **message body reader** capable of transforming a *JSON* into *TUser*.

**Attribute**: `HeaderParam`

Similar to `FormParam` or `QueryParam` but looks for the data in a header that must be specified in the attribute.

**Attribute**: `CookieParam`

Similar to the previous one but looks for the data in a cookie.

**Attribute**: `MultiPart`

This attribute allows reading parameters passed through a `multipart/form-data` POST request. In this case, the individual values sent can be read directly or via the `TWiRLFormDataPart` class. Let's look at an example:

```pascal
    [POST]
    [Path('/multipart')] 
    [Consumes(TMediaType.MULTIPART_FORM_DATA)]
    [Produces(TMediaType.APPLICATION_JSON)]
    function PostMultiPartExample(
      [FormParam] AValue: string;
      [FormParam] AContent: TWiRLFormDataPart;
      [FormParam] AJSON: TJSONObject
    ): TJSONObject;
  end;
```

In this case, the resource expects to find three parameters: `AValue`, `AContent`, and `AJSON`. The first and last are read directly, while the second uses `TWiRLFormDataPart`. The advantage of this class is that it allows you to obtain additional information about the parameter. In fact, each part of a multipart message contains special attributes (name, format, compression type, etc.).

**Attribute**: `DefaultValue`

This attribute allows assigning a value to a parameter in case it is not provided by the client.

**Attribute**: `Context`

The *Context* attribute is used to obtain special context information as explained here: [Context Injection](context-injection). It can be applied to either a class variable or a method parameter.

**Attribute**: `PermitAll`

This attribute (on a method) indicates that the method can be used by anyone as long as they are authenticated.

**Attribute**: `DenyAll`

*DenyAll* blocks a method for any user.

**Attribute**: `RolesAllowed`

This attribute (on a method) allows you to specify one or more roles that will have permission to use the method.

**Attribute**: `Singleton`

The *Singleton* attribute applies to either a method or the definition of a class. It indicates whether all instances of the class, or only the one returned by the method it is applied to, should be destroyed at the end of the HTTP call. For more information, see the chapter [Memory management](memory-management).

**Attribute**: `PreMatching`

Used to indicate that a filter should be invoked even if the resource, application, or engine does not exist (see [Filters](filters)).

**Attribute**: `PreMatchingResource`

Used to indicate that a filter should be invoked even if the resource does not exist (see [Filters](filters)).

**Attribute**: `NameBinding`

Applied to a custom attribute to create a "bind" between filters and resources (see [Filters](filters)).

**Attribute**: `Priority`

Indicates the priority of a filter (see [Filters](filters)).
