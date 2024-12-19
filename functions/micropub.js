import { Octokit } from '@octokit/rest'

export async function onRequest(context) {

  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
  const octokit = new Octokit({ auth: context.env.GITHUB_ACCESS_TOKEN });

  // Get the body contents
  const body = await context.request.json();

  // Check we have an h-entry element
  if (body.type == 'h-entry') {

    // Get the properties
    const data = body.properties

    // Check it is a checkin
    if (data.category[0] === "checkin") {

      // Grab the checkin details
      const checkin = body.properties.checkin[0]

      // The format is a bit weird,
      // where title and content are array values with a single entry
      const title = checkin.properties.name[0]
      const date = data.published[0]
      const lat = checkin.properties.latitude[0]
      const lng = checkin.properties.longitude[0]
      const url = checkin.properties.url[0]
      const filename = new Date().valueOf()
      const path = "/src/checkins/"

      var fileContent = []

      fileContent.push("---")
      fileContent.push('date: ' + date)
      fileContent.push('title: ' + title)
      fileContent.push('latitude: ' + lat)
      fileContent.push('longitude: ' + lng)
      fileContent.push('url: ' + url)
      fileContent.push('categories:')
      fileContent.push(' - checkin')
      fileContent.push('---')

      const contents = fileContent.join("\n").toString("base64");

      const {
        updated,
        data: { commit },
      } = await octokit.repos.createOrUpdateFileContents({
        owner: "funkylarma",
        repo: "adamchamberlin.info",
        path: "src/checkins/" + filename + '.md',
        content: btoa(contents),
        message: "Import checkin from Swarm: " + filename,
      });
      return new Response(`Imported Swarm activity`);
    }
  } else {
    return new Response(`no joy`);
  }

  return new Response(`Hello world`);
}

