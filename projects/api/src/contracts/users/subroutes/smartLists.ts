import { smartListCreateResponseSchema } from '../../_internal/response/smartListCreateResponseSchema.ts';
import { smartListDefinitionResponseSchema } from '../../_internal/response/smartListDefinitionResponseSchema.ts';
import { smartListWriteSchema } from '../../_internal/request/smartListWriteSchema.ts';
import { builder } from '../../_internal/builder.ts';
import { z } from '../../_internal/z.ts';
import { listParamsSchema } from '../schema/request/listParamsSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';

const smartList = builder.router({
  summary: {
    summary: 'Get smart list',
    description: `#### 🔓 OAuth Optional
Returns a single smart list definition. Use the [**/users/:id/smart-lists/:list_id/items**](#reference/users) method to get the dynamic items this smart list resolves to.`,
    path: '/',
    method: 'GET',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    responses: {
      200: smartListDefinitionResponseSchema,
      404: z.undefined(),
    },
  },
  update: {
    summary: 'Update smart list',
    description: `#### 🔒 OAuth Required
Update a smart list by sending 1 or more parameters. The \`source\`, \`media_type\`, \`filters\`, and \`privacy\` can all be changed; the slug is retained so existing references keep working.`,
    path: '/',
    method: 'PUT',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    body: smartListWriteSchema.partial(),
    responses: {
      200: smartListDefinitionResponseSchema,
      404: z.undefined(),
    },
  },
  delete: {
    summary: "Delete a user's smart list",
    description: `#### 🔒 OAuth Required
Remove a smart list.`,
    path: '/',
    method: 'DELETE',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    responses: {
      204: z.undefined(),
      404: z.undefined(),
    },
  },
}, {
  pathPrefix: '/:list_id',
});

export const smartLists = builder.router({
  personal: {
    summary: "Get a user's smart lists",
    description: `#### 🔓 OAuth Optional
Returns all smart list definitions for a user. Use the [**/users/:id/smart-lists/:list_id/items**](#reference/users) method to get the dynamic items a specific smart list resolves to.`,
    path: '',
    method: 'GET',
    pathParams: profileParamsSchema,
    responses: {
      200: smartListDefinitionResponseSchema.array(),
    },
  },
  create: {
    summary: 'Create smart list',
    description: `#### 🔥 VIP Enhanced 🔒 OAuth Required
Create a new smart list. A smart list is a dynamic list driven by a \`source\` and \`filters\` rather than manually added items.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`name\` * | string | Name of the smart list. |
| \`source\` * | string | \`trending\`, \`popular\`, \`anticipated\`, \`recommendations\`, \`discover\` |
| \`media_type\` * | string | \`movies\`, \`shows\`, \`media\` |
| \`filters\` | object | Filter constraints applied to the source. |
| \`privacy\` | string | \`public\`, \`private\`, \`friends\` |`,
    path: '',
    method: 'POST',
    body: smartListWriteSchema,
    responses: {
      201: smartListCreateResponseSchema,
    },
  },
  smartList,
}, {
  pathPrefix: '/:id/smart-lists',
});

export type SmartListWriteRequest = z.infer<typeof smartListWriteSchema>;
export type SmartListDefinitionResponse = z.infer<
  typeof smartListDefinitionResponseSchema
>;
export type SmartListCreateResponse = z.infer<
  typeof smartListCreateResponseSchema
>;
