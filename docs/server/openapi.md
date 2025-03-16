# OpenAPI Documentation


![OpenAPI Initiative](/openapi.png){class=center}

If you ever developed a public **REST API** you know that you have to provide the users of the API with some documentation so they can write the client in their language of choice.

Of couse you can write your documentation manually and publish to some website, but you have to continuously sync the documentation with the changes to your API endpoints, parameters, entities, etc... and you know that it can be an exhausting task! :-)

**WiRL** tries to build this documentation for you using the code itself, the attributes used to decorate the resource classes, the XMLDoc documentation, etc...

::: tip :book: OpenAPI Demo
You can find a demo generating OpenAPI documentation in the `demo\18.OpenAPI` folder. Play with it do discover more!
:::

## What is OpenAPI?

**OpenAPI** is a specification format that is used to define **REST APIs**. It uses **JSON Schema** to describe the API's calls and data. OpenAPI documents can establish a contract between the API consumer and producer, they can be used to generate documentation, mock servers, client SDKs, and API tests.

An **OpenAPI document** describes the API without requiring access to the source code or additional documentation. The specification is both human and machine readable.

OpenAPI documents can be created with a code editor or an API design tool in the early phases of the API lifecycle, or they can be **generated from existing API code**.

## History of OpenAPI

**OpenAPI** or **OAS** (Open API Specification) was previously known as **Swagger** specification:

- The developed began in 2011 by Tony Tam.
- In 2015 SmartBear acquired the Swagger API specification.
- In November 2015 SmartBear donated the Swagger specification to a new organization called the **OpenAPI Initiative**, under the sponsorship of the **Linux Foundation**. Other founding member of the **OpenAPI Initiative** includes Apigee, Google, IBM, Intuit, Microsoft, and PayPal.
- In 2016 the Swagger specification was renamed the **OpenAPI Specification (OAS)** and was moved to a new [GitHub repository](https://github.com/OAI/OpenAPI-Specification).
- In July 2017, the **OpenAPI Initiative** released the 3.0 version of the specification.


### OpenAPI vs Swagger

OpenAPI documents are sometimes referred as **Swagger** documents but remember that OAS 3.x documents are the true standard for APIs documentation and the old Swagger 2.0 version is now deprecated.

## The OpenAPI Library

![OpenAPI Delphi Library](/openapi-delphi.png){class=center}

In order to generate **OAS 3.0** document WiRL uses the open source library [OpenAPI-Delphi](https://github.com/paolo-rossi/OpenAPI-Delphi).

With **OpenAPI-Delphi** you can  use the `TOpenAPIDocument` class to fill the document's properties and then you can serialize the object into an OAS 3 JSON document using [Neon](https://github.com/paolo-rossi/delphi-neon) JSON Schema Engine. 

With the OpenAPI library you can also deserialize an OAS 3.0 JSON document directly in a `TOpenAPIDocument` object.

Remember that the **OpenAPI-Delphi** library is independent from WiRL or REST related stuff, you can use it even in your stand-alone Delphi application.


## WiRL & OpenAPI

So, now that you have your new, shiny **REST API service**, what do you have to do in order to generate the OpenAPI documentation in WiRL? Here are the foundamental steps:

::: warning Steps

1. Configure/modify the OpenAPI resource
1. Create the `TOpenAPIDocument` object with custom information
1. Enable the "Generate XML Documentation" in Delphi Project Options \*
1. Configure the "XML documentation output directory" in Delphi Project Options \*
1. Deploy the XMLDoc folder on the server \*
1. Configure and deploy the html assets for the browsing UI \**


\* *Only if you want to use XMLDoc as source of your OpenAPI documentation*

\** *Only if you want to provide an HTML UI to browse your documentation*

:::

### The OpenAPI Resource

WiRL provides a ready-to-use resource mapped on the `/openapi` path (you can override it), you can find this resource in the `WiRL.Core.OpenAPI.Resource` unit.
You can override the standard resource for OpenAPI by inheriting from the `TOpenAPIResourceCustom` class and change, for example, the standard path for the resource:

```pascal
type
  [Path('documentation')]
  TDocumentationResource = class(TOpenAPIResourceCustom);
```

### The `TOpenAPIDocument`

The `TOpenAPIDocument` is a class that models an OpenAPI document (or set of documents) that defines or describes an API. The OpenAPI engine in WiRL creates and fill the properties with data taken from the source code or XMLDoc comments but there are certains things that you have (optionally) to provide for yourself, for example look at the following code that create and set some properties of the document:

```pascal
function TMainForm.ConfigureOpenAPIDocument: TOpenAPIDocument;
var
  LExtensionObject: TJSONObject;
begin
  Result := TOpenAPIDocument.Create(TOpenAPIVersion.v303);

  Result.Info.TermsOfService := 'https://api.example.com/terms/';
  Result.Info.Title := 'WiRL OpenAPI Integration Demo';
  Result.Info.Version := '1.0.2';
  Result.Info.Description := 'This is a **demo API** to test [WiRL](https://github.com/delphi-blocks/WiRL) OpenAPI documentation features';
  Result.Info.Contact.Name := 'Paolo Rossi';
  Result.Info.Contact.Email := 'paolo@mail.it';
  Result.Info.License.Name := 'Apache 2.0';
  Result.Info.License.Url :=  'http://www.apache.org/licenses/LICENSE-2.0.html';

  Result.AddServer('http://localhost:8080/rest/app', 'Testing Server');
  Result.AddServer('https://api.example.com/rest/app', 'Production Server');

  // Shows how to use Extensions (for ReDoc UI)
  LExtensionObject := TJSONObject.Create;
  LExtensionObject.AddPair('url', 'http://localhost:8080/rest/app/openapi/api-logo.png');
  LExtensionObject.AddPair('backgroundColor', '#FFFFFF');
  LExtensionObject.AddPair('altText', 'API Logo');
  Result.Info.Extensions.Add('x-logo', LExtensionObject);
end;
```

A small note on the `TOpenAPIDocument.AddServer` method:

Some OAS editor and UI have a "Try Out" feature where you can interact directly with the REST server in order to try the API calls live. Of course then you need to configure the server(s) on the OAS document like I did in the code above, you can also put more than one like, for example, a testing server and a production server.

### Using Delphi XMLDoc

WiRL can extract most information directly from the REST code (resource classes and annotations) but what if you want add some descriptive text, explanations, remarks? Well you can simply do it by commenting the REST methods, parameters, method result, and result http codes.

The way to do this is to use the XMLDoc wich is the standard comment style in Delphi for many years. You can use markdown style comments to improve the document appereance, link ein this code fragment:

```pascal
  /// <summary>
  ///   This **resource** serves to test the *OpenAPI 3* documentation generation
  /// </summary>
  [Path('/params')]
  TParametersResource = class(TObject)
```

You can also extend the standard XMLDoc tags (summary, param, returns, remarks) with some WiRL specific tags: response code, url, example.

```pascal
  /// <summary>
  ///   Method with a *sample* documentation
  /// </summary>
  /// <param name="APathParam" required="true">
  ///   The first parameter
  /// </param>
  /// <returns>
  ///   Result is a string representing the input parameter
  /// </returns>
  /// <remarks>
  ///   Here is a sample remarks placeholder.
  /// </remarks>
  /// <response code="200">Succesful response description</response>
  ///  <header name="X-Header" type="string">Description of the header</header>
  /// <response code="400">Bad request</response>
  /// <response code="404">[resource] not found in the database</response>
  [GET, Path('/test/{p}'), Produces(TMediaType.TEXT_PLAIN)]
  function ParamTest([PathParam('p')] APathParam: string): string;
```

### The Presentation UI (HTML)

After proper configuration for the OAS documentation generation, WiRL it's able to generate and output a JSON document representing the OAS 3.0 description of all endpoints, parameters, and entities that your API publishes.

A consumer of the API can take this JSON document and use it to generate it's own documentation about your API, although, perhaps you prefer to publish the documentation with a UI you can interact with.

If you want do do this you have to deploy some html, javascript, and css that can manage and present the data of the OAS JSON document.

WiRL provide you with a copy of a redistributable UI from Swagger ([**SwaggerUI**](https://github.com/swagger-api/swagger-ui)) that you can deploy on your server, look at the highlighted configuration line:

```pascal{3}
.Plugin.Configure<IWiRLConfigurationOpenAPI>
	...
	.SetGUIDocFolder('{AppPath}\..\..\UI')
.ApplyConfig
```

You can also add additional information like, for example setting a logo for your documentation page: `SetAPILogo('api-logo.png')`.

## The Final Configuration

Here is a final example of a simple OpenAPI configuration in WiRL:

```pascal
.Plugin.Configure<IWiRLConfigurationOpenAPI>
	// Set the OpenAPI resopource (in order to skip it in the documentation generation)
	.SetOpenAPIResource(TDocumentationResource)
	// Set the Delphi XML documentation output directory (Project -> Options -> Compiler)
	.SetXMLDocFolder('{AppPath}\..\..\Docs')
	// Set the folder where the html UI assets are
	.SetGUIDocFolder('{AppPath}\..\..\UI')
	// Set the (optional) API logo
	.SetAPILogo('api-logo.png')
	// Set the OpenAPI document for the OpenAPI engine to fill
	.SetAPIDocument(LDocument)
.ApplyConfig
```

## The OAS document in SwaggerUI

The following image is an example of an API documentation presented by the SwaggerUI interface

![OpenAPI Document](/openapi-ui.png){class=center}
