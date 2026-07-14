# trakt-api agent rules

Conventions for authoring the ts-rest + zod API contract. The OpenAPI spec and
consumer models/clients are generated from these schemas, so schema shape is a
public artifact, not just internal typing.

## Response schemas

### Polymorphic / multi-shape responses: one flat object, all fields nullish

When an endpoint returns entries of more than one entity shape - a merged feed
(e.g. calendar `media` / `releases/hot` returning movies AND episodes), or any
route whose response varies by a `type=movie|show|episode|...` param - model the
response as a SINGLE object with **every shape-specific field nullish**. Do NOT
use `z.union([...])`.

```ts
// ❌ BAD: union -> OpenAPI `oneOf` -> codegen emits a model with ALL fields
//         required, so consumers get a wrong schema.
export const feedResponseSchema = z.union([movieEntrySchema, showEntrySchema]);

// ✅ GOOD: one flat object, shape-specific fields nullish -> codegen emits a
//          correct all-optional model. Discriminate by shape at runtime.
export const feedResponseSchema = z.object({
  released: z.string().nullish(),
  movie: movieResponseSchema.nullish(),
  first_aired: z.string().nullish(),
  episode: episodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
```

**Why:** OpenAPI codegen turns a union `oneOf` into a single model with every
member's fields marked required, so a downstream consumer sees `movie`, `show`,
`episode`, `season`, etc. all as non-null and its generated model is wrong.
Nullish fields on one object generate a correct optional-field model; the caller
null-checks (`if (entry.movie) ...`) to discriminate.

Single-shape responses stay fully required - only widen to nullish the fields
that are genuinely absent for some variant.

Reference:
`projects/api/src/contracts/calendars/schema/response/hotReleaseResponseSchema.ts`.
