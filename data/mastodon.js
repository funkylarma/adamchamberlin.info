import EleventyFetch from "@11ty/eleventy-fetch";
import { XMLParser, XMLValidator } from "fast-xml-parser";

export default async function() {

  console.log('Fetching Mastodon data');

  const parser = new XMLParser();
  const url = "https://mastodon.social/@FunkyLarma.rss"
  const fetchConfig = {
    duration: '12h',
    type: 'xml',
  }
  let response;

  try {
    response = await EleventyFetch(url, fetchConfig);

  } catch (e) {
    console.error(`Fetch failed in mastodon.js. ${e}`);
    return `It has failed: ${e}`;
  }

  // let feed;
//
  // const result = XMLValidator.validate(response);
//
  // if (result === true) {
  //   feed = parser.parse(response);
  // } else {
  //   console.error(
  //     `rss.js - XML is invalid. Reason: ${result.err.msg}`
  //   );
  // }

  let feed = parser.parse(response);
  let tootList = feed.rss.channel.item;


  let toots = tootList.map((toot) => {
    let transformedToot = {};
    transformedToot.date = new Date(toot.pubDate);
    transformedToot.url = toot.guid;
    transformedToot.data = {
      title: toot.description,
      category: 'toot'
    };
    return transformedToot;
  });

  return toots
};
