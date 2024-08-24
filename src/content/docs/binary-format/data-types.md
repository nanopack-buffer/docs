---
title: Binary Format of Data Types
description: This document describes how different data types are serialized in NanoPack.
---

This page describes how different data types are serialized in NanoPack.

:::note
This page breaks down bytes into multiple lines for easier reading,
but they still represent a piece of contagious memory.
:::

### Number types

All numbers in NanoPack are serialized in little-endian format.

### String

In NanoPack, strings are in UTF-8 format.
If the string is serialized as a field value, its byte length will be stored in the size header.
Otherwise, the byte length will be prepended immediately as an `uint32` before the bytes of the string.
For example, the word "hello" will be serialized as:

```
5 0 0 0 68 65 6c 6c 6f
```

`5 0 0 0` indicates that the string that immediately follows will have 5 bytes. `68 65 6c 6c 6f` is the word "hello" in
bytes.

### Array

Arrays in NanoPack are simply the serialized bytes of their items put contagiously.

In any of the following cases, the number of elements in the array will need to be added (as an `uint32`) before the
array data:

- The array is serialized as a field value and the items are dynamically-sized.
- The array is in a container, such as a map.

For example, the following array:

```json
[
  "hello",
  "my",
  "name",
  "is",
  "john"
]
```

will be serialized as

```
5 0 0 0                 # indicates that there are 5 elements in the array 
5 0 0 0 68 65 6c 6c 6f  # "hello" with prepended byte length
2 0 0 0 6d 79           # "my" with prepended byte length
4 0 0 0 6e 61 6d 65     # "name" with prepended byte length
2 0 0 0 69 74           # "is" with prepended byte length
4 0 0 0 6a 6f 68 6e     # "john" with prepended byte length

Total number of bytes: 41
```

When the array is serialized as a field value, and it contains items that have a static size,
i.e. `int8`, `int32`, `int64`, `double`, and `bool`, the number of elements in the array can be computed by simply
dividing the total byte size of the field, obtained from the size header, by the static size of the data type, so the
number is not encoded.

### Map

Maps in NanoPack are serialized similarly to arrays. Key-value pairs are serialized contagiously. The bytes of a key is
put first, and then the bytes of a value is immediately put after, then the bytes of the next key follows, then that of
the next value, so on and so forth. Whether the number of entries will be prepended is determined the same way as
arrays:

- The map is serialized as a field value and the items are dynamically-sized.
- The map is in a container, such as an array.

For example, the following map:

```json
{
  "id": 10
}
```

will be serialized as:

```
1 0 0 0        # indicates that there is 1 element in the map
2 0 0 0 69 64  # "id" with prepended byte length
10 0 0 0       # the number 10
```

### Optional

If the optional value is stored in a field and the value is absent, `-1` will be written in the size header for the
field size. Otherwise, the value will be serialized normally as if it is a non-optional type.

If the optional value is not in a field, a boolean byte will be added before the bytes of the value. `0` indicates that
the value is absent, `1` indicates that the value will immediately follow.

For example, the following array of optional strings:

```json
[
  "hello",
  null,
  "world"
]
```

will be serialized as:

```
3 0 0 0                   # indicates that there are 3 elements in the array
1 5 0 0 0 68 65 6c 6c 6f  # 1 indicates that the string exists, and then the serialized "hello" follows
0                         # 0 indicates that the string is absent
1 5 0 0 0 77 6f 72 6c 64  # 1 indicates that the string exists, and then the serialized "world" follows
```

