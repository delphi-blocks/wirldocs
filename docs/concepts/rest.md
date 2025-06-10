# What is REST?

![REST](/rest.png){class=center-50}

REST (REpresentational State Transfer) is an architectural style for providing standards between computer systems on the web, making it easier for systems to communicate with each other using standard HTTP methods and URLs to interact with resources.

## Key Principles of REST services (constraints)

1. **Client-Server**: The client (e.g., a web browser or mobile app) and server are separate entities, with the client initiating requests and the server responding. 

1. **Stateless**: Each request from the client to the server must contain all the information necessary to understand the request, and the server does not store any client context between requests.

1. **Cacheable**: Responses from the server can be cached by the client to improve performance, as long as the server indicates that the response is cacheable. 

1. **Uniform Interface**: REST APIs use a standardized interface, typically based on HTTP methods (`GET, POST, PUT, DELETE`) and URLs, making them easy to learn and use. 

1. **Layered System**: The client may not be aware of the server's architecture, allowing for flexibility and scalability. 

1. **Code on Demand (Optional)**: Clients can extend their functionality by downloading and executing code from the server. 

## REST Benefits

- **Simplicity**: REST APIs are relatively easy to implement and understand. 
- **Scalability**: RESTful architectures can handle large amounts of traffic and data. 
- **Flexibility**: REST APIs can be used with various programming languages and platforms. 
- **Interoperability**: REST APIs can easily integrate with other systems and services. 


## RESTful Web Services
A RESTful Web Service that is aligned with the REST principles . The URIs identify the resources. For example, a RESTful resource for a book can be identified as `https://myapi.com/order`.

A resource for an order identified by number could be `https://foo.org/myapi.com/order/123`. This shows a human-readable URI that is easy to understand and identify.


## Verbs in REST

![REST](/verbs.png){class=center}

REST uses HTTP verbs, some of the requests used in REST are as follows:

- `GET`: Retrieves a representation of a resource from server to client
- `POST`: Creates a resource on the server (based on the representation from the client)
- `PUT`: Used to update or create a reference to a resource on server
- `DELETE`: Deletes a resource on server
- `HEAD`: Checks for a resource without retrieving it


## Safety and idempotence
When it comes to REST, a safe method, by definition, is a HTTP method that does not modify the state of the resource on the server. For example, invoking a `GET` or a `HEAD` method on the resource URL should never change the resource on the server. 
`POST` is considered not safe since it usually creates a resource on the server. `DELETE` is also considered not safe since it will delete the resource on the server. `PUT` is not safe since it will change the resource on the server.

Idempotent method is a method that can be called multiple times yet the outcome will not change.

`GET` and `HEAD` are idempotent, which means that even though the same operation is done multiple times the result does not vary. `PUT` is idempotent; calling the `PUT` method multiple times will not change the result and the resource state is exactly the same.

`DELETE` is idempotent because once the resource is deleted it is gone, and calling the same operation multiple times will not change the outcome.

In contrast, `POST` is not idempotent and calling `POST` multiple times can have different outcomes.


