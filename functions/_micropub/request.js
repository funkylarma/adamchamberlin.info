/** @format */

// Normalises the three encodings the Micropub spec allows (JSON,
// x-www-form-urlencoded, multipart/form-data) into a single shape:
//   { action: 'create', properties: { ... } }
//   { action: 'update', url, replace, add, delete }
//   { action: 'delete' | 'undelete', url }
// or { error, error_description } if the request can't be normalised.
//
// Per the spec, `update` is only required to be supported via the JSON
// syntax, so form-encoded update requests are rejected with a clear
// message rather than half-supported.

export async function parseMicropubRequest(request) {
  const contentType = (request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();

  if (contentType === 'application/json') {
    let body;
    try {
      body = await request.json();
    } catch {
      return { error: 'invalid_request', error_description: 'Malformed JSON body' };
    }
    return normalizeJson(body);
  }

  if (contentType === 'application/x-www-form-urlencoded' || contentType === 'multipart/form-data') {
    let form;
    try {
      form = await request.formData();
    } catch {
      return { error: 'invalid_request', error_description: 'Malformed form body' };
    }
    return normalizeForm(form);
  }

  return { error: 'invalid_request', error_description: `Unsupported Content-Type: ${contentType || '(none)'}` };
}

function normalizeJson(body) {
  const action = body.action || 'create';

  if (action === 'create') {
    const type = Array.isArray(body.type) ? body.type[0] : body.h ? `h-${body.h}` : body.type;
    if (type && type !== 'h-entry') {
      return { error: 'invalid_request', error_description: `Unsupported type: ${type}` };
    }
    if (!body.properties) {
      return { error: 'invalid_request', error_description: 'Missing properties for h-entry' };
    }
    return { action: 'create', properties: body.properties };
  }

  if (!body.url) {
    return { error: 'invalid_request', error_description: `Missing url for the "${action}" action` };
  }

  if (action === 'update') {
    return { action: 'update', url: body.url, replace: body.replace || {}, add: body.add || {}, delete: body.delete };
  }

  if (action === 'delete' || action === 'undelete') {
    return { action, url: body.url };
  }

  return { error: 'invalid_request', error_description: `Unsupported action: ${action}` };
}

function normalizeForm(form) {
  const action = form.get('action') || 'create';

  if (action === 'delete' || action === 'undelete') {
    const url = form.get('url');
    if (!url) return { error: 'invalid_request', error_description: `Missing url for the "${action}" action` };
    return { action, url };
  }

  if (action === 'update') {
    return { error: 'invalid_request', error_description: 'Update requests must use the JSON syntax' };
  }

  const h = form.get('h') || 'entry';
  if (h !== 'entry') {
    return { error: 'invalid_request', error_description: `Unsupported type: h-${h}` };
  }

  const properties = {};
  for (const [rawKey, value] of form.entries()) {
    if (rawKey === 'h' || rawKey === 'action' || rawKey === 'access_token') continue;
    // File uploads aren't supported on this endpoint yet (no media
    // endpoint) - skip rather than fail the whole request.
    if (typeof value !== 'string') continue;
    const key = rawKey.endsWith('[]') ? rawKey.slice(0, -2) : rawKey;
    if (!properties[key]) properties[key] = [];
    properties[key].push(value);
  }

  return { action: 'create', properties };
}
