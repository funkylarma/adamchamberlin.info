import { Octokit } from '@octokit/rest';

// Post context
export async function onRequestPost(context) {
  // Get the body contents
  const data = await context.request.json();

  // Check we have an h-entry element
  if (data.type == 'h-entry') {
    // Get the entry properties
    const entry = data.properties;

    // Check if we have a category
    if (entry.category != null) {
      // if we only have one category
      if (entry.category.length == 1) {
        // Check is is a single checkin
        if (entry.category[0] === 'checkin') {
          // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
          const octokit = new Octokit({ auth: context.env.GITHUB_ACCESS_TOKEN });

          // Grab the checkin details
          const checkin = entry.checkin[0];

          console.log(checkin);

          // The format is a bit weird,
          // where title and content are array values with a single entry
          const title = checkin.properties.name[0];
          const date = entry.published[0];
          const lat = checkin.properties.latitude[0];
          const lng = checkin.properties.longitude[0];
          const url = checkin.properties.url[0];
          const filename = new Date().valueOf();
          const path = '/src/notes/checkins/';

          var fileContent = [];

          fileContent.push('---');
          fileContent.push('date: ' + date);
          fileContent.push('title: ' + title);
          fileContent.push('latitude: ' + lat);
          fileContent.push('longitude: ' + lng);
          fileContent.push('url: ' + url);
          fileContent.push('category: checkin');
          fileContent.push('---');

          const contents = fileContent.join('\n').toString('base64');

          const {
            updated,
            data: { commit },
          } = await octokit.repos.createOrUpdateFileContents({
            owner: 'funkylarma',
            repo: 'adamchamberlin.info',
            path: 'src/notes/checkins/' + filename + '.md',
            content: btoa(contents),
            message: 'Import checkin from Swarm: ' + filename,
          });
          return Response.json(
            { message: 'Imported Swarm activity' },
            { status: 201, headers: { Location: 'https://adamchamberlin.info' } }
          );
        } else {
          return Response.json(
            {
              message: 'No entry method found for this category',
            },
            {
              status: 400,
            }
          );
        }
      } else {
        // Loop over the categories
        entry.category.forEach(function (category, index) {
          console.log(category, index);
        });
      }
    }

    // Check if we have a content element
    if (entry.content != null) {
      return Response.json(
        { message: entry.content },
        { status: 201, headers: { Location: 'https://adamchamberlin.info' } }
      );
    }

    return Response.json(
      {
        message: 'No entry method found',
      },
      {
        status: 400,
      }
    );
  } else {
    return Response.json(
      {
        message: 'Not a valid micropub post, missing h-entry element',
      },
      { status: 400 }
    );
  }

  return responseObj;
}

// On all requests
export async function onRequest(context) {
  return Response.json(
    {
      message: 'Hello Micropub world',
    },
    { status: 200 }
  );
}
