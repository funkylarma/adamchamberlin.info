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
      // Is it a check in
      if (entry.category[0] === 'checkin') {
        // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
        const octokit = new Octokit({ auth: context.env.GITHUB_ACCESS_TOKEN });

        // Grab the checkin details
        const checkin = entry.checkin[0];

        // The format is a bit weird,
        // where title and content are array values with a single entry
        const title = checkin.properties.name[0];
        const date = data.published[0];
        const lat = checkin.properties.latitude[0];
        const lng = checkin.properties.longitude[0];
        const url = checkin.properties.url[0];
        const filename = new Date().valueOf();
        const path = '/src/checkins/';

        var fileContent = [];

        fileContent.push('---');
        fileContent.push('date: ' + date);
        fileContent.push('title: ' + title);
        fileContent.push('latitude: ' + lat);
        fileContent.push('longitude: ' + lng);
        fileContent.push('url: ' + url);
        fileContent.push('categories:');
        fileContent.push(' - checkin');
        fileContent.push('---');

        const contents = fileContent.join('\n').toString('base64');

        const {
          updated,
          data: { commit },
        } = await octokit.repos.createOrUpdateFileContents({
          owner: 'funkylarma',
          repo: 'adamchamberlin.info',
          path: 'src/checkins/' + filename + '.md',
          content: btoa(contents),
          message: 'Import checkin from Swarm: ' + filename,
        });
        return Response.json(
          { message: 'Imported Swarm activity' },
          { status: 201, headers: { Location: 'https://adamchamberlin.info' } }
        );
      }
    }

    // Check if we have a content element
    if (entry.content != null) {
      return Response.json(entry, { status: 200 });
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
