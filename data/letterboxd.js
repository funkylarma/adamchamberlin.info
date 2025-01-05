import EleventyFetch from '@11ty/eleventy-fetch';
import parser from 'fast-xml-parser';

export default async function () {
  console.log('Fetching Letterboxd data');

  const url = 'https://letterboxd.com/funkylarma/rss/';
  const fetchConfig = {
    duration: '6h',
    type: 'text',
  };
  let response;

  try {
    response = await EleventyFetch(url, fetchConfig);
  } catch (e) {
    console.error(`Fetch failed in lastfm.js. ${e}`);
    return `It has failed: ${e}`;
  }

  let feed;
  const result = parser.XMLValidator.validate(response);

  if (result === true) {
    const xmlparser = new parser.XMLParser();
    feed = xmlparser.parse(response);
  } else {
    console.error(`rss.js - XML is invalid. Reason: ${result.err.msg}`);
  }

  let movieList = feed.rss.channel.item;

  let movies = movieList.map((movie) => {
    let transformedMovie = {};
    transformedMovie.date = new Date(movie.pubDate);
    transformedMovie.url = movie.link;
    transformedMovie.data = {
      title: movie.title,
      category: 'movie',
    };
    return transformedMovie;
  });

  return {
    activityList: movies,
    recentMovies: movies.slice(0, 10),
  };
}
