# WiRL: Project Structure

![Delphi RESTful Library](/logo.png){class=center-25}

## Project's Structure

```
[WiRL Project]
├─ Demos
│  ├─ 01.HelloWorld
│  ├─ 02.ContentTypes
│  ├─ 03.Authorization
│  ├─ 04.WebServer
│  ├─ 05.SimpleVCLClient
│  ├─ 06.FireDAC
│  ├─ 07.MessageBody
│  ├─ 08.Template
│  ├─ 09.ExtJS
│  ├─ 10.Filters
│  ├─ 11.Validators
│  ├─ 12.Context
│  ├─ 13.Serialization
│  ├─ 14.BasicHttpServer
│  ├─ 15.WindowsService
│  ├─ 16.Redirection
│  ├─ 17.Parameters
│  ├─ 18.OpenAPI
│  ├─ 19.CustomConfig
│  ├─ 20.Exceptions
│  ├─ 21.GarbageCollector
│  ├─ 22.WebStencilsDemo
│  └─ 23.Chunks
├─ Libs
│  ├─ JWT
│  ├─ Neon
│  └─ OpenAPI
├─ media
├─ Packages
│  ├─ 10.0Seattle
│  ├─ 10.1Berlin
│  ├─ 10.2Tokyo
│  ├─ 10.3Rio
│  ├─ 10.4Sydney
│  ├─ 11.0Alexandria
│  └─ 12.0Athens
├─ Source
│  ├─ Client
│  ├─ Core
│  ├─ Data
│  │  ├─ FireDAC
│  │  └─ UniDAC
│  ├─ Extensions
│  └─ IDE Wizard
├─ Tests
└─ www
```

Before even playing with the source code of the project, it's important to familiarize with the project structure.

## The `Source` folder

The most important folder is of course the `Source` folder that contains the source code of the WiRL Library. The code is divided in 4 main folders

- `Core`: containts the core (http, engine, mbrw, filters, interfaces, configuration) code needed to build a server REST with WiRL
- `Data`: it's a utility package that contains code related to Data package of Delphi, mostrly contains MessageBody Reader/Writer for DataSources
- `Client`: contains the code related to the client part of WiRL, you can ignore this folder if you are only interested in building REST servers
- `Extensions`: contains code not included in the WiRL packages that extend WiRL functionalities, for example you can find the Console Management (Windows, Linux), the GraphQL engine, etc...

## The `Libs` folder

The `Libs` folder contains the dependencies of the WiRL source code, the sub-modules are (for now):

- `JWT`: [Delphi JOSE and JWT Library](https://github.com/paolo-rossi/delphi-jose-jwt) for the JSON Web Token creation and validation
- `Neon`: [Neon - Serialization Library for Delphi](https://github.com/paolo-rossi/delphi-neon) to convert Delphi simple types, objects, records, arrays, etc... to the JSON format
- `OpenAPI`: [OpenAPI 3 for Delphi](https://github.com/paolo-rossi/OpenAPI-Delphi) for the OpenAPI documentation generation


## The `Packages` folder

In the packages folder, as the name suggest, you can find the Delphi Packages files that yuo'll need to compile  WiRL and, optionally, install it on the IDE. The Delphi versions officially supported are:

- `10.0 Seattle`
- `10.1 Berlin`
- `10.2 Tokyo`
- `10.3 Rio`
- `10.4 Sydney`
- `11.x Alexandria`
- `12.x Athens`

## The `Demos` folder

The `Demos` folder contains several demos (23 for now) regarding WiRL, plus a bunch of batch files needed to compile all demos at once (for test after a commit) and a file JSON containing a Postman collection.

### The file `WiRL.Postman.Collection.json`

The file `WiRL.Postman.Collection.json` contains a collection of requests that you can import in [Postman](https://www.postman.com/). After importing this collection you will find in Postman a new collection listing all the requests for some of the WiRL Demos:

![Postman WiRL Collection](/postman-collection.png){class=center}

With this collection you can test right away the WiRL code of the Demos!

## The `Tests` folder

This folder contains the UnitX test of the WiRL project, you can find the tests in the `Framework` folder and the mock code in the `Mock` folder.

## The `media` and `www` folders

These folders contains respectively the Delphi icons for the WiRL component palette and some html/css assets for an admin panel of WiRL.
