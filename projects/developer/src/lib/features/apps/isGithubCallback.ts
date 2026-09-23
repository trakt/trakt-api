export function isGithubCallback(searchParams: URLSearchParams): boolean {
  return searchParams.has('code') || searchParams.has('error');
}
