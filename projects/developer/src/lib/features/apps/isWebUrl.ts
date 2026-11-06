export function isWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      value.toLowerCase().startsWith(`${url.protocol}//`)
    );
  } catch {
    return false;
  }
}
