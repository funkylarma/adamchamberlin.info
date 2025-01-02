import EleventyFetch from "@11ty/eleventy-fetch";

// Load .env variables with dotenv
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.LAST_FM_KEY;

export default async function() {

  console.log('Fetching lastfm data')

  try {

    const fetchConfig = {
      duration: '12h',
      type: 'json',
    }

    const recentTracksResponse = await EleventyFetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=funkylarma&api_key=${TOKEN}&format=json`, fetchConfig)

    const weeklyTracksResponse = await EleventyFetch(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=funkylarma&api_key=${TOKEN}&format=json`, fetchConfig)

    const weeklyArtistsResponse = await EleventyFetch(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=funkylarma&api_key=${TOKEN}&format=json`, fetchConfig)

    const recentTracks = recentTracksResponse.recenttracks.track.map((track) => {
      let transformedTrack = {};
      transformedTrack.date = new Date(track.date['#text'])
      transformedTrack.url = track.url
      transformedTrack.data = {
        title: track.name + " by " + track.artist['#text'],
        category: 'listen',
      }
      return transformedTrack;
    });

    const weeklyTracks = weeklyTracksResponse.weeklytrackchart.track.map((track) => {
      let transformedTrack = {};
      transformedTrack.date = new Date()
      transformedTrack.url = track.url
      transformedTrack.data = {
        title: track.name,
        artist: track.artist['#text'],
        category: 'listen',
        playcount: track.playcount
      }
      return transformedTrack;
    });

    const weeklyArtists = weeklyArtistsResponse.weeklyartistchart.artist.map((artist) => {
      let transformedArtist = {};
      transformedArtist.date = new Date()
      transformedArtist.url = artist.url
      transformedArtist.data = {
        title: artist.name,
        category: 'listen',
        playcount: artist.playcount
      }
      return transformedArtist;
    });

    return {
      recentTracks: recentTracks,
      weeklyTracks: weeklyTracks,
      weeklyArtists: weeklyArtists,
    }
  } catch (e) {
    console.error(`Fetch failed in lastfm.js. ${e}`);
    return `It has failed: ${e}`;
  }
};