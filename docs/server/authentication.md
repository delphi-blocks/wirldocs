# Authentication and Authorization

WiRL offers a robust and flexible system for handling both authentication and authorization in your API. While it's possible to create custom authentication processes using [filters](filters) and [context injection](context-injection) (see example *12.Context*), WiRL also provides several classes that significantly simplify the developer's work. This guide will walk you through the process of setting up and using these features effectively.

## Understanding Authentication vs. Authorization

Before diving into the implementation details, it's essential to understand the difference between these two concepts:

- **Authentication**: The process of verifying the identity of a user.
- **Authorization**: Determining what actions or resources an authenticated user is allowed to access.

WiRL allows you to manage both aspects seamlessly.

## Configuration

### Setting Up JWT Authentication

To use JWT (JSON Web Token) for authentication, you need to configure WiRL as follows:

```pascal
.Plugin.Configure<IWiRLConfigurationJWT>
  .SetClaimClass(TServerClaims)
  .SetAlgorithm(TJOSEAlgorithmId.HS256)
  .SetSecret(TEncoding.UTF8.GetBytes(MySecretKey))
```

This configuration:
- Uses JWT tokens encoded with HS256 algorithm
- Sets a secret key for token encryption
- Specifies a custom claims class (`TServerClaims`) for additional token information

### Configuring Authorization

To set up authorization, specify where the token is located and its type:

```pascal
.Plugin.Configure<IWiRLConfigurationAuth>
  .SetTokenType(TAuthTokenType.JWT)
  .SetTokenLocation(TAuthTokenLocation.Bearer)
  .BackToApp
```

This setup uses JWT tokens in the Bearer header for authorization.

## Implementing Authentication

WiRL supports several authentication methods out of the box:

1. Basic Auth
2. Form-based authentication
3. JSON-based authentication

To implement any of these, create a class that inherits from the appropriate base class:

- `TWiRLAuthBasicResource` for Basic Auth
- `TWiRLAuthFormResource` for Form-based auth
- `TWiRLAuthBodyResource` for JSON-based auth

Then, implement the abstract `Authenticate` method:

```pascal
function Authenticate(const AUserName, APassword: string): TWiRLAuthResult; virtual; abstract;
```

Here's an example implementation:

```pascal
function TFormAuthResource.Authenticate(const AUserName, APassword: string): TWiRLAuthResult;
begin
  // Verify credentials (replace with your authentication logic)
  Result.Success := SameText(APassword, 'mypassword');

  // Assign roles based on username (replace with your role assignment logic)
  if SameText(AUserName, 'admin') or SameText(AUserName, 'paolo') then
    Result.Roles := 'user,manager,admin'.Split([','])
  else
    Result.Roles := 'user,manager'.Split([',']);

  // Set JWT claims
  Subject.Expiration := IncSecond(Now(), 30);
  Subject.UserID := AUserName;

  // Set custom claims if needed
  Subject.Language := 'en-US';
end;
```

This method should:
1. Verify the provided credentials
2. Set the `Success` property of the result
3. Assign appropriate roles
4. Set any additional claims for the JWT token

## Implementing Authorization

Once authentication is set up, you can use attributes to control access to your API methods:

- `[PermitAll]`: Allows access to any authenticated user
- `[DenyAll]`: Blocks access to all users
- `[RolesAllowed('role1,role2')]`: Specifies which roles can access the method

Example usage:

```pascal
[POST, RolesAllowed('admin,manager')]
[Produces(TMediaType.APPLICATION_JSON)]
function InsertUser([BodyParam] AUser: TUserInfo): TUserInfo;
```

This example restricts the `InsertUser` method to users with either the 'admin' or 'manager' role.

## Retrieving Token Information

In some cases, it can be useful to access additional information about the token. WiRL allows you to retrieve both the custom claim class defined in the configuration and information about the token itself through context injection.

To access token information within your resource classes, you can use the `[Context]` attribute to inject the necessary objects. Here's an example:

```pascal
[Path('user')]
TUserResource = class
protected
  // Injects the auth context into the "Auth" object
  [Context] Auth: TWiRLAuthContext;
  // Injects the custom claims into "Subject" object
  [Context] Subject: TServerClaims;
public
  // Resource implementation
end;
```

In this example:

- `TServerClaims` allows you to read all claims related to the token sent by the client (if available).
- `TWiRLAuthContext` provides information about the token itself, such as the token string and its validity.
