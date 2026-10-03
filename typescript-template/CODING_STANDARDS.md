# Coding standards

Every rule in this document is mandatory within its stated scope. The exceptions
described below are part of the rules.

## Use existing tools when their semantics match

Check the available tools and utilities before implementing an operation. Use an
existing tool or utility when its intended purpose and behavior match the task,
instead of rewriting the same operation. Check its input assumptions, output
meaning, error behavior, and side effects before choosing it.

Do not reuse a tool whose intended semantics differ from the task merely because
its implementation looks similar or produces the desired output for some inputs.
Code duplication is allowed. Similar code serving different purposes does not
have to share a utility, and this rule does not require extracting new utilities
to eliminate duplication.

## Function and class definitions

### Use abstract classes for namespacing

Group stateless utilities as static methods of abstract classes so callers can
discover related operations through one name. Classes representing objects with
state or identity may have instance methods.

Top-level functions are limited to shared primitives used across unrelated parts
of the project, such as `ok` and `er`. A utility does not qualify merely because
it has several callers.

### Use the function keyword for standalone functions

Define standalone functions with the `function` keyword. Do not assign arrow
functions to variables to define standalone functions. Use method syntax for
class methods. Inline arrow callbacks are allowed.

### Use parameter objects for ambiguous arguments

When two or more arguments have the same type, put them into a parameter object.
This rule covers functions, methods, and constructors.

```typescript
export abstract class Articles {
    static search(args: { title: string; description: string }) {
        // Look up the article by it's tile or description.
    }
}
```

Positional arguments are allowed for commutative operations, such as addition,
and familiar operations whose argument order defines their meaning, such as
subtraction. An established external API signature is also an exception. Merely
naming two arguments does not establish a semantic ordering.

```typescript
export abstract class Arithmetic {
    static add(a: number, b: number): number {
        return a + b;
    }

    static subtract(minuend: number, subtrahend: number): number {
        return minuend - subtrahend;
    }
}
```

### Use composition over inheritance

Do not use inheritance. Do composition of objects or calling other utilities.

Exception: Extending `Error` to represent an error category is allowed.
Exception: Extending `EventEmitter` is allowed.

### Use const objects instead of enums

Do not use TypeScript `enum` or `const enum` declarations. Define named values
with a const object using `as const`, and derive the union of its values with
`typeof E[keyof typeof E]`. The object and its type must share the same name.
The `as const` assertion in this pattern does not require a separate invariant
comment.

```typescript
export const E = {a: 5} as const;
export type E = (typeof E)[keyof typeof E];
```

### Use quantity types for physical measurements

Do not store or pass lengths, angles, time spans, or other physical measurements
as plain numbers in application code. Use quantity types that carry the kind of
measurement and its unit, such as those provided by
[unitsnet-js](https://www.npmjs.com/package/unitsnet-js), or an equivalent
library. A name such as `lengthMeters` does not replace a quantity type.

Validate incoming measurements and convert them to quantity types at entry
points. Convert to a number in an explicit unit only when an external API or
output format requires it. Persist or serialize measurements with their units
explicitly recorded in the data or schema, and restore quantity types when
reading them. Use the quantity library's conversion and arithmetic operations to
keep units consistent.

## Errors

### Return expected failures through Result

Use `Result<T, E>` for expected failures that callers can handle. Callers must
inspect or propagate an error result. Do not silently discard a `Result`.

Use assertions only for conditions guaranteed by repository logic, not for
invalid user input or external data. Call `unwrap` only when an error would
demonstrate a broken internal invariant. Throwing is only allowed using `unwrap`
or an assertion.

Do not catch assertion failures or failed invariant unwraps to turn them into
ordinary error results. Fix the violated invariant.

### Wrap fallible external operations

Wrap third-party integrations and fallible platform operations behind
repository-owned methods. Wrappers must catch external exceptions and return
`Result<T, E>`. Asynchronous wrappers must await the operation inside the catch
scope and return `Promise<Result<T, E>>`.

Ordinary language utilities, such as `Array.map`, `String.slice`, and
`Number.isFinite`, do not require wrappers. Repository methods that already
return a `Result` do not require an additional catch.

Represent external failure categories with error classes. Preserve the original
exception as the cause and include context that helps callers identify the
failed operation. Correct known external type issues through validation or a
documented invariant.

```typescript
import {er, ok} from './result';
import type {Result} from './result';

export class JSONParseError extends Error {
}

export abstract class JSONUtils {
    static parse(str: string): Result<unknown, JSONParseError> {
        try {
            return ok(JSON.parse(str));
        } catch (cause: unknown) {
            return er(new JSONParseError('Parsing JSON failed.', {cause}));
        }
    }
}
```

## External data validation

Validate untrusted data at entry points, including API responses, request
bodies, storage contents, configuration, and parsed JSON. Treat these values as
`unknown` until runtime validation succeeds. Use Zod or an equivalent runtime
validator to check the structure and constraints the application relies on.
Parsing JSON alone does not validate its contents. Type annotations and type
assertions do not count as validation. Return validation failures through
`Result` and pass validated values to internal code.

## Promise handling

Every promise must be awaited, returned to a caller responsible for handling it,
or explicitly started with a rejection handler. Background work must have an
explicit failure handler. Using `void` alone does not handle a rejected promise.
Handle asynchronous error results as well as promise rejections.

## DOM development

Remove this section in projects that do not work with the DOM.

Use a `getElementBy...` method when it directly expresses the lookup. Use
`querySelector` or `querySelectorAll` when the lookup requires a CSS selector.
Handle missing elements explicitly and account for whether the chosen method
returns a single element, a static collection, or a live collection.
