# WiRL: Delphi RESTful Library

![Delphi RESTful Library](/logo.png){class=center-25}

## WiRL: What it is

**WiRL** was created to simplify [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) service implementation in Delphi but, more importantly, to enable maximum interoperability with REST clients written in other languages and tools.

WiRL takes after Java [JAX-RS](https://jax-rs-spec.java.net/) specifications and tries to be compliant with the 6 REST constraints.

WiRL is a high-level REST framework exposing plain Delphi objects (PODO) as RESTful web resources by applying [attributes](server/attributes) to these classes.

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
WiRL has a strong HTTP content negotiation and  defines [attributes](server/attributes) to bind specific URI patterns and HTTP operations to individual methods of your Delphi class. It has parameter [injection](server/context-injection) attributes so that you can easily pull in information from the HTTP request. It has message [body readers and writers](server/message-body) that allow you to decouple data format marshalling and unmarshalling from your Delphi objects. It has [exception mappers](server/exception-handling) that can map an exception to an HTTP response code and message.

WiRL uses 3 submodules:
1. [Delphi JOSE and JWT Library](https://github.com/paolo-rossi/delphi-jose-jwt) for the JSON Web Token creation and validation
2. [Neon - Serialization Library for Delphi](https://github.com/paolo-rossi/delphi-neon) to convert Delphi simple types, objects, records, arrays, etc... to the JSON format
3. [OpenAPI 3 for Delphi](https://github.com/paolo-rossi/OpenAPI-Delphi) for the OpenAPI documentation generation

## WiRL: What it's not

WiRL is not a general purpose http/communication framework, instead it tries to fully adhere the the REST architectural style enabling the 6 REST constraints and enforcing through it's structure, attributes and examples a **REST clean code** style.

Although it has several feature TDataSet-related, WiRL is not a mere "Delphi TDataSet remoting framework", allowing a more open communication concept between the server and the clients.

