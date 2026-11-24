
export function normalizeUrl(value) {
  if (typeof value !== "string") return "";

  const input = value.trim();

  if (!input) return "";

  try {
    const normalized = /^https?:\/\//i.test(input)
      ? input
      : `https://${input}`;

    const url = new URL(normalized);

    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

export default function isNormalizedUrl(value) {
  return Boolean(normalizeUrl(value));
}
