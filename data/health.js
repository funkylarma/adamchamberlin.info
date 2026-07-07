import EleventyFetch from '@11ty/eleventy-fetch';
import dotenv from 'dotenv';
dotenv.config();

const ATHLETE_ID = process.env.INTERVALS_ICU_ID;
const API_KEY = process.env.INTERVALS_ICU_KEY;
const WEEK_COUNT = 12;

const SPORT_GROUPS = {
  cycling: ['Ride', 'VirtualRide', 'MountainBikeRide', 'GravelRide', 'EBikeRide'],
  running: ['Run', 'TrailRun', 'VirtualRun'],
  walking: ['Walk', 'Hike'],
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getWeekRange(count) {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const thisMonday = new Date(now);
  thisMonday.setUTCDate(now.getUTCDate() + diffToMonday);
  thisMonday.setUTCHours(0, 0, 0, 0);

  const weeks = [];
  for (let i = count - 1; i >= 0; i--) {
    const start = new Date(thisMonday);
    start.setUTCDate(thisMonday.getUTCDate() - i * 7);
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6);

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    const [, , mm, dd] = startStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    const label = `${parseInt(dd)} ${MONTHS[parseInt(mm) - 1]}`;

    weeks.push({ start: startStr, end: endStr, label });
  }

  return { oldest: weeks[0].start, newest: weeks[weeks.length - 1].end, weeks };
}

function getMonday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().split('T')[0];
}

function metresToKm(m) {
  return Math.round((m / 1000) * 10) / 10;
}

function secondsToHM(s) {
  if (!s) return '—';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function () {
  if (!ATHLETE_ID || !API_KEY) {
    console.warn('health.js: INTERVALS_ICU_ID or INTERVALS_ICU_KEY not set');
    return { weeks: [] };
  }

  const { oldest, newest, weeks } = getWeekRange(WEEK_COUNT);
  const authHeader = 'Basic ' + Buffer.from(`API_KEY:${API_KEY}`).toString('base64');
  const fetchConfig = {
    duration: '1h',
    type: 'json',
    fetchOptions: { headers: { Authorization: authHeader } },
  };

  try {
    const [activities, wellness] = await Promise.all([
      EleventyFetch(
        `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/activities?oldest=${oldest}&newest=${newest}`,
        fetchConfig
      ),
      EleventyFetch(
        `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/wellness?oldest=${oldest}&newest=${newest}`,
        fetchConfig
      ),
    ]);

    // Initialise per-week accumulators keyed by Monday date
    const weekMap = {};
    for (const week of weeks) {
      weekMap[week.start] = {
        ...week,
        cycling: { distanceRaw: 0, duration: 0, count: 0 },
        running: { distanceRaw: 0, duration: 0, count: 0 },
        walking: { distanceRaw: 0, duration: 0, count: 0 },
        commute: { distanceRaw: 0, duration: 0, count: 0 },
        stepsRaw: 0,
      };
    }

    for (const activity of activities) {
      const dateStr = (activity.start_date_local || activity.start_date || '').substring(0, 10);
      if (!dateStr) continue;
      const weekStart = getMonday(dateStr);
      if (!weekMap[weekStart]) continue;

      for (const [group, types] of Object.entries(SPORT_GROUPS)) {
        if (types.includes(activity.type)) {
          weekMap[weekStart][group].distanceRaw += activity.distance ?? 0;
          weekMap[weekStart][group].duration += activity.moving_time ?? 0;
          weekMap[weekStart][group].count += 1;
        }
      }

      if (activity.commute) {
        weekMap[weekStart].commute.distanceRaw += activity.distance ?? 0;
        weekMap[weekStart].commute.duration += activity.moving_time ?? 0;
        weekMap[weekStart].commute.count += 1;
      }
    }

    for (const day of wellness) {
      if (!day.steps) continue;
      const weekStart = getMonday(day.id);
      if (!weekMap[weekStart]) continue;
      weekMap[weekStart].stepsRaw += day.steps;
    }

    const CO2_G_PER_KM = 170; // UK average car emissions

    // First pass: compute totals to find the maximums
    let maxActivityKm = 0;
    let maxCommuteKm = 0;
    let maxSteps = 0;
    const computed = weeks.map(w => {
      const d = weekMap[w.start];
      const cy = metresToKm(d.cycling.distanceRaw);
      const ru = metresToKm(d.running.distanceRaw);
      const wa = metresToKm(d.walking.distanceRaw);
      const co = metresToKm(d.commute.distanceRaw);
      const total = Math.round((cy + ru + wa) * 10) / 10;
      if (total > maxActivityKm) maxActivityKm = total;
      if (co > maxCommuteKm) maxCommuteKm = co;
      if (d.stepsRaw > maxSteps) maxSteps = d.stepsRaw;
      return {
        start: w.start,
        end: w.end,
        label: w.label,
        cycling: { distance: cy, duration: secondsToHM(d.cycling.duration), count: d.cycling.count },
        running: { distance: ru, duration: secondsToHM(d.running.duration), count: d.running.count },
        walking: { distance: wa, duration: secondsToHM(d.walking.duration), count: d.walking.count },
        commute: { distance: co, duration: secondsToHM(d.commute.duration), count: d.commute.count },
        activityTotal: total,
        stepsRaw: d.stepsRaw,
      };
    });

    // Second pass: add normalised chart heights
    const today = new Date().toISOString().split('T')[0];
    const currentWeekStart = getMonday(today);

    const result = computed.map(w => ({
      ...w,
      activityHeightPct: maxActivityKm > 0 ? Math.round((w.activityTotal / maxActivityKm) * 100) : 0,
      commuteHeightPct: maxCommuteKm > 0 ? Math.round((w.commute.distance / maxCommuteKm) * 100) : 0,
      stepsHeightPct: maxSteps > 0 ? Math.round((w.stepsRaw / maxSteps) * 100) : 0,
      stepsFormatted: w.stepsRaw > 0 ? w.stepsRaw.toLocaleString('en-GB') : '—',
      isCurrent: w.start === currentWeekStart,
    }));

    const totalCommuteKm = Math.round(computed.reduce((s, w) => s + w.commute.distance, 0) * 10) / 10;
    const totalCommuteRides = computed.reduce((s, w) => s + w.commute.count, 0);
    const totalCo2Kg = Math.round((totalCommuteKm * CO2_G_PER_KM) / 100) / 10;

    return {
      weeks: result,
      commuteTotals: {
        rides: totalCommuteRides,
        distanceKm: totalCommuteKm,
        distanceFormatted: totalCommuteKm.toLocaleString('en-GB'),
        co2SavedKg: totalCo2Kg,
        co2SavedFormatted: totalCo2Kg.toLocaleString('en-GB'),
      },
    };
  } catch (e) {
    console.error(`health.js: fetch failed — ${e.message}`);
    return { weeks: [] };
  }
}
