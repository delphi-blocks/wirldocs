# Neon Integration

[Neon](https://github.com/paolo-rossi/delphi-neon) is a powerful serialization library for Delphi that facilitates the conversion of objects and other values to and from JSON. It supports simple Delphi types as well as complex classes and records.

## WiRL and Neon Integration

WiRL seamlessly integrates with Neon through its default [MessageBody readers and writers](message-body). This integration allows automatic serialization and deserialization of objects in request bodies and response returns.

## Configuring Neon in WiRL

You can customize Neon's behavior in WiRL using the official plugin interface. Here's an example of how to configure Neon within your WiRL server setup:

```pascal
RESTServer := TWiRLServer.Create(Self);
RESTServer.AddEngine<TWiRLEngine>('/rest')
  .SetEngineName('RESTEngine')
  .AddApplication('/app')
    .SetResources('*')
    .SetFilters('*')
    // Neon plugin configuration
    .Plugin.Configure<IWiRLConfigurationNeon>
      .SetUseUTCDate(True)
      .SetVisibility([mvPublic, mvPublished])
      .SetMemberCase(TNeonCase.PascalCase);
StartServerAction.Execute;
```

## Configurable Parameters

Neon's behavior can be fine-tuned using various parameters. Each parameter is set using a corresponding `Set<ParameterName>` function. Here are the key parameters:

### Members
- `Fields`: Serialize/deserialize object fields
- `Properties`: Consider only object properties

### MemberCase
Controls how property names are formatted in JSON:
- `Unchanged`: Leaves names as-is
- `LowerCase`: Converts to all lowercase (propertyname)
- `UpperCase`: Converts to all uppercase (PROPERTYNAME)
- `PascalCase`: Capitalizes the first letter of each word (PropertyName)
- `CamelCase`: Like PascalCase, but keeps the first letter lowercase (propertyName)
- `SnakeCase`: Separates words with underscores (Property_Name)
- `KebabCase`: Separates words with hyphens (Property-Name)
- `ScreamingSnakeCase`: Like SnakeCase, but in all uppercase (PROPERTY-NAME)
- `CustomCase`: Uses a custom function specified by `MemberCustomCase`

### MemberCustomCase
Allows you to specify a custom function for property name conversion.

### Visibility
Determines which class members to include based on their visibility:
- `mvPrivate`: Includes private variables
- `mvProtected`: Includes protected variables
- `mvPublic`: Includes public variables
- `mvPublished`: Includes published variables

### UseUTCDate
When set to `True`, treats dates as UTC.

### PrettyPrint
When enabled, generates more readable (but larger) JSON output.

## Best Practices

1. **Choose appropriate visibility**: Typically, using `mvPublic` and `mvPublished` is sufficient and secure for most applications.

2. **Consider date handling**: If your application deals with multiple time zones, setting `UseUTCDate` to `True` can help maintain consistency.

3. **Balance readability and performance**: While `PrettyPrint` makes JSON more readable, it increases payload size. Use it judiciously, especially in high-traffic scenarios.

4. **Consistency in naming**: Choose a `MemberCase` that aligns with your API design principles and stick to it across your application.
