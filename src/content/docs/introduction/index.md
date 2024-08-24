---
title: What is NanoPack?
description: A gentle introduction to NanoPack
---

NanoPack is a binary serialization format initially created for [Poly](https://polygui.org), but I have decided to extract it out into an independent project. Because NanoPack is used as a communication layer in Poly, it needs to be easy to pack and parse in order to reduce communication latency.

NanoPack is currently being implemented in C++, TypeScript, and Swift.

## NanoPack is designed to be easy to use

Many popular binary serialization formats, such as Protobuf, have needlessly complex schema syntax. NanoPack schema was designed from first principal, including features only strictly needed by Poly. As a result, message schemas in NanoPack is drastically cleaner. Here is an example:

```yaml
Person:
  firstName: string
  middleName: string?
  lastName: string
  age: uint8
  friends: Person[]
```

## NanoPack is pretty fast

NanoPack is explicitly optimized for read/write speed, so if you are looking for a compact binary format, please look elsewhere. I will publish a comprehensive benchmark when NanoPack is ready for production use, but in my own testing, NanoPack is consistenly faster than Protobuf. In theory, NanoPack can also support zero-copy mechanism, making it even faster.

## NanoPack Supports Polymorphism

It stems from the need for Poly to represent Widget of different types in a message. Surprisingly, most popular serialization formats do not support this, which further motivated the creation of NanoPack.

