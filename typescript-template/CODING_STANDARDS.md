# General

## Function and class definition

### Use abstract classes for namespacing

Instead of top-level functions write them as static methods of an abstract class.

### Create top-level functions rarely

Only functions that are used all over the place should be top-level.

### Use the function keyword to define functions

Do use the function keyword for defining function.
Avoid assigning arrow functions to const variables.

### Use parameter objects for ambiguous types

When a function needs two arguments of the same type, put them into a parameter object.
e.g.

```typescript
// instead of
function getContact(firstname: string, surname: string) { ...
}

// do
function getContact(args: { firstname: string, surname: string }) { ...
}

```

Exceptions:
The function is commutative for the arguments
e.g.

```typescript
function add(a: number, b: number): number {
    return a + b
}
```

The functions semantics builds heavily on the order of the arguments
e.g.

```typescript
function concatinate(a: string, b: string): string {
    return a + b;
}
```

### Composition over inheritance

## Errors

### Do not throw

Use asserts if a condition must be true due to the internal logic.
Use the result type to return errors

## Wrap all external calls

Every call of a function that is not owned by this repository must be wrapped.
The wrapping must use a try catch block. Always return a result type.
This is the place to correct known type issues of external source too.
Create error extra classes.

e.g.:

```typescript
import {er, ok, Result} from "./result";

export class JSONParseError extends Error {
}

export abstract class JSONUtils {
    parse(str: string): Result<unknown, JSONParseError> {
        try {
            return ok(JSON.parse(str));
        } catch (e) {
            return er(new JSONParseError(`Par
            sing json failed.`, {cause: e}));
        }
    }
}
```

## Use try-catch blocks only around code that you don't own

Do not use try-catch blocks in any other situation than wrapping external function calls.

# Dom development (delete if project is not fiddeling with the dom)

## Prefer 'getElementBy...' over 'querySelector'