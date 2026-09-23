---
trigger: glob
globs: '**'
description: 'Functional programming, immutability, early exits, function design, dependency injection, and type safety. Apply to all TypeScript and Svelte code.'
applyTo: '**'
---

# Code Principles

Shared with trakt-web. Applies to every project in the repo.

## Functional Programming

- **Prefer pure functions.** Same input, same output, no side effects.
- **Push side effects to the edges.** API calls, storage, and DOM work live in
  outer layers (components, route loads, request helpers). Data transformation
  stays pure and testable.
- In Svelte, use `$derived()` for computed values instead of extra state.

## Immutability

- Prefer `const` over `let`. Avoid reassigning variables.
- Use `map`, `filter`, `reduce`, `flatMap` instead of loops that push into a
  mutable array.
- Type read-only data as `Readonly<T>`, `ReadonlyArray<T>`, `ReadonlyMap`,
  `ReadonlySet`.

**Bad:**

```typescript
const result = [];
for (const item of items) {
  result.push(transform(item));
}
```

**Good:**

```typescript
const result = items.map(transform);
```

## Early Exits

Check error and edge conditions first and return early. No nested `if`
statements - a nested conditional means the function should be split or
flattened with guard clauses.

**Bad:**

```typescript
function processData(data: Data | null) {
  if (data) {
    if (data.isValid) {
      return transform(data);
    }
  }
  return null;
}
```

**Good:**

```typescript
function processData(data: Data | null) {
  if (!data) return null;
  if (!data.isValid) return null;

  return transform(data);
}
```

## Function Design

- **Single responsibility.** One function, one job, a name that says what it
  does. No "god functions".
- **3+ parameters -> one object parameter.** `fetchData({ url, token, retry })`,
  not `fetchData(url, token, retry)`.
- **No abstraction leaks.** A helper hides its implementation; callers never
  depend on how it works inside.
- **Simple over clever.** If a solution feels complex, step back. Readability
  wins.

## Dependency Injection

Pass collaborators in as parameters instead of creating them inside the
function, so it can be tested without module mocks.

**Bad:**

```typescript
export function fetchUser(id: string) {
  const api = new ApiClient();
  return api.get(`/users/${id}`);
}
```

**Good:**

```typescript
type FetchUserParams = {
  api: ApiClient;
  id: string;
};

export function fetchUser({ api, id }: FetchUserParams) {
  return api.get(`/users/${id}`);
}
```

## Type Safety

- Strict mode everywhere. No `any`; use a specific type, `unknown` plus
  narrowing, or a utility type.
- **Never use the non-null assertion (`!`).** Handle `null` / `undefined` with a
  guard clause, optional chaining, or `??`.
- **Prefer `.at()` for positional access.** `items.at(0)` is typed
  `T | undefined`, so the missing case has to be handled.
- **Validate external data with Zod at the boundary.** Define the schema, derive
  the type with `z.infer`, use `.nullish()` for optional nullable fields. Never
  cast a `response.json()` result with `as`.
