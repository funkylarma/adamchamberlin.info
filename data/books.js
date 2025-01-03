import EleventyFetch from "@11ty/eleventy-fetch";
import parser from "fast-xml-parser";

export default async function() {

  console.log('Fetching Oku book data')

  const url = "https://oku.club/rss/collection/sNsDk"
  const fetchConfig = {
    duration: '12h',
    type: 'text',
  }

  let response;

  try {
    response = await EleventyFetch(url, fetchConfig)

  } catch (e) {
    console.error(`Fetch failed in books.js. ${e}`);
    return `It has failed: ${e}`;
  }

  let feed;
  const result = parser.XMLValidator.validate(response);

  if (result === true) {
    const xmlparser = new parser.XMLParser();
    feed = xmlparser.parse(response);
  } else {
    console.error(
      `rss.js - XML is invalid. Reason: ${result.err.msg}`
    );
  }

  let readingList = feed.rss.channel.item;

  let books = readingList.map((book) => {
    let transformedBook = {};
    transformedBook.date = new Date(book.pubDate);
    transformedBook.url = book.guid;
    transformedBook.data = {
      title: book.title,
      author: book['dc:creator'],
      cover: book['oku:cover'],
      category: 'book'
    };
    return transformedBook;
  });

  return books;
}