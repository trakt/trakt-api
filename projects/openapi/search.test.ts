import { expect, test } from 'bun:test';
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

test('search query docs omit the retired engine parameter', () => {
  for (const path of ['/search/{type}', '/search/{type}/exact']) {
    const operation = getOperation(path);
    expect(
      operation.parameters?.some((parameter) =>
        !('$ref' in parameter) && parameter.name === 'engine'
      ) ?? false,
    ).toBe(false);
  }
});

test('search type docs list the types supported by each endpoint', () => {
  const queryType = getSchema(
    getParameter(getOperation('/search/{type}'), 'type'),
  );
  expect(queryType.enum).toEqual([
    'movie',
    'show',
    'episode',
    'person',
    'list',
  ]);

  const exactType = getSchema(
    getParameter(getOperation('/search/{type}/exact'), 'type'),
  );
  expect(exactType.enum).toEqual(['movie', 'show']);
});

test('search result docs expose one flat schema with episode support', () => {
  const result = getResponseItemSchema(getOperation('/search/{type}'));

  expect(result.oneOf).toEqual(undefined);
  expect(result.properties?.type).toEqual({
    type: 'string',
    enum: ['movie', 'show', 'episode', 'person', 'list'],
  });
  expect(result.required).toEqual(['score', 'type']);
});

test('recent search docs describe global trend tracking', () => {
  const addDescription = document.paths['/search/recent/']?.post?.description;

  expect(addDescription ?? '').toContain('global search trends');
});
