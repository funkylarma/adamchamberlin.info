import EleventyFetch from '@11ty/eleventy-fetch';
import dotenv from 'dotenv';
dotenv.config( );

const TOKEN = process.env.LAST_FM_KEY;

export default async function ( ) {
  console.log( 'Fetching lastfm data' );
  
  try {
    const fetchConfig = {
      duration: '1h',
      type: 'json',
    };
    
    const recentTracksResponse = await EleventyFetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=funkylarma&api_key=${TOKEN}&format=json`,
      fetchConfig
    );
    
    const weeklyArtistsResponse = await EleventyFetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=funkylarma&api_key=${TOKEN}&format=json`,
      fetchConfig
    );
    
    const recentTracks = recentTracksResponse.recenttracks.track
      .filter( ( track ) => track.date !== undefined )
      .map( ( track ) => {
        let transformedTrack = {};
        transformedTrack.date = new Date( track.date[ '#text' ] );
        transformedTrack.url = track.url;
        transformedTrack.data = {
          title: track.name,
          artist: track.artist[ '#text' ],
          cover: track.image[ 2 ][ '#text' ],
          category: 'listen',
        };
        return transformedTrack;
      } );
    
    const weeklyArtists = weeklyArtistsResponse.weeklyartistchart.artist.map( ( artist ) => {
      let transformedArtist = {};
      transformedArtist.date = new Date( );
      transformedArtist.url = artist.url;
      transformedArtist.data = {
        title: artist.name,
        category: 'listen',
        playcount: artist.playcount,
      };
      return transformedArtist;
    } );
    
    return {
      activityList: recentTracks,
      recentTracks: recentTracks.slice( 0, 24 ),
      weeklyArtists: weeklyArtists,
    };
  } catch ( e ) {
    console.error( `Fetch failed in lastfm.js. ${e}` );
    return `It has failed: ${e}`;
  }
}