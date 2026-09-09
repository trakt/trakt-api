import { describe, expect, it } from 'vitest';
import { parseOpenApiDocument } from './parseOpenApiDocument.ts';

describe('parseOpenApiDocument', () => {
  it('should map path and operation metadata into an editable endpoint', () => {
    const catalog = parseOpenApiDocument({
      source: 'test',
      document: {
        openapi: '3.0.2',
        info: { title: 'Trakt API', version: '2.0.0' },
        servers: [{ url: 'https://api.trakt.tv' }],
        components: {
          securitySchemes: {
            traktOAuth: { type: 'oauth2', flows: {} },
          },
        },
        paths: {
          '/movies/{id}': {
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', example: 'tron-legacy-2010' },
              },
            ],
            get: {
              operationId: 'moviesSummary',
              summary: 'Get a movie',
              tags: ['Movies'],
              security: [{ traktOAuth: [] }, {}],
              responses: {
                '200': {
                  description: 'Movie information',
                  headers: {
                    'X-Pagination-Page': {
                      description: 'Current page',
                      schema: { type: 'integer', example: 1 },
                    },
                  },
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          title: { type: 'string', example: 'TRON: Legacy' },
                          year: { type: 'integer', nullable: true },
                        },
                        required: ['title', 'year'],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(catalog.endpoints).toHaveLength(1);
    expect(catalog.endpoints.at(0)).toMatchObject({
      id: 'moviesSummary',
      auth: 'optional',
      serverUrls: ['https://api.trakt.tv'],
    });
    expect(catalog.endpoints.at(0)?.parameters.at(0)).toMatchObject({
      id: 'path:id',
      defaultValue: 'tron-legacy-2010',
    });
    expect(catalog.endpoints.at(0)?.responses.at(0)).toEqual({
      status: '200',
      description: 'Movie information',
      contentType: 'application/json',
      headers: [{
        name: 'X-Pagination-Page',
        description: 'Current page',
        example: '1',
      }],
      example: '{\n  "title": "TRON: Legacy",\n  "year": 0\n}',
      requiredExample: '{\n  "title": "TRON: Legacy"\n}',
    });
  });

  it('should distinguish OAuth endpoints, required, and optional access', () => {
    const catalog = parseOpenApiDocument({
      source: 'test',
      document: {
        openapi: '3.0.2',
        info: { title: 'Trakt API', version: '2.0.0' },
        components: {
          securitySchemes: {
            traktAPI: {
              type: 'apiKey',
              in: 'header',
              name: 'trakt-api-key',
            },
            traktOAuth: { type: 'oauth2', flows: {} },
          },
        },
        paths: {
          '/required': {
            get: {
              security: [{ traktAPI: [], traktOAuth: [] }],
              responses: { '200': { description: 'OK' } },
            },
          },
          '/optional': {
            get: {
              security: [
                { traktAPI: [], traktOAuth: [] },
                { traktAPI: [] },
              ],
              responses: { '200': { description: 'OK' } },
            },
          },
          '/public': {
            get: {
              security: [{ traktAPI: [] }],
              responses: { '200': { description: 'OK' } },
            },
          },
          '/oauth/token': {
            post: {
              servers: [{ url: 'https://auth.trakt.tv' }],
              security: [{ traktAPI: [] }],
              responses: { '200': { description: 'OK' } },
            },
          },
        },
      },
    });

    expect(catalog.endpoints.map(({ auth }) => auth)).toEqual([
      'required',
      'optional',
      'optional',
      'endpoint',
    ]);
  });

  it('should include PATCH operations', () => {
    const catalog = parseOpenApiDocument({
      source: 'test',
      document: {
        openapi: '3.0.2',
        info: { title: 'Trakt API', version: '2.0.0' },
        paths: {
          '/users/{id}': {
            patch: {
              operationId: 'updateUser',
              responses: { '204': { description: 'No Content' } },
            },
          },
        },
      },
    });

    expect(catalog.endpoints.at(0)).toMatchObject({
      method: 'PATCH',
      operationId: 'updateUser',
    });
  });

  it('should create JSON body examples from referenced schemas', () => {
    const catalog = parseOpenApiDocument({
      source: 'test',
      document: {
        openapi: '3.0.2',
        info: { title: 'Trakt API', version: '2.0.0' },
        components: {
          schemas: {
            Rating: {
              type: 'object',
              properties: {
                rating: { type: 'integer', example: 9 },
              },
            },
          },
        },
        paths: {
          '/sync/ratings': {
            post: {
              operationId: 'syncRatingsAdd',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Rating' },
                  },
                },
              },
              responses: { '201': { description: 'Created' } },
            },
          },
        },
      },
    });

    expect(catalog.endpoints.at(0)?.requestBody?.example).toBe(
      '{\n  "rating": 9\n}',
    );
  });
});
