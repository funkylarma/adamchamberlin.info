/** @format */

// Best-effort push of a new bookmark to read-later services. Failures here
// shouldn't fail the Micropub request - the post has already been (or is
// about to be) committed to the site regardless.

export async function syndicateBookmark({ url, title }, env) {
  await Promise.allSettled([postFeedbin(url, title, env), postInstapaper(url, env), postReadwise(url, env)]);
}

async function postFeedbin(url, title, env) {
  if (!env.FEEDBIN_KEY) return;
  try {
    const response = await fetch('https://api.feedbin.com/v2/pages.json', {
      method: 'POST',
      headers: { Authorization: `Basic ${env.FEEDBIN_KEY}`, 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ url, title }),
    });
    if (!response.ok) console.error(`Feedbin sync failed: ${response.status}`);
  } catch (err) {
    console.error(`Feedbin sync error: ${err.message}`);
  }
}

async function postInstapaper(url, env) {
  if (!env.INSTAPAPER_KEY) return;
  try {
    const response = await fetch('https://www.instapaper.com/api/add', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${env.INSTAPAPER_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: `url=${encodeURIComponent(url)}`,
    });
    if (!response.ok) console.error(`Instapaper sync failed: ${response.status}`);
  } catch (err) {
    console.error(`Instapaper sync error: ${err.message}`);
  }
}

async function postReadwise(url, env) {
  if (!env.READWISE_KEY) return;
  try {
    const response = await fetch('https://readwise.io/api/v3/save/', {
      method: 'POST',
      headers: { Authorization: `Token ${env.READWISE_KEY}`, 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) console.error(`Readwise sync failed: ${response.status}`);
  } catch (err) {
    console.error(`Readwise sync error: ${err.message}`);
  }
}
