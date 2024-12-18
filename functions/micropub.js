export function onRequest(context) {
  return new Response("Hello, world!")
}

// exports.handler = (event, context, callback) => {
//   // GET request, we can return an empty JSON here
//   if (event.httpMethod === 'GET') {
//     return callback(null, {
//       statusCode: 200,
//       body: "{}"
//     })
//   }
// }
