# Introduction

**WiRL** is an attempt to write a simple [ReST](https://en.wikipedia.org/wiki/Representational_state_transfer) library in Delphi using the new features of the language (such as generics, anonymous methods, attributes, record helpers and so on). It's inspired by the [JAX-RX specification](https://jax-rs-spec.java.net/), the "de facto" standard in the Java world to build a ReST API.

The main feature of WiRL is the mapping of any class in a web resource using some [attributes](server/attributes).

```pascal
[Path('customers')]
TCustomerResource = class
public
  [GET]
  [Produces('TMediaType.APPLICATION_JSON')]
  function SelectCustomers: TCustomerList;

  [POST]
  [Consumes('TMediaType.APPLICATION_JSON')]
  [Produces('TMediaType.APPLICATION_JSON')]
  function InsertCustomer(ACustomer: TCustomer): TCustomer;
end;
```

Every class decorated with the `[Path]` attribute and registered in the `TWiRLResourceRegistry` is a web resource associated with a specific path. The input parameters of the methods are read from the HTTP request, WiRL try to find the right parameter value using some built-in [attributes](server/attributes): `[PathParam]`, `[QueryParam]`, `[BodyParam]` and many others. Then inject the correct value into the parameters. If the parameter type is an object WiRL try to build the object using a [Message Body Reader](server/message-body) a special customizable class factory. The result type is handled in the same way but with a [Message Body Writer](server/message-body).

