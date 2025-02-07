/** @format */

import { inspect } from 'node:util';
import sanitizeHTML from 'sanitize-html';
import { DateTime } from 'luxon';
import globals from '../data/globals.js';
import metadata from '../data/metadata.js';
import { month_names } from './constants.js';
import { month_short_names } from './constants.js';
import { nth } from './constants.js';

const parse = ( date ) => new Date( Date.parse( date ) );

export default {
  debug: function ( content ) {
    return `<pre>${inspect(content)}</pre>`;
  },
  
  getRelated: function ( relatedPosts, posts ) {
    let related = [];
    posts.forEach( ( p ) => {
      if ( relatedPosts.includes( p.data.page.url ) ) related.push( p );
    } );
    return related;
  },
  
  capitaliseFirstLetter: function ( string ) {
    return String( string ).charAt( 0 ).toUpperCase() + String( string ).slice( 1 );
  },
  
  metaTitle: function ( title ) {
    title.trim();
    if ( this.page.url ) {
      if ( this.page.url == '/' || this.page.url.includes( 'page' ) ) {
        title = metadata.tagline;
      } else {
        title = title + ' | ' + metadata.title;
      }
    }
    return title;
  },
  
  metaKeywords: function ( tags ) {
    return tags.join( ', ' );
  },
  
  metaDescription: function ( title ) {
    if ( this.page.url ) {
      if ( this.page.url == '/' || this.page.url.includes( 'page' ) ) {
        return metadata.description;
      }
      
      if ( /\d{4}\//.test( this.page.url ) ) {
        let type = '';
        
        if ( this.page.filePathStem.includes( 'article' ) ) {
          type = 'article';
        }
        
        if ( this.page.filePathStem.includes( 'note' ) ) {
          type = 'note';
        }
        
        if ( this.page.filePathStem.includes( 'checkin' ) ) {
          type = 'checkin';
        }
        
        if ( this.page.filePathStem.includes( 'exercise' ) ) {
          type = 'activity';
        }
        
        return (
          'The ' +
          title.replace( /[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '' ) +
          ' is a ' +
          type +
          ' posted by Adam Chamberlin on ' +
          this.page.date.toDateString()
        );
      }
    }
    
    return title + ' | ' + metadata.description;
  },
  
  feedTitle: function ( postData ) {
    if ( postData.category ) {
      switch ( postData.category ) {
        case 'book':
          return `Read ${postData.title}`;
          break;
        case 'bookmark':
          return `Bookmarked "${postData.title}"`;
          break;
        case 'checkin':
          return `Checked in at ${postData.title}`;
          break;
        case 'exercise':
          return `Went ${postData.sport} - ${postData.title}`;
          break;
        case 'like':
          return `Liked "${postData.title}"`;
          break;
        case 'movie':
          return `Watched ${postData.title}`;
          break;
        case 'reply':
          return `Replied to ${postData.title}`;
          break;
        case 'repost':
          return `Reposted "${postData.title}"`;
          break;
        case 'rsvp':
          return `RSVP'd to ${postData.title}`;
          break;
        default:
          return postData.title;
      }
    } else {
      return postData.title
    }
    
  },
  
  secondsToTime: function ( secondObj ) {
    // let date = new Date(null);
    // date.setSeconds(secondObj);
    // return date.toISOString().substring(11, 16);
    var d = Math.floor( secondObj / ( 3600 * 24 ) );
    var h = Math.floor( ( secondObj % ( 3600 * 24 ) ) / 3600 );
    var m = Math.floor( ( secondObj % 3600 ) / 60 );
    var s = Math.floor( secondObj % 60 );
    
    var dDisplay = d > 0 ? d + ( d == 1 ? ' day, ' : ' days, ' ) : '';
    var hDisplay = h > 0 ? h + ( h == 1 ? ' hour, ' : ' hours, ' ) : '';
    var mDisplay = m > 0 ? m + ( m == 1 ? ' minute, ' : ' minutes, ' ) : '';
    var sDisplay = s > 0 ? s + ( s == 1 ? ' second' : ' seconds' ) : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
  },
  
  getYear: function ( dateObj ) {
    return parse( dateObj ).getFullYear();
  },
  
  getMonth: function ( dateObj ) {
    return parse( dateObj ).getMonth() + 1;
  },
  
  getMonthName: function ( dateObj ) {
    return month_names[ parse( dateObj ).getMonth() ];
  },
  
  getMonthShortName: function ( dateObj ) {
    return month_short_names[ parse( dateObj ).getMonth() ];
  },
  
  getDay: function ( dateObj ) {
    return parse( dateObj ).getDate();
  },
  
  getDayOrdinal: function ( dateObj ) {
    let day = parse( dateObj ).getDate();
    return day + nth( day );
  },
  
  dateReadable: function ( dateObj, format, zone ) {
    return DateTime.fromJSDate( dateObj, { zone: zone || 'utc' } ).toFormat(
      format || 'dd LLLL yyyy'
    );
  },
  
  dateReadableFromISO: function (
    dateStr,
    formatStr = "dd LLL yyyy 'at' hh:mma"
  ) {
    return DateTime.fromISO( dateStr ).toFormat( formatStr );
  },
  
  dateHtmlString: function ( dateObj ) {
    return DateTime.fromJSDate( dateObj, 'utc' ).toFormat( 'yyyy-LL-dd' );
  },
  
  dateISO: function ( dateObj ) {
    return DateTime.fromJSDate( dateObj ).toISO();
  },
  
  dateLongDate: function ( dateObj ) {
    dateObj = parse( dateObj );
    let day = dateObj.getDate();
    return `${day}${nth(day)} ${
      month_names[dateObj.getMonth()]
    } ${dateObj.getFullYear()}`;
  },
  
  dateLongDateShortMonth: function ( dateObj ) {
    dateObj = parse( dateObj );
    let day = dateObj.getDate();
    return `${day}${nth(day)} ${month_short_names[dateObj.getMonth()]}`;
  },
  
  dateParse: function ( dateObj ) {
    if ( typeof dateObj !== 'undefined' ) {
      if ( dateObj instanceof Date ) {
        return Date.parse( dateObj );
      } else {
        let date = new Date( dateObj );
        return Date.parse( date );
      }
    } else {
      return 'not-set';
    }
  },
  
  wordCount: function ( content ) {
    return content.split( ' ' ).length;
  },
  
  timeReading: function ( content ) {
    const minutes = Math.ceil( content.trim().split( /\s+/ ).length / 200 );
    return `${minutes} min read`;
  },
  
  monthName: function ( monthNum ) {
    const date = new Date( 2000, parseInt( monthNum ) - 1, 1 );
    return date.toLocaleDateString( 'en', { month: 'long' } );
  },
  
  absoluteUrl: function ( url ) {
    return new URL( url, globals.url ).href;
  },
  
  stripIndex: function ( path ) {
    if ( !path ) return '';
    return path.replace( '/index.html', '/' );
  },
  
  fileHash: function ( url ) {
    const [ urlPart, paramPart ] = url.split( '?' );
    const params = new URLSearchParams( paramPart || '' );
    params.set( 'v', DateTime.local().toFormat( 'X' ) );
    return `${urlPart}?${params}`;
  },
  
  limitList: function ( value, from = 0, limit = 2 ) {
    value.splice( from, limit );
    return value;
  },
  
  webmentionsByUrl: function ( webmentions, url ) {
    const allowedTypes = {
      likes: [ 'like-of' ],
      reposts: [ 'in-reply-to' ],
      comments: [ 'mention-of', 'in-reply-to' ],
    };
    
    const allowedHTML = {
      allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
      allowedAttributes: {
        a: [ 'href' ],
      },
    };
    
    const orderByDate = ( a, b ) => new Date( a.published ) - new Date( b.published );
    
    const checkRequiredFields = ( entry ) => {
      const { author, published, content } = entry;
      return !!author && !!author.name && !!published && !!content;
    };
    
    const sanitize = ( entry ) => {
      if ( entry.content && entry.content.html ) {
        entry.content = sanitizeHTML( entry.content.html, allowedHTML );
      }
      return entry;
    };
    
    const clean = ( entry ) => {
      const { html, text } = entry.content;
      
      if ( html ) {
        // really long html mentions, usually newsletters or compilations
        entry.content.value =
          html.length > 2000 ?
          `mentioned this in <a href="${entry['wm-source']}">${entry['wm-source']}</a>` :
          sanitizeHTML( html, allowedHTML );
      } else {
        entry.content.value = sanitizeHTML( text, allowedHTML );
      }
      
      return entry;
    };
    
    const pageWebMentions = webmentions.children
      .filter( ( mention ) => mention[ 'wm-target' ] === url )
      .sort( orderByDate )
      .map( sanitize );
    
    const likes = pageWebMentions
      .filter( ( mention ) => allowedTypes.likes.includes( mention[ 'wm-property' ] ) )
      .filter( ( like ) => like.author )
      .map( ( like ) => like.author );
    
    const reposts = pageWebMentions
      .filter( ( mention ) =>
        allowedTypes.reposts.includes( mention[ 'wm-property' ] )
      )
      .filter( ( repost ) => repost.author )
      .map( ( repost ) => repost.author );
    
    const comments = pageWebMentions
      .filter( ( mention ) =>
        allowedTypes.comments.includes( mention[ 'wm-property' ] )
      )
      .filter( ( comment ) => {
        const { author, published, content } = comment;
        return author && author.name && published && content;
      } );
    
    const mentionCount = likes.length + reposts.length + comments.length;
    const data = { likes, reposts, comments, mentionCount };
    return data;
  },
};