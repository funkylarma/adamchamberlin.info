/** @format */

import fs from 'node:fs';
import _ from 'lodash';
import writingStats from 'writing-stats';
import moment from 'moment';
import { month_names } from './constants.js';
import { nth } from './constants.js';

function processPostFile ( filePath ) {
  try {
    let content = fs.readFileSync( filePath, 'utf8' );
    // remove front matter
    content = content.replace( /---\n.*?\n---/s, '' );
    // remove empty lines
    content = content.replace( /^\s*[\r\n]/gm, '' );
    const codeBlockMatches = content.match( /```(.*?)```/gis );
    const codeBlocks = codeBlockMatches ? codeBlockMatches.length : 0;
    // remove code blocks
    content = content.replace( /(```.+?```)/gms, '' );
    const stats = writingStats( content );
    return {
      characterCount: stats.characterCount,
      codeBlockCount: codeBlocks,
      paragraphCount: stats.paragraphCount,
      wordCount: stats.wordCount,
    };
  } catch ( err ) {
    console.error( err );
    return {
      characterCount: 0,
      codeBlockCount: 0,
      paragraphCount: 0,
      wordCount: 0,
    };
  }
}

function makeYearStats (
  currentYear,
  yearPostCount,
  yearWordCount,
  yearCodeBlockCount,
  avgDays,
  yearCharacterCount,
  yearParagraphCount
) {
  const daysInYear = ( currentYear % 4 === 0 && currentYear % 100 > 0 ) || currentYear % 400 == 0 ? 366 : 365;
  
  return {
    year: currentYear,
    daysInYear: daysInYear,
    postCount: yearPostCount,
    wordCount: yearWordCount,
    codeBlockCount: yearCodeBlockCount,
    avgDays: parseFloat( avgDays.toFixed( 2 ) ),
    avgCharacterCount: parseFloat( ( yearCharacterCount / yearPostCount )
      .toFixed( 2 ) ),
    avgCodeBlockCount: parseFloat( ( yearCodeBlockCount / yearPostCount )
      .toFixed( 2 ) ),
    avgParagraphCount: parseFloat( ( yearParagraphCount / yearPostCount )
      .toFixed( 2 ) ),
    avgWordCount: parseFloat( ( yearWordCount / yearPostCount )
      .toFixed( 2 ) ),
  };
}

export default {
  allFeed: function ( collection ) {
    return collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.tags ) return;
        if ( item.data.tags.includes( 'article' ) || item.data.tags.includes( 'note' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } )
      .slice( 0, 50 );
  },
  
  articlesForFeed: function ( collection ) {
    return collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.tags ) return;
        if ( item.data.tags.includes( 'article' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } )
      .slice( 0, 50 );
  },
  
  notesForFeed: function ( collection ) {
    return collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.tags ) return;
        if ( item.data.tags.includes( 'note' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } )
      .slice( 0, 50 );
  },
  
  homePage: function ( collection ) {
    const allContent = collection.getAll( )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    const articles = allContent
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category == 'article' ) {
          return item;
        }
      } )
      .slice( 0, 5 );
    
    const notes = allContent
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category == 'note' ) {
          return item;
        }
      } )
      .slice( 0, 5 );
    
    const comments = allContent
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category == 'reply' ) {
          return item;
        }
      } )
      .slice( 0, 5 );
    
    const checkin = allContent
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category == 'checkin' ) {
          return item;
        }
      } )
      .slice( 0, 1 );
    
    const photo = allContent
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category == 'photography' ) {
          return item;
        }
      } )
      .slice( 0, 1 );
    
    const activity = allContent
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if (
          item.data.category !== 'article' &&
          item.data.category !== 'note' &&
          item.data.category !== 'reply' &&
          item.data.category !== 'checkin' &&
          item.data.category !== 'photography'
        ) {
          return item;
        }
      } )
      .slice( 0, 5 );
    
    return {
      acticleList: articles,
      noteList: notes,
      commentList: comments,
      activityList: activity,
      lastSeen: checkin,
      latestPhoto: photo,
    };
  },
  
  recentMovies: function ( collection ) {
    const watched = collection
      .getAll( )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category == 'movie' ) {
          return item;
        }
      } )
      .slice( 0, 12 );
    return watched;
  },
  
  recentReads: function ( collection ) {
    const booksRead = collection
      .getAll( )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category == 'book' ) {
          return item;
        }
      } )
      .slice( 0, 12 );
    return booksRead;
  },
  
  // Drafts Collection
  drafts: function ( collection ) {
    return collection
      .getAll( )
      .filter( ( item ) => item.data.draft )
      .sort( ( a, b ) => b.date - a.date );
  },
  
  allContent: function ( collection ) {
    let lastfmContent = collection.getAll( )[ 0 ].data.lastfm.activityList;
    let mastodonContent = collection.getAll( )[ 0 ].data.mastodon;
    
    let localContent = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.tags ) return;
        if ( item.data.tags.includes( 'article' ) || item.data.tags.includes( 'note' ) ) {
          return item;
        }
      } )
      .sort( function ( a, b ) {
        return b.date - a.date;
      } );
    
    // Merge all content
    let allContent = [ ...localContent, ...lastfmContent, ...mastodonContent ];
    
    let sortedContent = allContent.sort( function ( a, b ) {
      return a.date - b.date;
    } );
    
    return sortedContent;
  },
  
  // Gets all the filtered content by tag and outputs a Collection
  tagList: function ( collection ) {
    const tagsSet = {};
    collection
      .getAll( )
      .sort( ( a, b ) => a.date - b.date )
      .forEach( ( item ) => {
        if ( !item.data.tags ) return;
        item.data.tags
          .filter( ( tag ) => ![ 'page', 'article', 'note', 'all' ].includes( tag ) )
          .forEach( ( tag ) => {
            if ( !tagsSet[ tag ] ) {
              tagsSet[ tag ] = [ ];
            }
            tagsSet[ tag ].push( item );
          } );
      } );
    return tagsSet;
  },
  
  // Gets all the filtered content by category and outouts a Collection
  categoryList: function ( collection ) {
    let catSet = {};
    collection
      .getAll( )
      .sort( ( a, b ) => b.date - a.date )
      .forEach( ( item ) => {
        if ( !item.data.category ) return;
        if ( !catSet[ item.data.category ] ) {
          catSet[ item.data.category ] = [ ];
        }
        catSet[ item.data.category ].push( item );
      } );
    return catSet;
  },
  
  // Year Collection
  postsByYear: function ( collection ) {
    return _.chain(
        collection
        .getAll( )
        .filter( ( item ) => {
          if ( !item.data.tags ) return;
          if ( item.data.tags.includes( 'article' ) || item.data.tags.includes( 'note' ) ) {
            return item;
          }
        } )
        .sort( ( a, b ) => b.date - a.date )
      )
      .groupBy( ( post ) => post.date.getFullYear( ) )
      .toPairs( )
      .reverse( )
      .value( );
  },
  
  // Year/Month Collection
  postsByYearMonth: function ( collection ) {
    return _.chain(
        collection
        .getAll( )
        .filter( ( item ) => {
          if ( !item.data.tags ) return;
          if ( item.data.tags.includes( 'article' ) || item.data.tags.includes( 'note' ) ) {
            return item;
          }
        } )
        .sort( ( a, b ) => b.date - a.date )
      )
      .groupBy( ( post ) => {
        const year = post.date.getFullYear( );
        const month = String( post.date.getMonth( ) + 1 )
          .padStart( 2, '0' );
        return `${year}/${month}`;
      } )
      .toPairs( )
      .reverse( )
      .value( );
  },
  
  // Year/Month/Day Collection
  postsByYearMonthDay: function ( collection ) {
    return _.chain(
        collection
        .getAll( ) //.filter((item) => ['post', 'note'].includes(item.tag))
        .filter( ( item ) => {
          if ( !item.data.tags ) return;
          if ( item.data.tags.includes( 'article' ) || item.data.tags.includes( 'note' ) ) {
            return item;
          }
        } )
        .sort( ( a, b ) => b.date - a.date )
      )
      .groupBy( ( post ) => {
        const year = post.date.getFullYear( );
        const month = String( post.date.getMonth( ) + 1 )
          .padStart( 2, '0' );
        const day = String( post.date.getDate( ) )
          .padStart( 2, '0' );
        return `${year}/${month}/${day}`;
      } )
      .toPairs( )
      .reverse( )
      .value( );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  contentArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.tags ) return;
        if ( item.data.tags.includes( 'article' ) || item.data.tags.includes( 'note' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        let sport = 'N/A';
        if ( item.data.category === 'exercise' ) {
          sport = item.data.sport;
        }
        
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          sport: sport,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  articleArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'article' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  bookArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'book' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  bookmarkArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'bookmark' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  checkinArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'checkin' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  exerciseArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'exercise' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          sport: item.data.sport,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  jamArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'jam' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  likeArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'like' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  mediaArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'movie' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  movieArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'movie' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  noteArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'note' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  photographyArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'photography' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  raceArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'race' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  replyArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'reply' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  repostArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'repost' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  rsvpArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'rsvp' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  signupArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'signup' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        // Add the entry to the keyed year/month array - only add the info we need
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
          category: item.data.category,
          tags: item.data.tags,
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  // Creates a tuple of content filtered by the specified tags.
  videographyArchive: function ( collection ) {
    // Create a return output
    let output = [ ];
    
    // Get the entries we want to work with
    let entries = collection
      .getAll( )
      .filter( ( item ) => {
        if ( !item.data.category ) return;
        if ( item.data.category.includes( 'videography' ) ) {
          return item;
        }
        // console.log(item.data.tags);
      } )
      .sort( function ( a, b ) {
        return b.date - a.date; // sort by date - descending
      } );
    
    // Loop through each of the entries
    for ( let item of entries ) {
      // Check we have both a date and title
      if ( item.data.title && item.date ) {
        // Extract the year and month number (Jan = 0)
        let year = item.date.getFullYear( ),
          month = item.date.getMonth( );
        
        // If the year hasn't been seen before, make a stub object
        if ( !output[ year ] ) {
          output[ year ] = {
            title: year,
            months: [ ],
          };
        }
        
        // If the month hasn't been seen before, make a stub object
        // with a nice month name as the title
        if ( !output[ year ].months[ month ] ) {
          output[ year ].months[ month ] = {
            title: month_names[ month ],
            entries: [ ],
          };
        }
        
        output[ year ].months[ month ].entries.push( {
          title: item.data.title,
          url: item.url,
          // This is just the date plus ordinal (e.g. 23rd)
          date: item.date.getDate( ) + nth( item.date.getDate( ) ),
        } );
      }
    }
    
    // Return our array
    return (
      output
      // Reverse the months (most recent first)
      .map( ( y ) => {
        y.months.reverse( );
        return y;
      } )
      // Filter out any null years
      .filter( ( a ) => a )
      // Reverse the years (recent first)
      .reverse( )
    );
  },
  
  postStats: function ( collectionApi ) {
    const oneDayMilliseconds = 1000 * 60 * 60 * 24;
    let avgDays = 0;
    let totalDays = 0;
    let totalPostCount = 0;
    let totalCharacterCount = 0;
    let totalCodeBlockCount = 0;
    let totalParagraphCount = 0;
    let totalWordCount = 0;
    let yearCharacterCount = 0;
    let yearCodeBlockCount = 0;
    let yearParagraphCount = 0;
    let yearWordCount = 0;
    let yearPostCount = 0;
    let yearPostDays = 0;
    let highPostCount = 0;
    
    // Initialize the data object returned by the plugin
    let statsObject = {
      avgDays: 0,
      avgCharacterCount: 0,
      avgCodeBlockCount: 0,
      avgParagraphCount: 0,
      avgWordCount: 0,
      totalWordCount: 0,
      totalCodeBlockCount: 0,
      postCount: 0,
      firstPostDate: new Date( ),
      lastPostDate: new Date( ),
      highPostCount: 0,
      years: [ ],
      postsByDay: {},
    };
    
    const posts = collectionApi.getFilteredByTag( 'article' )
      .sort( ( a, b ) => {
        return a.date - b.date;
      } );
    let postCount = posts.length;
    if ( postCount < 1 ) {
      cnsole.log( `No articles found for tag(s): ${tags.join(', ')}` );
      // return the empty stats object
      return statsObject;
    }
    
    statsObject.postCount = postCount;
    statsObject.firstPostDate = posts[ 0 ].data.page.date;
    statsObject.lastPostDate = posts[ postCount - 1 ].data.page.date;
    
    let prevPostDate = posts[ 0 ].data.page.date;
    let currentYear = prevPostDate.getFullYear( );
    
    for ( let post of posts ) {
      let postDate = post.data.page.date;
      let dateIndexKey = `${moment(postDate).year()}-${moment(postDate).dayOfYear()}`;
      
      if ( !statsObject.postsByDay[ dateIndexKey ] ) {
        statsObject.postsByDay[ dateIndexKey ] = 0;
      }
      
      statsObject.postsByDay[ dateIndexKey ]++;
      let daysBetween = ( postDate - prevPostDate ) / oneDayMilliseconds;
      let thisYear = postDate.getFullYear( );
      
      if ( thisYear != currentYear ) {
        avgDays = yearPostDays / yearPostCount;
        highPostCount = Math.max( highPostCount, yearPostCount );
        statsObject.years.push(
          makeYearStats(
            currentYear,
            yearPostCount,
            yearWordCount,
            yearCodeBlockCount,
            avgDays,
            yearCharacterCount,
            yearParagraphCount
          )
        );
        yearCharacterCount = 0;
        yearCodeBlockCount = 0;
        yearParagraphCount = 0;
        yearWordCount = 0;
        yearPostCount = 0;
        yearPostDays = 0;
        currentYear = thisYear;
      }
      prevPostDate = postDate;
      totalDays += daysBetween;
      yearPostDays += daysBetween;
      totalPostCount++;
      yearPostCount++;
      
      let postStats = processPostFile( post.page.inputPath );
      totalCharacterCount += postStats.characterCount;
      yearCharacterCount += postStats.characterCount;
      totalCodeBlockCount += postStats.codeBlockCount;
      yearCodeBlockCount += postStats.codeBlockCount;
      totalParagraphCount += postStats.paragraphCount;
      yearParagraphCount += postStats.paragraphCount;
      totalWordCount += postStats.wordCount;
      yearWordCount += postStats.wordCount;
    }
    
    if ( yearPostCount > 0 ) {
      avgDays = yearPostDays / yearPostCount;
      highPostCount = Math.max( highPostCount, yearPostCount );
      statsObject.years.push(
        makeYearStats(
          currentYear,
          yearPostCount,
          yearWordCount,
          yearCodeBlockCount,
          avgDays,
          yearCharacterCount,
          yearParagraphCount
        )
      );
    }
    statsObject.avgDays = parseFloat( ( totalDays / totalPostCount )
      .toFixed( 2 ) );
    statsObject.avgCharacterCount = parseFloat( ( totalCharacterCount / totalPostCount )
      .toFixed( 2 ) );
    statsObject.avgCodeBlockCount = parseFloat( ( totalCodeBlockCount / totalPostCount )
      .toFixed( 2 ) );
    statsObject.avgParagraphCount = parseFloat( ( totalParagraphCount / totalPostCount )
      .toFixed( 2 ) );
    statsObject.avgWordCount = parseFloat( ( totalWordCount / totalPostCount )
      .toFixed( 2 ) );
    statsObject.totalWordCount = totalWordCount;
    statsObject.totalCodeBlockCount = totalCodeBlockCount;
    statsObject.highPostCount = highPostCount;
    
    return statsObject;
  },
};