/** @format */

import { Octokit } from "@octokit/rest";

// Post context
export async function onRequestPost(context) {
  // Get the body contents
  const request = await context.request.json();

  // Init a micropub object
  let micropub = {
    frontMatterContent: [],
    bodyContent: [],
  };

  // Check we have an h-entry element
  if (request.type == "h-entry") {
    // Get the entry properties
    const entry = request.properties;

    // Start the frontmatter content
    micropub.frontMatterContent.push("---");

    // Give it a publish date
    if (entry.published) {
      // Set the date
      micropub.date = entry.published[0];
    }

    // Define some possible content types
    const content_types = [
      "rsvp",
      "in-reply-to",
      "repost-of",
      "like-of",
      "listen-of",
      "watch-of",
      "bookmark-of",
      "ate",
      "drank",
      "photo",
      "checkin",
    ];

    // Loop through the content types and check if we have a match
    content_types.forEach((type) => {
      if (type in entry) {
        switch (type) {
          case "checkin":
            processCheckin(entry.checkin);
            break;
          case "photo":
            processPhoto(entry.photo);
        }
      }
    });

    // If we have a name then it is an article
    if (entry.name) {
      micropub.frontMatterContent.push("category: article");
    }

    // Check if we have any tags
    if (entry.category) {
      micropub.frontMatterContent.push("tags:");
      processTags(entry.category);
    }

    // End the front matter
    micropub.frontMatterContent.push("---");
    micropub.frontMatterContent.push("");

    if (entry.content) {
      micropub.bodyContent.push(entry.content[0]);
      micropub.bodyContent.push("");
    }

    // Commit the micropub
    const commit = await commitMicropub();
    return commit;
  } else {
    return Response.json(
      {
        message: "Not a valid micropub post, missing h-entry element",
      },
      { status: 400 }
    );
  }

  function processCheckin(checkin) {
    // Where should we save the checkin
    micropub.path = "src/notes/checkins/";
    // Give it a filename
    micropub.filename = new Date().valueOf();
    (micropub.message = "Import checkin from Swarm: " + micropub.filename),
      micropub.frontMatterContent.push("date: " + micropub.date);
    micropub.frontMatterContent.push("title: " + checkin[0].properties.name);
    micropub.frontMatterContent.push(
      "latitude: " + checkin[0].properties.latitude
    );
    micropub.frontMatterContent.push(
      "longitude: " + checkin[0].properties.longitude
    );
    micropub.frontMatterContent.push("url: " + checkin[0].properties.url);
    micropub.frontMatterContent.push("category: checkin");
  }

  function processPhoto(photos) {
    photos.forEach((photo) => {
      micropub.bodyContent.push(
        '<img src="' + photo + '" alt="Checkin Photo" />'
      );
      micropub.bodyContent.push("");
    });
  }

  function processTags(tags) {
    tags.forEach((tag) => {
      micropub.frontMatterContent.push(" - " + tag);
    });
  }

  async function commitMicropub() {
    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
    const octokit = new Octokit({ auth: context.env.GITHUB_ACCESS_TOKEN });

    let contents = micropub.frontMatterContent.join("\n");
    contents += micropub.bodyContent.join("\n").toString("base64");

    try {
      const { data } = await octokit.repos.createOrUpdateFileContents({
        owner: "funkylarma",
        repo: "adamchamberlin.info",
        path: micropub.path + micropub.filename + ".md",
        content: btoa(contents),
        message: micropub.message,
      });
      return Response.json(
        { message: data.commit.message },
        { status: 201, headers: { Location: "https://adamchamberlin.info" } }
      );
    } catch (err) {
      return Response.json(
        {
          message: err.message,
        },
        { status: err.status }
      );
    }
  }

  return Response.json(
    {
      message: "Hello Micropub world",
    },
    { status: 200 }
  );
}

// On all requests
export async function onRequest(context) {
  return Response.json(
    {
      message: "Hello Micropub world",
    },
    { status: 200 }
  );
}
