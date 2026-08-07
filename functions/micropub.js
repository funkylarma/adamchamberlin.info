/** @format */

import { Octokit } from '@octokit/rest';
import { handleConfig, handleDelete, handleSource, handleSyntax, handleUndelete, handleUpdate } from './_micropub/actions.js';
import { hasScope, verifyToken } from './_micropub/auth.js';
import { handleCreate } from './_micropub/entries.js';
import { parseMicropubRequest } from './_micropub/request.js';
import { errorResponse } from './_micropub/respond.js';

// Micropub endpoint (https://www.w3.org/TR/micropub/) for adamchamberlin.info.
// Supports the create/update/delete/undelete actions plus the
// ?q=config/?q=source/?q=syntax queries. Tokens are verified against this
// site's declared IndieAuth token endpoint (see functions/_micropub/auth.js).
//
// Shared logic lives under functions/_micropub/ - the leading underscore
// keeps Cloudflare Pages from treating those files as routes of their own.

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const accessTokenParam = url.searchParams.get('access_token');
  const authorization = request.headers.get('Authorization') || (accessTokenParam ? `Bearer ${accessTokenParam}` : null);

  const auth = await verifyToken(authorization);
  if (!auth.valid) return errorResponse(auth.status, auth.error, auth.error_description);

  const q = url.searchParams.get('q');
  const octokit = new Octokit({ auth: env.GITHUB_ACCESS_TOKEN });

  switch (q) {
    case 'config':
      return handleConfig();

    case 'syntax':
      return handleSyntax();

    case 'source': {
      const sourceUrl = url.searchParams.get('url');
      if (!sourceUrl) return errorResponse(400, 'invalid_request', 'Missing url parameter');
      return handleSource(sourceUrl, url.searchParams.getAll('properties[]'), { octokit });
    }

    default:
      return Response.json({ me: auth.me });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const auth = await verifyToken(request.headers.get('Authorization'));
  if (!auth.valid) return errorResponse(auth.status, auth.error, auth.error_description);

  const parsed = await parseMicropubRequest(request);
  if (parsed.error) return errorResponse(400, parsed.error, parsed.error_description);

  if (!hasScope(auth.scope, parsed.action)) {
    return errorResponse(401, 'insufficient_scope', `Token does not have the "${parsed.action}" scope`);
  }

  const octokit = new Octokit({ auth: env.GITHUB_ACCESS_TOKEN });
  // Only commit to GitHub in production, so testing doesn't leave stray
  // commits on the live site - each action still reports what it would
  // have done.
  const isProd = env.ELEVENTY_ENV === 'production';

  try {
    switch (parsed.action) {
      case 'create':
        return await handleCreate(parsed.properties, { octokit, isProd, env, waitUntil: context.waitUntil.bind(context) });
      case 'update':
        return await handleUpdate(parsed, { octokit, isProd });
      case 'delete':
        return await handleDelete(parsed, { octokit, isProd });
      case 'undelete':
        return await handleUndelete(parsed, { octokit, isProd });
      default:
        return errorResponse(400, 'invalid_request', `Unsupported action: ${parsed.action}`);
    }
  } catch (err) {
    console.error(err);
    return errorResponse(err.status && err.status < 600 ? err.status : 500, 'server_error', err.message);
  }
}
