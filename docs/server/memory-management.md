# Memory Management in WiRL

In most scenarios, **WiRL handles memory management automatically**, freeing developers from the burden of manual object cleanup. However, there are specific cases where understanding and intervening in the memory management process becomes crucial. This guide will explore these particular situations, helping you prevent memory leaks and avoid the unintended destruction of objects that need to persist.

::: tip DEMO
You can find a demo demonstrating how to use the WiRL memory manager in the `demo\21.GarbageCollector` folder.
:::

## Basic Concept

When writing REST resources with WiRL, you typically create methods that return objects. For example:

```pascal
[Path('order')]
TOrderResource = class
public
  [POST]
  [Consumes(TMediaType.APPLICATION_JSON)]
  [Produces(TMediaType.APPLICATION_JSON)]
  function PostOrder([BodyParam] AOrderProposal: TOrderProposal): TOrder;
end;
```

In this case, WiRL takes care of destroying the `TOrder` object when it's no longer needed (i.e., after composing the response). However, there are some scenarios that require special attention.

## Handling Exceptions

Consider this implementation:

```pascal
function TOrderResource.PostOrder(AOrderProposal: TOrderProposal): TOrder;
begin
  Result := TOrder.Create;
  Result.OrderId := AOrderProposal.OrderId;
  // Etc.
end;
```

If an exception occurs after creating `TOrder`, a memory leak will occur. To prevent this, you can use the following pattern:

```pascal
function TOrderResource.PostOrder(AOrderProposal: TOrderProposal): TOrder;
begin
  Result := TOrder.Create;
  try
    Result.OrderId := AOrderProposal.OrderId;
    // Etc.
  except
    Result.Free;
    raise;
  end;  
end;
```

This ensures that the object is released in case of an exception; otherwise, WiRL will handle its destruction.

## Using WiRL's Garbage Collector

An alternative approach is to use WiRL's built-in garbage collector (`TWiRLGarbageCollector`). You can obtain an instance through [context injection](context-injection):

```pascal
[Path('order')]
TOrderResource = class
private
  [Context] 
  GC: TWiRLGarbageCollector;
public
  [POST]
  [Consumes(TMediaType.APPLICATION_JSON)]
  [Produces(TMediaType.APPLICATION_JSON)]
  function PostOrder([BodyParam] AOrderProposal: TOrderProposal): TOrder;
end;
```

Now you can rewrite your method as follows:

```pascal
function TOrderResource.PostOrder(AOrderProposal: TOrderProposal): TOrder;
begin
  Result := TOrder.Create;
  GC.AddGarbage(Result);
  Result.OrderId := AOrderProposal.OrderId;
  // Etc.
end;
```

This way, the `TOrder` instance is immediately passed to the garbage collector. WiRL will handle its destruction, even if problems occur later.

## Managing Long-Lived Objects

The garbage collector is also useful for objects that need to live longer than the resource method. Consider this example:

```pascal
function CustomerList: TDataSet;
var
  LConnection: TMyConnection;
begin
  LConnection := TMyConnection.Create;
  // Configure connection
  Result := TMyDataSet.Create(nil);
  Result.Connection := LConnection;
  Result.Open;
end;
```

Here, `TMyConnection` isn't destroyed because WiRL needs it to serialize the dataset after the method ends. However, WiRL doesn't know about the `TMyConnection` object and this will cause a memory leak. The garbage collector solves this:

```pascal
function CustomerList: TDataSet;
var
  LConnection: TMyConnection;
begin
  LConnection := TMyConnection.Create;
  GC.AddGarbage(LConnection);
  Result := TMyDataSet.Create(nil);
  GC.AddGarbage(Result);
  Result.Connection := LConnection;
  Result.Open;
end;
```

## Handling Singletons and Global Objects

Sometimes your resource needs to return an object that shouldn't be destroyed, like a singleton or a global object. In this case, decorate the method or class with the `Singleton` attribute:

```pascal
[Path('order')]
TOrderResource = class
public
  [GET]
  [Produces(TMediaType.APPLICATION_JSON)]
  [Singleton]
  function GetOrder([QueryParam('id') AId: Integer]): TOrder;
end;
```

This prevents WiRL from destroying the returned object.

## Conclusion

Proper memory management in WiRL involves understanding when and how objects are created and destroyed. By using try-except blocks, leveraging the garbage collector, and applying the `Singleton` attribute where necessary, you can ensure your WiRL applications manage memory efficiently and avoid leaks.