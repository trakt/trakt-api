export const prerender = true;

// Every view is selected by query string (?section, ?guide, ?operation), which
// a prerender cannot know, so the shell hydrates and renders on the client.
export const ssr = false;
