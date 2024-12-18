exports.handler = (event, context, callback) => {
  // GET request, used by iA Writer to get the micropub config
  // we can return an empty JSON here
  if (event.httpMethod === 'GET') {
    return callback(null, {
      statusCode: 200,
      body: "{}"
    })
  }

}
