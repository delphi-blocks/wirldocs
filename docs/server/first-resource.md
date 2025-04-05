# Writing your first resource

Developing a ReST server with **WiRL** consists of creating a some classes linked to the resources of your API. Generally, a ReST resource corresponds to a class and each HTTP method (GET, POST, PUT, DELETE, etc.) matches to a method of the class. Things can be more complicated if a resource, with the same HTTP method, provides multiple responses (for example with different format: JSON, XML, etc.); or in the case of *sub-resources* (e.g. for customer's invoices: customer resource, invoice sub-resource).

## Definition of the resource

Suppose we want to create a ReST API that exposes a resource `user`. We also want our resource to be accessible for both reading and writing. Then we should create the following *endpoints*:

```
# Read the user by its ID
GET /api/user/{id}

# Get the users that match some conditions
GET /api/user?name={name}&email={email}

# Change a user (user data will be in a JSON inside the body request)
PUT /api/user/{id}

# Add a user
POST /api/user

# Delete a user
DELETE /api/user/{id}
```

## Create the class

Now, if we are supposed to create a Delphi class that handles the resource, with a method for each `endpoint`, the most natural way to write it could be the following:

```pascal
  TUserResource = class(TObject)
  public
    // GET /api/user/{id}
    function GetUserById(AId: Integer): TUser;

    // GET /api/user?name={name}&email={email}
    function GetUser(const AName, AEmail: string): TObjectList<TUser>;

    // PUT /api/user/{id}
    function UpdateUser(AId: Integer; AUser: TUser): TUser;

    // POST /api/user
    function AppendUser(AUser: TUser): TUser;

    // DELETE /api/user/{id}
    function DeleteUser(AId: Integer): TUser;

  end;
```

What **WiRL** allows you to do is just take that class, as is, and make it accessible via *HTTP*. Obviously there are some things WiRL needs to know before making API publishing possible. Some are related to the general [configuration](configuration) of the application (the port, the message format, etc.), and then there are some information related to the resource itself.

As you can see, we have inserted some comments in the class needed to understand how the class methods are associated with HTTP methods. This information must be accessible to *WiRL*, what we need to do is transform the comments into a series of [attributes](attributes) made available by the library:

```pascal
  [Path('user')]
  TUserResource = class(TObject)
  public
    [GET]
    [Path('{id}')]
    [Produces(TMediaType.APPLICATION_JSON)]
    function GetUserById([PathParam('id')] AId: Integer): TUser;

    [GET]
    [Produces(TMediaType.APPLICATION_JSON)]
    function GetUser(
        [QueryParam('name')] const AName: string;
        [QueryParam('email')] const AEmail: string
    ): TObjectList<TUser>;

    [PUT]
    [Path('{id}')]
    [Consumes(TMediaType.APPLICATION_JSON)]
    [Produces(TMediaType.APPLICATION_JSON)]
    function UpdateUser(
        [PathParam('id')] AId: Integer; 
        [BodyParam] AUser: TUser
    ): TUser;

    [POST]
    [Consumes(TMediaType.APPLICATION_JSON)]
    [Produces(TMediaType.APPLICATION_JSON)]
    function AppendUser([BodyParam] AUser: TUser): TUser;

    [DELETE]
    [Path('{id}')]
    [Produces(TMediaType.APPLICATION_JSON)]
    function DeleteUser([PathParam('id')] AId: Integer): TUser;

  end;
```

In this way *WiRL* has all the information it needs.

## The attributes

The `WiRL.Core.Attributes` unit has several attributes, here we will only see those relating to the definition of resources.

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

**Other attributes**

There are other attributes that, similarly to what we saw previously, are responsible for reading: *header*, *cookie*, [JWT token](https://jwt.io/) and more. See also [Attributes](attributes).

## Conversion of parameters

In general, when *WiRL* associates a value read from the HTTP request to a method parameter, it will try to convert it in the right way. You can customize the way WiRL performs this type of conversion (e.g. the date format or decimal separator) via `IWiRLFormatSetting`.

```pascal
  FServer.AddEngine<TWiRLEngine>('/rest')
    .SetEngineName('RESTEngine')
    .AddApplication('/app')
      .SetResources('*')
      .SetFilters('*')

      .Plugin.Configure<IWiRLFormatSetting>
        .AddFormat(TypeInfo(TDateTime), TWiRLFormatSetting.ISODATE_UTC)
        .BackToApp
    // ...
```

Furthermore, if a method parameter is a class with a constructor that takes as input a single string parameter, *WiRL* will automatically instantiate the object, passing the read parameter to the constructor.

```pascal
  TUserIdList = class
  public
    constructor Create(const AList: string);
  end;

  [Path('user')]
  TUserResource = class(TObject)
  public    
    [GET]
    [Produces(TMediaType.APPLICATION_JSON)]
    function GetUsers(
        [QueryParam('id')] AIdList: TUserIdList
    ): TObjectList<TUser>;
```

With a request like:

```
GET /user?id=1,2,3,4
```

The object will be instantiated by passing the string `1,2,3,4` to the constructor parameter.

## Registration

Finally we need to register the class that implements the resource inside the **resource registry**. This is usually done in the *initialization* section of the *unit* where the class is defined.

For the `TUserResource` class we need the following code:

```pascal
initialization
   TWiRLResourceRegistry.Instance.RegisterResource<TUserResource>;
```

Now, when *WiRL* needs the `TUserResource` is able to create an instance using a parameterless constructor. If the class does not have a parameterless constructor, we have to provide an anonymous method that can instantiate the object:

```pascal
   TWiRLResourceRegistry.Instance.RegisterResource<TUserResource>(
     function: TObject
     begin
       Result := TUserResource.Create(...);
     end
   );
```