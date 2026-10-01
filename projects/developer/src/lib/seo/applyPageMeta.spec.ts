import { describe, expect, it } from 'vitest';
import { applyPageMeta } from './applyPageMeta.ts';

type FakeElement = {
  tag: string;
  attributes: Map<string, string>;
  setAttribute: (name: string, value: string) => void;
  remove: () => void;
};

function fakeDocument() {
  const elements: Array<FakeElement> = [];

  function createElement(tag: string): FakeElement {
    const element: FakeElement = {
      tag,
      attributes: new Map(),
      setAttribute: (name, value) => element.attributes.set(name, value),
      remove: () => elements.splice(elements.indexOf(element), 1),
    };

    return element;
  }

  const head = {
    append: (element: FakeElement) => elements.push(element),
    querySelector: (selector: string) => {
      const [, name, value] = /^\[(\S+)="([^"]+)"\]$/.exec(selector) ?? [];

      return elements.find((element) =>
        element.attributes.get(name) === value
      ) ?? null;
    },
  };

  return { head, createElement, elements };
}

function attribute(
  elements: ReadonlyArray<FakeElement>,
  [name, value]: [string, string],
  attribute: string,
): string | undefined {
  return elements.find((element) => element.attributes.get(name) === value)
    ?.attributes.get(attribute);
}

const GUIDE = {
  title: 'API URL | Trakt API Guides',
  description: 'The API should always be accessed over SSL.',
  canonical: 'https://developer.trakt.tv/docs/api-url',
  indexable: true,
};

const APPS = {
  title: 'Trakt Developer',
  description: 'Official developer portal.',
  canonical: 'https://developer.trakt.tv/',
  indexable: false,
};

function apply(document: ReturnType<typeof fakeDocument>, meta: typeof GUIDE) {
  applyPageMeta({ document: document as unknown as Document, meta });
}

describe('applyPageMeta', () => {
  it('swaps noindex for a canonical URL when leaving a private page', () => {
    const document = fakeDocument();

    apply(document, APPS);
    expect(attribute(document.elements, ['name', 'robots'], 'content'))
      .toBe('noindex');

    apply(document, GUIDE);
    expect(attribute(document.elements, ['name', 'robots'], 'content'))
      .toBeUndefined();
    expect(attribute(document.elements, ['rel', 'canonical'], 'href'))
      .toBe(GUIDE.canonical);
  });

  it('updates the existing tags between guides instead of adding more', () => {
    const document = fakeDocument();

    apply(document, GUIDE);
    const count = document.elements.length;

    apply(document, {
      ...GUIDE,
      description: 'Paginate with page and limit.',
      canonical: 'https://developer.trakt.tv/docs/pagination',
    });

    expect(document.elements).toHaveLength(count);
    expect(attribute(document.elements, ['name', 'description'], 'content'))
      .toBe('Paginate with page and limit.');
    expect(attribute(document.elements, ['property', 'og:url'], 'content'))
      .toBe('https://developer.trakt.tv/docs/pagination');
  });
});
