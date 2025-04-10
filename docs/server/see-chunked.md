# WIRL - Chunked Encoding and SSE

WiRL supports SSE ([Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)) and [chunked transfer encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding), which allows you to send a response divided into multiple blocks or chunks. This chapter explores both of these powerful features.

::: tip DEMO
You can find a demo showing how to use the SSE and Chunked Encoding in the `demo\23.Chunks` folder.
:::

## SSE - Server-Sent Events

SSE is a specification that allows the server to send events to the client, something normally not possible with standard HTTP. What happens is that the client connects to a specific endpoint on the server and keeps the connection permanently open. Even in case of disconnection (due to network problems or other issues), the client must take care of restoring it as soon as possible.

![Server-Sent Events Flow](/wirl-sse-1.gif)

### Implementation

From WiRL's perspective, a resource that implements these events needs to be built following a specific pattern since it's not just about sending a simple object to the client. Let's first look at how to declare the method that will implement the resource:

```pascal
[GET]
[Produces(TMediaType.TEXT_EVENT_STREAM)]
function ServerSideEvents([QueryParam('tag')] const ATag: string): TWiRLSSEResponse;
```

The first thing to note is the `Produces` attribute with the value `TEXT_EVENT_STREAM`, as the SSE protocol uses a specific *Content-Type*. The HTTP method in this case is GET; you can use any HTTP method you like, but if the client is written in JavaScript, the standard API only supports GET. Then follows the parameters, which can be of any type, and finally the response type which has to be `TWiRLSSEResponse`.

Now let's look at the implementation:

```pascal
function TMyResource.ServerSideEvents(const ATag: string): TWiRLSSEResponse;
begin
  Result := TWiRLSSEResponse.Create(
    procedure (AWriter: IWiRLSSEResponseWriter)
    var
      LMessage: string;
    begin
      // Continue while the server is "alive"
      while FServer.Active do
      begin
        // Read a message from the queue
        LMessage := MessageQueue.PopItem;
        if LMessage <> '' then
          // If found, send it to the client
          AWriter.Write(LMessage);
      end;
    end
  );
end;
```

As you can see the `TWiRLSSEResponse` class has a constructor with only one argument. That's an anonymous method that will provide the events. The anonymous method continues as long as the server is "alive" (the `FServer` object can be retrieved via WiRL's Context Injection). In this example, the messages are in the `MessageQueue` object (defined as a thread-safe queue: `TThreadedQueue<string>`). The program attempts to extract a message from the queue and, if found, sends it to the client through the object referenced by the `IWiRLSSEResponseWriter` interface. Let's see the methods of this interface:

```pascal
procedure Write(const AValue: string);
```

This is the basic method for sending an event to the client. Note that the content of an event can only be a string. To send more complex objects, it's necessary to use some encoding, such as [Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64) for binary data.

```pascal
procedure Write(const AEvent, AValue: string);
```

This method is similar to the previous one but has the additional `event` parameter that allows "categorizing" the message. In fact, the JavaScript API allows the client to receive only messages belonging to a certain category.

```pascal
procedure Write(const AEvent, AValue: string; ARetry: Integer);
```

This version of `Write` has the additional `ARetry` parameter that tells the client how long to wait before opening a new connection once the current one is closed. Indeed, apart from network errors, the server could close the connection at any time.

```pascal
procedure WriteComment(const AValue: string);
```

This method sends a comment, which the client should generally ignore. Its main purpose is to keep the connection alive, as clients or proxies might close idle connections.

### The Client

Currently, WiRL doesn't offer a built-in way to read incoming events via SSE, although it is of course possible to use Indy components (`TIdHTTP`) or the new `THttpClient`.

If the client is a browser, you can use the `EventSource` object:

```javascript
const evtSource = new EventSource("/rest/app/myevent");

evtSource.onmessage = (event) => {
  console.log(event.data);
};
```

## Chunked Transfer Encoding

Another similar feature is support for chunked transfer encoding. This function allows sending data from server to client in blocks. This can be useful in several cases:

1. When the total size of the content is not known in advance, for example during dynamic generation of web pages or content.
2. For real-time data streaming, allowing the client to start processing data before it has been completely received.
3. To improve perceived response times, as the browser can start rendering parts of the page while others are still downloading.
4. In cases of large file transfers, where sending content in chunks may be more efficient than transmitting a single large block.

![Chunked Transfer Encoding Flow](/wirl-chunks-1.gif)

### Implementation

Implementing a resource that uses chunked transfer encoding is not too different from the SSE case. In both cases, the resource produces a result gradually over time. Let's first look at the method interface that implements the resource:

```pascal
[GET]
[Produces(TMediaType.TEXT_PLAIN)]
function Chunks([QueryParam('chunks'), DefaultValue('5')] ANumOfChunks: Integer): TWiRLChunkedResponse;
```

In this case, the HTTP method is GET but it can be any method; the *Content-Type*, which the `Produces` attribute refers to, can also be any type, and it refers to the entire output of the resource, not the individual chunk. The parameters can clearly be of any type, while what distinguishes a chunked resource is the return type, which must be `TWiRLChunkedResponse`.

The implementation, as in the previous case, will have to provide the `TWiRLChunkedResponse` constructor with an anonymous procedure that will send individual chunks to the client:

```pascal
function TMyResource.Chunks(ANumOfChunks: Integer): TWiRLChunkedResponse;
begin
  Result := TWiRLChunkedResponse.Create(
    procedure (AWriter: IWiRLResponseWriter)
    var
      LCounter: Integer;
    begin
      // Send data in ANumOfChunks chunks
      for LCounter := 1 to ANumOfChunks do
      begin
        // Send a single chunk
        AWriter.Write(IntToStr(LCounter));
        // Simulate the wait required to get the next data
        Sleep(1000);
      end;
    end
  );
end;
```

In this example, the response is sent divided into different chunks determined by the client. Each chunk contains binary data. However, the object referenced by the `IWiRLResponseWriter` interface has several methods:

```pascal
procedure Write(const AValue: string; AEncoding: TEncoding = nil);
```

Allows sending a string by transforming it to binary with the specified encoding. In the absence of encoding, UTF-8 is used.

```pascal
procedure Write(const AValue: TBytes);
```

This method allows sending binary data directly using `TBytes`.

### Client

At the moment, `TWiRLClient` doesn't provide any special mechanism for reading data divided into chunks. The component will return the entire response once all chunks have been received. However, both the `TIdHTTP` component and `THttpClient` can handle incoming chunks in real-time via events. For example, you can use the `TIdHTTP` component in this way:

```pascal
procedure TForm1.ButtonIdHTTP1Click(Sender: TObject);
begin
  // Hook the OnChunkReceived event
  IdHTTP1.OnChunkReceived := IdHTTP1ChunkReceived;
  // Make the call
  IdHTTP1.Get('http://localhost:8080/rest/app/chunk');
end;

procedure TForm1.IdHTTP1ChunkReceived(Sender: TObject;
  var Chunk: TIdBytes);
var
  LText: string;
begin
  // Convert the chunk to string
  LText := IndyTextEncoding_UTF8.GetString(Chunk);
  // and add it to a memo
  MemoLog.Lines.Text := MemoLog.Lines.Text + LText;
end;
```

## Conclusion

In this chapter, we've provided an overview of using chunks and SSE with the latest version of WiRL. By downloading the source code from GitHub, you can test Demo *23.Chunks* which provides various examples of use. The current client support is somewhat limited, but future releases will offer improved features in the `TWiRLClient` component.