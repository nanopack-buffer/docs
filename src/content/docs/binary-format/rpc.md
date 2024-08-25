---
title: NanoPack RPC Format
description: This document describes the NanoPack RPC format in details
---

The binary format of NanoPack RPC (NRPC) is heavily inspired by [MessagePack's implementation of RPC](https://github.com/msgpack-rpc/msgpack-rpc/blob/master/spec.md).

## NPRC Request

An NRPC Request is sent whenever a remote function is called through an RPC client. The request is constructed on the client's side and then sent over to the designated RPC server through the transport specified by the user, be it WebSocket, HTTP, or even stdio.

An NRPC request consists of the following four parts, in order of their appearance in the buffer:

1. **Message type** (uint8): always the constant `1` to represent an NRPC request
2. **Message ID** (uint32): a unique ID that identifies this message.
3. **Function name** (string): a length-prefixed UTF8 string that stores the name of the function that should be called. ([More about string here](http://localhost:4321/binary-format/data-types/))
4. **Serialized arguments**: all of the arguments passed to the function serialized according to NanoPack's specficiation, one after another.

As an example, let's consider the following function:

```yaml
service Math:
  fn add(a int32, b int32): int32
```

and a call to the function like so:

```
add(15, 12)
```

The request will look like this in bytes, assuming the message ID is 10:

```
1                  message type
10 0 0 0           message id (10)
3 0 0 0 61 64 64   the string "add" with length prefix 3
15 0 0 0           first arugment (15)
12 0 0 0           second argument (12)
```

for readibility, the bytes are broken down line by line, but in practice they are all in one buffer.

## NRPC Response

An NRPC Response is sent in response to an NRPC request. The response is constructed on the server's side and then sent to the designated RPC client through the transport specified by the user.

An NRPC response consists of the following four parts, in order of their appearance in the buffer:

1. **Message type** (uint8): always the constant `2` to represent an NRPC response
2. **Message ID** (uint32): the message ID of the request this response is for
3. **Error flag** (uint8): `0` if the RPC request is successful; `1` if an error has occurred
4. **Serialized return value**: omitted if void function was called; the return value if the call is successful; optional error value returned by the server if error flag is `1`.

Here is an example of what the response to the `add` RPC above looks like:

```
2          message type
10 0 0 0   message id of the request (10)
0          no error
27 0 0 0   result of the addition (15 + 12 = 27)
```

