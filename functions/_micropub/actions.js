/** @format */

import { REPO_NAME, REPO_OWNER } from './constants.js';
import { applyUpdate, frontmatterToMf2, parsePost, serializePost } from './frontmatter.js';
import { findPostFile, putFile } from './github.js';
import { errorResponse, noContentResponse } from './respond.js';

async function loadPost(octokit, url) {
  const file = await findPostFile(octokit, REPO_OWNER, REPO_NAME, url);
  if (!file) return { error: errorResponse(400, 'invalid_request', `No post found at ${url}`) };
  return { file, ...parsePost(file.content) };
}

export async function handleUpdate({ url, replace, add, delete: del }, { octokit, isProd }) {
  const loaded = await loadPost(octokit, url);
  if (loaded.error) return loaded.error;
  const { file, frontmatter, body } = loaded;

  const updated = applyUpdate(frontmatter, body, { replace, add, delete: del });
  const fileContent = serializePost(updated.frontmatter, updated.body);

  if (!isProd) {
    return Response.json({ message: `Would update ${file.path} (not production, no commit made)` }, { status: 200 });
  }

  await putFile(octokit, REPO_OWNER, REPO_NAME, file.path, fileContent, `Updated: ${updated.frontmatter.title || file.slug}`, file.sha);
  return noContentResponse();
}

export async function handleDelete({ url }, { octokit, isProd }) {
  const loaded = await loadPost(octokit, url);
  if (loaded.error) return loaded.error;
  const { file, frontmatter, body } = loaded;

  // Soft delete, matching the `draft` convention already used across the
  // site (see articles/photos *.11tydata.js) - this can be undone.
  frontmatter.draft = true;
  const fileContent = serializePost(frontmatter, body);

  if (!isProd) {
    return Response.json({ message: `Would delete ${file.path} (not production, no commit made)` }, { status: 200 });
  }

  await putFile(octokit, REPO_OWNER, REPO_NAME, file.path, fileContent, `Deleted: ${frontmatter.title || file.slug}`, file.sha);
  return noContentResponse();
}

export async function handleUndelete({ url }, { octokit, isProd }) {
  const loaded = await loadPost(octokit, url);
  if (loaded.error) return loaded.error;
  const { file, frontmatter, body } = loaded;

  if (!frontmatter.draft) {
    return errorResponse(400, 'invalid_request', 'This post has not been deleted');
  }
  delete frontmatter.draft;
  const fileContent = serializePost(frontmatter, body);

  if (!isProd) {
    return Response.json({ message: `Would undelete ${file.path} (not production, no commit made)` }, { status: 200 });
  }

  await putFile(octokit, REPO_OWNER, REPO_NAME, file.path, fileContent, `Undeleted: ${frontmatter.title || file.slug}`, file.sha);
  return new Response(null, { status: 200, headers: { Location: url } });
}

export async function handleSource(url, propertiesFilter, { octokit }) {
  const loaded = await loadPost(octokit, url);
  if (loaded.error) return loaded.error;
  const { frontmatter, body } = loaded;

  const properties = frontmatterToMf2(frontmatter, body);

  if (propertiesFilter && propertiesFilter.length) {
    const filtered = {};
    propertiesFilter.forEach((key) => {
      if (properties[key]) filtered[key] = properties[key];
    });
    return Response.json({ type: ['h-entry'], properties: filtered });
  }

  return Response.json({ type: ['h-entry'], properties });
}

export function handleConfig() {
  return Response.json({
    'syndicate-to': [],
    visibility: ['public', 'draft'],
    'post-types': [
      { type: 'note', name: 'Note' },
      { type: 'article', name: 'Article' },
      { type: 'like-of', name: 'Like' },
      { type: 'bookmark-of', name: 'Bookmark' },
      { type: 'in-reply-to', name: 'Reply' },
      { type: 'repost-of', name: 'Repost' },
      { type: 'rsvp', name: 'RSVP' },
    ],
  });
}

export function handleSyntax() {
  return Response.json({
    syntax: ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'],
    actions: ['create', 'update', 'delete', 'undelete'],
  });
}
