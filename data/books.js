import EleventyFetch from '@11ty/eleventy-fetch';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = 'Bearer ' + process.env.HARDCOVER_KEY;

export default async function () {
  console.log( 'Fetching Hardcover book data' );
  
  let currentlyReading = {};
  let wantToRead = {};
  
  // Currently Reading
  try {
    
    const currentlyReadingResponse = await EleventyFetch( 'https://api.hardcover.app/v1/graphql', {
      duration: '12h',
      type: 'json',
      fetchOptions: {
        headers: {
          'content-type': 'application/json',
          authorization: TOKEN,
        },
        method: 'POST',
        body: JSON.stringify( {
          query: `
          {
            me {
              user_books(where: {status_id: {_eq: 2}}) {
                book {
                  title
                  slug
                  image {
                    url
                  }
                  contributions {
                    author {
                      name
                    }
                  }
                }
              }
            }
          }`,
        } ),
      }
    } );
    const booklist = currentlyReadingResponse.data.me[ 0 ][ 'user_books' ].map( book => {
      let transformedBook = {};
      //transformedBook.date = new Date( book.pubDate );
      transformedBook.url = 'https://hardcover.app/books/' + book.book.slug;
      transformedBook.data = {
        title: book.book.title,
        author: book.book.contributions[ 0 ].author.name,
        cover: book.book.image.url,
        category: 'book',
      };
      return transformedBook;
      
    } );
    
    currentlyReading = booklist;
    
  } catch ( e ) {
    console.log( e.status, e.statusText );
    console.error( `Failed to fetch the currently reading in books.js` );
    return `It has failed: ${e}`;
  }
  
  try {
    const wantToReadResponse = await EleventyFetch( 'https://api.hardcover.app/v1/graphql', {
      duration: '12h',
      type: 'json',
      fetchOptions: {
        headers: {
          'content-type': 'application/json',
          authorization: TOKEN,
        },
        method: 'POST',
        body: JSON.stringify( {
          query: `
          {
            me {
              user_books(where: {status_id: {_eq: 1}}) {
                book {
                  title
                  slug
                  image {
                    url
                  }
                  contributions {
                    author {
                      name
                    }
                  }
                }
              }
            }
          }`,
        } ),
      }
    } );
    const booklist = wantToReadResponse.data.me[ 0 ][ 'user_books' ].map( book => {
      let transformedBook = {};
      //transformedBook.date = new Date( book.pubDate );
      transformedBook.url = 'https://hardcover.app/books/' + book.book.slug;
      transformedBook.data = {
        title: book.book.title,
        author: book.book.contributions[ 0 ].author.name,
        //cover: book.image.url,
        category: 'book',
      };
      return transformedBook;
      
    } );
    wantToRead = booklist;
  } catch ( e ) {
    console.log( e.status, e.statusText );
    console.error( `Failed to fetch the want to read in books.js` );
    return `It has failed: ${e}`;
  }
  
  return {
    currentlyReading: currentlyReading,
    wantToRead: wantToRead,
  };
}