# Introduction

![Delphi RESTful Library](/logo.png){class=center-25}

**WiRL** is an attempt to write a simple [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) library in Delphi using the new features of the language (such as generics, anonymous methods, attributes, record helpers and so on).

## JAX-RS

WiRL it's inspired by the Java API for RESTful Web Services ([JAX-RX](https://jax-rs-spec.java.net/)), the "de facto" standard in the Java world to build a REST API.

The goals of the JAX-RS API (and therefore also WiRL) are:

- `POJO-based`: To provide a collection of classes and associated annotations to be used with POJOs (Plain Old Java Object) so as to expose them as Web resources.

- `HTTP-centric`: To use HTTP as the underlying network protocol and provide a clear mapping between HTTP and URI elements and the corresponding API classes and annotations.

- `Content Negotiation`: To be applicable to a wide variety of HTTP entity body content types and provide the necessary pluggability to allow additional types to be added.

The main components of a JAX-RS (and WiRL) are:

- MessageBody Readers & Writers (Clients & Servers)
- Filters (Clients & Servers)
- Annotations (Attributes)
- POJO for resources
- Serializer Engine for Entities
- HTTP verbs as actions
- Pluggable Auth 

## WiRL Main Features

WiRL wants to be a standard and clean way to build true RESTful services adhering to the famous 6 constraint of the REST Architecure:

![REST Constraints](/rest-constraints.png){class=center}

1. Client/Server
1. Stateless
1. Cache
1. Uniform interface
1. Layered system
1. Code on demand (optional)

if your service adopts the above constraints, it will benefit from the following properties:

- Scalability of components
- Reliability in the resistance to failure
- Visibility of communication between components
- Simplicity of a uniform interface
- Portability of components by moving program code with the data
- Modifiability of components to meet changing needs
- Performance in component interactions

The main feature of WiRL is the mapping of a Delphi class in a web resource using some [attributes](/server/attributes).

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

Every class decorated with the `[Path]` attribute and registered in the `TWiRLResourceRegistry` is a web resource associated with a specific path. The input parameters of the methods are read from the HTTP request, WiRL try to find the right parameter value using some built-in [attributes](/server/attributes): `[PathParam]`, `[QueryParam]`, `[BodyParam]` and many others. Then inject the correct value into the parameters. If the parameter type is an object WiRL try to build the object using a [Message Body Reader](/server/entity-providers) a special customizable class factory. The result type is handled in the same way but with a [Message Body Writer](/server/entity-providers).

