/** @format */

import { Octokit } from '@octokit/rest';

// Get requests
export async function onRequest ( context ) {
  const token = context.request.headers.get( 'Authorization' );
  
  if ( !token ) {
    return new Response( 'No token provided', { status: 401 } );
  }
  
  return Response.json( {
    message: 'Hello Micropub world',
  }, { status: 200 } );
}

// Post context
export async function onRequestPost ( context ) {
  // Get the token, if there is any
  const token = context.request.headers.get( 'Authorization' );
  
  // Check that we have a token
  if ( !token ) {
    return new Response( 'No token provided', { status: 401 } );
  }
  
  // Get the body contents
  const request = await context.request.json();
  
  // Init a micropub object
  let micropub = {
    frontMatterContent: [],
    bodyContent: [],
  };
  
  // Check we have an h-entry element
  if ( request.type == 'h-entry' ) {
    // Get the entry properties
    const entry = request.properties;
    
    // Start the frontmatter content
    micropub.frontMatterContent.push( '---' );
    
    // Give it a publish date
    if ( entry.published ) {
      // Set the date
      micropub.date = entry.published[ 0 ];
    } else {
      const date = new Date();
      micropub.date = date.toISOString();
    }
    
    // Define some possible content types
    const content_types = [
      'rsvp',
      'in-reply-to',
      'repost-of',
      'like-of',
      'listen-of',
      'watch-of',
      'bookmark-of',
      'ate',
      'drank',
      'photo',
      'checkin',
    ];
    
    // Loop through the content types and check if we have a match
    content_types.forEach( ( type ) => {
      if ( type in entry ) {
        switch ( type ) {
          case 'like-of':
            let like = {};
            // TODO: This is not correct micropub format
            like.title = entry.title ? entry.title : 'Liked this';
            like.url = entry[ 'like-of' ];
            // Process the like
            processLike( like );
            break;
          case 'bookmark-of':
            let bookmark = {};
            // Set the title
            // TODO: This is not correct micropub format
            bookmark.title = entry.title ? entry.title : 'New bookmark';
            bookmark.url = entry[ 'bookmark-of' ];
            
            // Process the bookmark
            processBookmark( bookmark );
            
            // Send the bookmark to Feedbin
            commitFeedbin( bookmark );
            
            // Send the bookmark to Readwise Reader
            commitReadwise( bookmark );
            break;
          case 'checkin':
            // Process the checkin
            processCheckin( entry.checkin );
            break;
          case 'photo':
            // Process the photo
            processPhoto( entry.photo );
            break;
          default:
            return Response.json( {
              message: 'Not a valid micropub post, missing a type',
            }, { status: 400 } );
        }
      }
    } );
    
    // If we have a name then it is an article
    if ( entry.name ) {
      micropub.frontMatterContent.push( 'category: article' );
    }
    
    // Check if we have any tags
    if ( entry.category ) {
      micropub.frontMatterContent.push( 'tags:' );
      processTags( entry.category );
    }
    
    // End the front matter
    micropub.frontMatterContent.push( '---' );
    micropub.frontMatterContent.push( '' );
    
    if ( entry.content ) {
      micropub.bodyContent.push( entry.content[ 0 ] );
      micropub.bodyContent.push( '' );
    }
    
    console.log( micropub );
    
    // Check that we have all the required data to push a commit
    if (
      micropub.bodyContent &&
      micropub.frontMatterContent &&
      micropub.message
    ) {
      // Check we are in production as I'm fed up deleting test commits.
      if ( context.env.ELEVENTY_ENV == 'production' ) {
        // Commit the micropub
        console.log( 'Commit the post' );
        const commit = await commitMicropub();
        return commit;
      } else {
        return Response.json( {
          message: 'We should be commiting this as it appears to be valid, but this is not production so skip it!',
        }, { status: 201, headers: { Location: 'https://adamchamberlin.info' } } );
      }
    } else {
      return Response.json( {
        message: 'Not going to save this as there is nothing to save',
      }, { status: 400 } );
    }
    
    return Response.json( {
      message: 'Not a valid micropub post',
    }, { status: 400 } );
  } else {
    return Response.json( {
      message: 'Not a valid micropub post, missing h-entry element',
    }, { status: 400 } );
  }
  
  function processLike ( like ) {
    console.log( 'Processing - Like' );
    // Set some details for the folder creation
    let date = new Date( micropub.date );
    const year = date.getFullYear();
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
    
    // Where should we save the checkin
    micropub.path = 'src/likes/' + year + '/' + month + '/';
    
    // Give it a filename
    micropub.filename = new Date().valueOf();
    micropub.message = 'Liked: ' + `${like.title}`;
    
    // Build the frontmatter
    micropub.frontMatterContent.push( 'date: ' + micropub.date );
    micropub.frontMatterContent.push( 'title: ' + like.title );
    micropub.frontMatterContent.push( 'url: ' + like.url );
    micropub.frontMatterContent.push( 'category: like' );
  }
  
  function processBookmark ( bookmark ) {
    console.log( 'Processing - Bookmark' );
    // Set some details for the folder creation
    let date = new Date( micropub.date );
    const year = date.getFullYear();
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
    
    // Where should we save the checkin
    micropub.path = 'src/bookmarks/' + year + '/' + month + '/';
    
    // Give it a filename
    micropub.filename = new Date().valueOf();
    micropub.message = 'Bookmarked: ' + `${bookmark.url}`;
    
    // Build the frontmatter
    micropub.frontMatterContent.push( 'date: ' + micropub.date );
    micropub.frontMatterContent.push( 'title: ' + bookmark.title );
    micropub.frontMatterContent.push( 'url: ' + bookmark.url );
    micropub.frontMatterContent.push( 'category: bookmark' );
  }
  
  function processCheckin ( checkin ) {
    console.log( 'Processing - Checkin' );
    // Set some sdetails for the folder creation
    let date = new Date( micropub.date );
    const year = date.getFullYear();
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
    
    // Where should we save the checkin
    micropub.path = 'src/checkins/' + year + '/' + month + '/';
    // Give it a filename
    micropub.filename = new Date().valueOf();
    micropub.message = 'Import checkin from Swarm: ' + micropub.filename;
    
    // Build the frontmatter
    micropub.frontMatterContent.push( 'date: ' + micropub.date );
    micropub.frontMatterContent.push( 'title: ' + checkin[ 0 ].properties.name );
    micropub.frontMatterContent.push(
      'latitude: ' + checkin[ 0 ].properties.latitude
    );
    micropub.frontMatterContent.push(
      'longitude: ' + checkin[ 0 ].properties.longitude
    );
    micropub.frontMatterContent.push( 'url: ' + checkin[ 0 ].properties.url );
    micropub.frontMatterContent.push( 'category: checkin' );
  }
  
  function processPhoto ( photos ) {
    console.log( 'Processing - Photos' );
    photos.forEach( ( photo ) => {
      micropub.bodyContent.push(
        '<img src="' + photo + '" alt="Checkin Photo" />'
      );
      micropub.bodyContent.push( '' );
    } );
  }
  
  function processTags ( tags ) {
    console.log( 'Processing - Tags' );
    tags.forEach( ( tag ) => {
      micropub.frontMatterContent.push( ' - ' + tag );
    } );
  }
  
  async function commitMicropub () {
    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
    const octokit = new Octokit( { auth: context.env.GITHUB_ACCESS_TOKEN } );
    
    let contents = micropub.frontMatterContent.join( '\n' );
    contents += micropub.bodyContent.join( '\n' ).toString( 'base64' );
    
    try {
      const { data } = await octokit.repos.createOrUpdateFileContents( {
        owner: 'funkylarma',
        repo: 'adamchamberlin.info',
        path: micropub.path + micropub.filename + '.md',
        content: btoa( contents ),
        message: micropub.message,
      } );
      return Response.json( { message: data.commit.message }, { status: 201, headers: { Location: 'https://adamchamberlin.info' } } );
    } catch ( err ) {
      return Response.json( {
        message: err.message,
      }, { status: err.status } );
    }
  }
  
  async function commitFeedbin ( bookmark ) {
    const feedbinRequest = new Request(
      'https://api.feedbin.com/v2/pages.json', {
        method: 'POST',
        body: JSON.stringify( {
          url: bookmark.url,
          title: bookmark.title,
        } ),
        headers: {
          Authorization: 'Basic ' + context.env.FEEDBIN_KEY,
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
    try {
      const response = await fetch( feedbinRequest );
      if ( !response.ok ) {
        throw new Error( `Response status: ${response.status}` );
      }
      
      const text = await response.text();
      console.log( text );
      return Response.json( { message: text }, { status: 201, headers: { Location: 'https://adamchamberlin.info' } } );
    } catch ( err ) {
      return Response.json( {
        message: err.message,
      }, { status: err.status } );
    }
  }
  
  async function commitReadwise ( bookmark ) {
    const readwiseRequest = new Request( 'https://readwise.io/api/v3/save/', {
      method: 'POST',
      body: JSON.stringify( {
        url: bookmark.url,
      } ),
      headers: {
        Authorization: 'Token ' + context.env.READWISE_KEY,
        'Content-Type': 'application/json; charset=utf-8',
      },
    } );
    try {
      const response = await fetch( readwiseRequest );
      if ( !response.ok ) {
        throw new Error( `Response status: ${response.status}` );
      }
      
      const text = await response.text();
      console.log( text );
      return Response.json( { message: text }, { status: 201, headers: { Location: 'https://adamchamberlin.info' } } );
    } catch ( err ) {
      return Response.json( {
        message: err.message,
      }, { status: err.status } );
    }
  }
  
  return Response.json( {
    message: 'Hello Micropub world',
  }, { status: 200 } );
}