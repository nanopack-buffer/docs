---
title: The NanoPack Buffer
description: A document on the NanoPack binary format.
---

There are three primary components in a NanoPack buffer:
**type ID**, the **size header**, and the **data section**.

Below is a visualization of a NanoPack buffer:

![Visualization of a NanoPack buffer](../../../assets/nanopack-format-vis.svg)

## Endian-ness

NanoPack uses little-endian format. There is no particular reason why it is used.

## Type ID

The first 4 bytes of every NanoPack binary stores the **type ID** of a message.
This ID is simply a number specified in the message schema that is used to identify the type of the message.
Without the type ID, it is impossible to determine how to correctly decode the binary into the correct message type,
since many different types of messages can be exchanged on the wire.
This type ID is computed automatically by [the compiler](/nanopack/code-generation/)
by hashing the message name into a 32-bit unsigned integer.
It can also be specified explicitly in the [NanoPack schema](/nanopack/defining-message/),
although it is not recommended as it is hard to keep track of the list of existing type IDs
as the number of messages grow.

Type IDs of messages have to be unique within the system in which the message will be exchanged.
In Poly's case, all the messages exchanged through the message channel have unique type IDs.
This is to ensure that the raw binary can be interpreted and de-serialized correctly.
That means, future messages that will be exchanged through the channel cannot reuse type IDs of existing messages,
unless the type IDs of existing messages are changed. However, two separate instances of Poly applications will not
cause any type ID conflict, because they are run in separate processes, and the messages exchanged are confined within
their own instance.

## Size Header

After the type ID follows the size header, which stores the byte size of each field.
4 bytes are used to encode the data size of each field, so the total size of the size header is `4n` bytes,
where `n` is the number of fields the message contains.

The order of the size information is determined by the order in which the fields are declared in the schema.
Fields that are declared first in the schema file will appear first in the buffer.

Fields that contain fixed-size numbers have static sizes.
For example, a field that stores a 32-bit integer always use 4 bytes, so its size header will always be the number 4:

```
0x4 0x0 0x0 0x0
```

On the other hand, fields that store, for example, strings, will have dynamic size, and their size headers will contain
the number of bytes used by the string.

### Partial Deserialization

Size header allows NanoPack to *partially de-serialize* a message.
That is, NanoPack is able to de-serialize one particular field, without having to de-serialize all the previous fields.
For example, to read the content of field 3, the offset can be calculated by adding the size of the type ID (4 bytes),
size header (12 bytes), and the sizes of the preceding fields,
which can be obtained by reading their corresponding size headers:

```
offset for field 3 = 4 + (4 * 3) + <size of field 0> + <size of field 1> + <size of field 2>
```

:::note
This is not currently implemented. However, if partial serialization proves to provide better runtime performance, it
will be implemented.
:::

## Data Section

The data section follows immediately after the size header. This is where the actual raw data of all the fields go.
How different data types are encoded in NanoPack is described [here](./data-types).

## NanoPack Limits

- Since type ID is encoded with 4 bytes, there can be 4,294,967,296 unique message types within a system.
- Size information of each field is encoded with 4 bytes as well, so each field can store up to 4,294,967,296 bytes, which is roughly 4.295 gigabytes.
- Each message can contain unlimited fields.

