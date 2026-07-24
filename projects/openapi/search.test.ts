import { assertEquals, assertFalse, assertStringIncludes } from '@std/assert';
import type {
  OperationObject,
  ParameterObject,
  SchemaObject,
} from 'openapi3-ts';
import { generate } from './generate.ts';

const document = generate();

const getOperation = (path: string): OperationObject => {
  const operation = document.paths[path]?.get;
  if (!operation) {
    throw new Error(`Missing GET operation for ${path}`);
  }
  return operation;
};

const getParameter = (
  operation: OperationObject,
  name: string,
): ParameterObject => {
  const parameter = operation.parameters?.find((candidate) =>
    !('$ref' in candidate) && candidate.name === name
  );
  if (!parameter || '$ref' in parameter) {
    throw new Error(`Missing ${name} parameter`);
  }
  return parameter;
};

const getSchema = (parameter: ParameterObject): SchemaObject => {
  const schema = parameter.schema;
  if (!schema || '$ref' in schema) {
    throw new Error(`Missing inline schema for ${parameter.name}`);
  }
  return schema;
};

const getResponseItemSchema = (operation: OperationObject): SchemaObject => {
  const response = operation.responses?.['200'];
  if (!response || '$ref' in response) {
    throw new Error('Missing inline 200 response');
  }

  const schema = response.content?.['application/json']?.schema;
  if (!schema || '$ref' in schema || !schema.items || '$ref' in schema.items) {
    throw new Error('Missing inline 200 response item schema');
  }
  return schema.items;
};

Deno.test('search query docs omit the retired engine parameter', () => {
  for (const path of ['/search/{type}', '/search/{type}/exact']) {
    const operation = getOperation(path);
    assertFalse(
      operation.parameters?.some((parameter) =>
        !('$ref' in parameter) && parameter.name === 'engine'
      ) ?? false,
    );
  }
});

Deno.test('search type docs list the types supported by each endpoint', () => {
  const queryType = getSchema(
    getParameter(getOperation('/search/{type}'), 'type'),
  );
  assertEquals(queryType.enum, [
    'movie',
    'show',
    'episode',
    'person',
    'list',
  ]);

  const exactType = getSchema(
    getParameter(getOperation('/search/{type}/exact'), 'type'),
  );
  assertEquals(exactType.enum, ['movie', 'show']);
});

Deno.test('search result docs expose one flat schema with episode support', () => {
  const result = getResponseItemSchema(getOperation('/search/{type}'));

  assertEquals(result.oneOf, undefined);
  assertEquals(result.properties?.type, {
    type: 'string',
    enum: ['movie', 'show', 'episode', 'person', 'list'],
  });
  assertEquals(result.required, ['score', 'type']);
});

Deno.test('recent search docs describe global trend tracking', () => {
  const addDescription = document.paths['/search/recent/']?.post?.description;
  const removeDescription = document.paths['/search/recent/remove']?.post
    ?.description;

  assertStringIncludes(addDescription ?? '', 'global search trends');
  assertStringIncludes(removeDescription ?? '', 'global search trends');
});
