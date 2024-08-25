---
title: RPC with NanoPack
---

NanoPack has built-in support for performing RPC. This is an overview of how to define an RPC service in NanoPack.

:::caution
NanoPack RPC is still a work-in-progress, and is currently only implemented in Swift and TypeScript.
C++ support will follow very soon.
:::

## Defining a Service

Let's define a service that performs basic arithmetic. First, create a schema file called `MathService.np.yml`, then add the following:

```yaml
# MathService.np.yml
service Math:
```

This declares a new service called `Math`. Inside this block is where you declare remote functions that can be called through the `Math` service. Let's define an `add` function that takes in two 32-bit integers and returns a 32-bit integer:

```diff lang="yaml"
# MathService.np.yml
service Math:
+  # adds a and b together
+  fn add(a int32, b int32): int32
```

Now, we can do the same for subtraction:


```diff lang="yaml"
# MathService.np.yml
service Math:
  # adds a and b together
  fn add(a int32, b int32): int32
 
+  # subtracts b from a (a - b)
+  fn subtract(a int32, b int32): int32
```

Pretty straightforward, right? To run codegen on this schema, run `nanoc` like how you would for regular message schemas:

```shell
nanoc --language=swift MathService.np.yml
```

This will create a `MathService.np.swift`, which will contain two classes:

- `MathSerivceServer` acts as an RPC server, handling and responding to incoming RPC requests.
- `MathServiceClient` acts as an RPC client, providing callable functions that you defined in the schema that makes RPC requests to the server behind the scene.

## Parameter and Return Types

You can use any valid NanoPack type as parameter type as well as return type, including messages that you define, as long as their schemas are processed together.

### Void Functions

To declare a function that returns nothing, omit the return type:

```yaml
fn myVoidFunction(param string, param2 MyMessage):
```

:::note
Don't forget the colon at the end!
:::
