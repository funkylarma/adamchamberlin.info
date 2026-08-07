/** @format */

import { CONTENT_DIRS } from './constants.js';

export function slugify(str) {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // collapse consecutive hyphens
}

export function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export function fromBase64(base64) {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Reads a file from the repo. Returns `null` if it doesn't exist.
 */
export async function getFile(octokit, owner, repo, path) {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if (Array.isArray(data) || !data.content) return null;
    return { sha: data.sha, content: fromBase64(data.content) };
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

/**
 * Creates or updates a file in the repo. Pass `sha` when updating an
 * existing file.
 */
export async function putFile(octokit, owner, repo, path, content, message, sha) {
  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: toBase64(content),
    ...(sha ? { sha } : {}),
  });
  return data;
}

/**
 * Resolves a post's public URL (e.g. https://adamchamberlin.info/2026/04/foo/)
 * to its file in the repo, for the update/delete/undelete/source actions.
 * See CONTENT_DIRS in constants.js for why this has to probe directories
 * rather than compute the path directly.
 */
export async function findPostFile(octokit, owner, repo, url) {
  let pathname;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 3) return null;
  const [year, month, slug] = segments.slice(-3);

  for (const dir of CONTENT_DIRS) {
    const path = `src/${dir}/${year}/${month}/${slug}.md`;
    const file = await getFile(octokit, owner, repo, path);
    if (file) return { ...file, path, dir, year, month, slug };
  }

  return null;
}
