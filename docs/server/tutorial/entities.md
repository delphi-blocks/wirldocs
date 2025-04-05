# WiRL Tutorial #3 - Entities & Providers

![Delphi RESTful Library](/logo.png){class=center-25}

## Entities in WiRL

The main part of an HTTP interaction consists of the request and response entities. Entities are also referred to as the payload or message body in some contexts.

Entities are sent via a request, usually an HTTP `POST` and `PUT` method is used, or they are returned in a response, this is relevant for all the HTTP methods. The `Content-Type` HTTP header is used to indicate the type of entity being sent. Common content types are "text/plain", "text/xml", "application/json", and "application/pdf".

Media types are also used in the `Accept` header to indicate what type of resource representation the client wants to receive.


## Custom Entity Providers (MBR/W)

WiRL enables developers to add custom entity providers to the application. The custom entity providers can be used for dealing with user-defined classes in the requests as well as responses.

Adding a custom entity provider allows a way to deserialize user-defined classes from the message body and serialize any media type to your user specific class.

There are two types of entity providers:

- MessageBodyReader
- MessageBodyWriter

### MessageBodyReader

An application can provide an implementation of the `IMessageBodyReader` interface by implementing the `ReadFrom()` method to map the entity to the desired Delphi type.

The following figure shows how the MessageBodyReader reads an InputStream object and converts it to a user-defined Delphi object.

![MessageBodyReader](/mbr.png){class=center}

The following code shows how to provide an implementation of MessageBodyReader and uses Java Architecture for XML Binding (JAXB) with JAX-RS. JAXB provides a fast and convenient way to bind XML schemas and Java representations, making it easy for Java developers to incorporate the XML data and processing functions in Java applications. As a part of this process, JAXB provides methods for unmarshalling (reading) XML instance documents into Java content trees, and then marshalling (writing) Java content trees back into XML instance documents.

Here is a JAXB root element called Book. Book has properties such as name and ISBN.

### MessageBodyWriter

The MessageBodyWriter interface represents a contract for a provider that supports the conversion from a Java type to a stream.

The following figure shows how MessageBodyWriter can take a user-defined class, Book, and marshal it to an outputStream object.

![MessageBodyReader](/mbw.png){class=center}

### Path

### Params

### Produces, Consumes

### Singleton

### Auth attributes

