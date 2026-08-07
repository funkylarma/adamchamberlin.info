/** @format */

// Small response helpers so every handler returns errors in the shape the
// Micropub spec expects: { error, error_description } with the matching
// HTTP status.

export function errorResponse(status, error, description) {
  return Response.json({ error, error_description: description }, { status });
}

// 201 Created with a Location header pointing at the new post, per the
// Micropub spec's response for a successful create.
export function createdResponse(location, message) {
  return new Response(JSON.stringify({ message }), {
    status: 201,
    headers: {
      Location: location,
      'Content-Type': 'application/json',
    },
  });
}

// 204 No Content - used for successful update/delete. A 204 response must
// not carry a body (the Fetch spec throws if you try), so this is the only
// safe shape for it.
export function noContentResponse() {
  return new Response(null, { status: 204 });
}
