---
title: Defining an Enum
description: A guide in how to define a NanoPack enum
---


NanoPack supports enumerations which can be used as types when defining messages.
Each member in the enum represents a value which can either be a number type or a string.

## Schema Syntax

There are two ways to define an enum.

### Implicit Value

```yaml
enum MyEnum:
  - MEMBER_1
  - MEMBER_2
  - MEMBER_3
```

The first member in the enum will have a value of `0`, then for each succeeding member, the value increments by one.

### Explicit Value

Each enum member can also store an explicitly-defined value.

```yaml
enum MyEnum:
  MEMBER_1: 1
  MEMBER_2: 2
  MEMBER_3: 3
```

The compiler will guess the type of the value based on what is specified.
If all the values are numbers, then the compiler will use the smallest possible number type that can store all the values.
Otherwise, the compiler will simply use string to store the values. In the example above, the compiler will use an `int8` as the backing value type of the enum.

To tell the compiler to use another type, add `::<TypeToUse>` after the enum name:

```yaml
enum MyEnum::string:
  MEMBER_1: 1
  MEMBER_2: 2
  MEMBER_3: 3
```

Since string is explicitly specified, the compiler will use `string` rather than `int8` as the backing value type for `MyEnum.

Only `int8`, `int32`, `int64`, `double` and `string` can be used as the value type.

## Using Enums in Messages

Enums can be used just like other built-in data types in NanoPack. It can be a field type or an array type.

Consider the following enum called `Alignment`:

```yaml
# Alignment.yml
enum Alignment:
  START: start
  END: end
  CENTER: center
  TOP: top
  BOTTOM: bottom
```

Since each member maps to a string value, the compiler knows to use string as the backing value type. `Alignment` can then be used in a message:

```yaml
# Column.yml
Column:
  alignment: Alignment
  # ... other fields
```

:::note
No import statement is required to import `Alignment`!
:::

Only members specified in `Alignment` can be stored in the `alignment` field, and the generated code will enforce this rule.

