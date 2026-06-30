import EleventyFetch from '@11ty/eleventy-fetch';
import dotenv from 'dotenv';
dotenv.config();

const ATHLETE_ID = process.env.INTERVALS_ICU_ID;
const API_KEY = process.env.INTERVALS_ICU_KEY;

const SPORT_GROUPS = {
  cycling: ['Ride', 'VirtualRide', 'MountainBikeRide', 'GravelRide', 'EBikeRide'],
  running: ['Run', 'TrailRun', 'VirtualRun'],
  walking: ['Walk', 'Hike'],
};

function getWeekBounds() {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diffToMonday);
  monday.setUTCHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

function metresToKm(m) {
  return Math.round((m / 1000) * 10) / 10;
}

function secondsToHM(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function emptySport() {
  return { distance: 0, duration: '—', count: 0 };
}

function emptyData(week = {}) {
  return {
    week: {
      start: week.start ?? '',
      end: week.end ?? '',
      cycling: emptySport(),
      running: emptySport(),
      walking: emptySport(),
    },
    steps: { today: 0, weekTotal: 0 },
  };
}

export default async function () {
  if (!ATHLETE_ID || !API_KEY) {
    console.warn('health.js: INTERVALS_ICU_ID or INTERVALS_ICU_KEY not set');
    return emptyData();
  }

  const { start, end } = getWeekBounds();
  const authHeader = 'Basic ' + Buffer.from(`API_KEY:${API_KEY}`).toString('base64');
  const fetchConfig = {
    duration: '1h',
    type: 'json',
    fetchOptions: {
      headers: { Authorization: authHeader },
    },
  };

  try {
    const [activities, wellness] = await Promise.all([
      EleventyFetch(
        `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/activities?oldest=${start}&newest=${end}`,
        fetchConfig
      ),
      EleventyFetch(
        `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/wellness?oldest=${start}&newest=${end}`,
        fetchConfig
      ),
    ]);

    const totals = {
      cycling: { distance: 0, duration: 0, count: 0 },
      running: { distance: 0, duration: 0, count: 0 },
      walking: { distance: 0, duration: 0, count: 0 },
    };

    for (const activity of activities) {
      for (const [group, types] of Object.entries(SPORT_GROUPS)) {
        if (types.includes(activity.type)) {
          totals[group].distance += activity.distance ?? 0;
          totals[group].duration += activity.moving_time ?? 0;
          totals[group].count += 1;
        }
      }
    }

    const today = new Date().toISOString().split('T')[0];
    let todaySteps = 0;
    let weekSteps = 0;
    for (const day of wellness) {
      if (day.steps) {
        weekSteps += day.steps;
        if (day.id === today) todaySteps = day.steps;
      }
    }

    return {
      week: {
        start,
        end,
        cycling: {
          distance: metresToKm(totals.cycling.distance),
          duration: secondsToHM(totals.cycling.duration),
          count: totals.cycling.count,
        },
        running: {
          distance: metresToKm(totals.running.distance),
          duration: secondsToHM(totals.running.duration),
          count: totals.running.count,
        },
        walking: {
          distance: metresToKm(totals.walking.distance),
          duration: secondsToHM(totals.walking.duration),
          count: totals.walking.count,
        },
      },
      steps: {
        today: todaySteps,
        weekTotal: weekSteps,
      },
    };
  } catch (e) {
    console.error(`health.js: fetch failed — ${e.message}`);
    return emptyData({ start, end });
  }
}
