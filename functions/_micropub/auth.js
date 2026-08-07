/** @format */

import { ACTION_SCOPES, SITE_URL, TOKEN_ENDPOINT } from './constants.js';

/**
 * Verifies a Micropub request's Bearer token by introspecting it against
 * this site's declared IndieAuth token endpoint (tokens.indieauth.com),
 * matching the rel="token_endpoint" link in includes/partials/head.liquid.
 *
 * @param {string|null} authorizationHeader The raw `Authorization` header.
 * @returns {Promise<{valid: boolean, status?: number, error?: string, error_description?: string, me?: string, clientId?: string, scope?: string[]}>}
 */
export async function verifyToken(authorizationHeader) {
  if (!authorizationHeader) {
    return {
      valid: false,
      status: 401,
      error: 'unauthorized',
      error_description: 'No Authorization header provided',
    };
  }

  let introspection;
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      headers: {
        Authorization: authorizationHeader,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return {
        valid: false,
        status: 401,
        error: 'unauthorized',
        error_description: 'The token endpoint rejected this token',
      };
    }

    introspection = await response.json();
  } catch (err) {
    return {
      valid: false,
      status: 502,
      error: 'temporarily_unavailable',
      error_description: `Could not reach the token endpoint: ${err.message}`,
    };
  }

  // Normalise trailing slashes before comparing.
  const me = (introspection.me || '').replace(/\/?$/, '/');
  if (me !== SITE_URL) {
    return {
      valid: false,
      status: 403,
      error: 'forbidden',
      error_description: 'This token is not authorized for this site',
    };
  }

  const scope = (introspection.scope || '').split(/\s+/).filter(Boolean);

  return { valid: true, me, clientId: introspection.client_id, scope };
}

/**
 * Checks whether a verified token's scope covers the requested action.
 *
 * @param {string[]} scope
 * @param {string} action
 */
export function hasScope(scope, action) {
  const allowed = ACTION_SCOPES[action] || [];
  return allowed.some((s) => scope.includes(s));
}
