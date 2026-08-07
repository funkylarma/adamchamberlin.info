/** @format */

import { CREATABLE_KINDS, REPO_NAME, REPO_OWNER, SITE_URL } from './constants.js';
import { serializePost } from './frontmatter.js';
import { putFile, slugify } from './github.js';
import { createdResponse } from './respond.js';
import { syndicateBookmark } from './syndicate.js';

const firstOf = (value) => (Array.isArray(value) ? value[0] : value);

function resolveKind(properties) {
  if ('bookmark-of' in properties) return 'bookmark';
  if ('checkin' in properties) return 'checkin';
  if ('in-reply-to' in properties) return 'reply';
  if ('like-of' in properties) return 'like';
  if ('repost-of' in properties) return 'repost';
  if ('rsvp' in properties) return 'rsvp';
  // No recognised interaction property: it's a plain post. Give it a
  // `name` and it's an article, otherwise it's a note - matching the
  // commented-out convention already in the previous version of this file.
  return firstOf(properties.name) ? 'article' : 'note';
}

function buildLike(properties) {
  const url = firstOf(properties['like-of']);
  const title = firstOf(properties.name) || 'Liked this';
  return {
    frontmatter: { title, url, canonical: url, category: 'like', tags: properties.category },
    message: `Liked: ${title}`,
  };
}

function buildBookmark(properties) {
  const url = firstOf(properties['bookmark-of']);
  const title = firstOf(properties.name) || 'New bookmark';
  return {
    frontmatter: { title, url, category: 'bookmark', tags: properties.category },
    message: `Bookmarked: ${url}`,
    syndicate: { url, title },
  };
}

function buildReply(properties) {
  const url = firstOf(properties['in-reply-to']);
  const title = firstOf(properties.name) || `Replied to ${url}`;
  return {
    frontmatter: { title, url, category: 'reply', tags: properties.category },
    message: `Replied to: ${url}`,
  };
}

function buildRepost(properties) {
  const url = firstOf(properties['repost-of']);
  const title = firstOf(properties.name) || 'Boosted';
  return {
    frontmatter: { title, url, category: 'repost', tags: properties.category },
    message: `Boosted: ${title}`,
  };
}

function buildRsvp(properties) {
  // RSVPs are, strictly, a reply to the event being RSVPed to - but this
  // endpoint has always accepted a plain `url` too, so keep both working.
  const url = firstOf(properties['in-reply-to']) || firstOf(properties.url);
  const title = firstOf(properties.name) || "RSVP'd";
  return {
    frontmatter: { title, url, rsvp: firstOf(properties.rsvp), category: 'rsvp', tags: properties.category },
    message: `RSVP'd: ${title}`,
  };
}

function buildCheckin(properties) {
  // Swarm-style checkin payloads nest the venue as an h-card under the
  // `checkin` property: [{ type: ['h-card'], properties: { name, ... } }].
  const checkin = firstOf(properties.checkin) || {};
  const venue = checkin.properties || {};
  const title = firstOf(venue.name) || 'Checked in';
  return {
    frontmatter: {
      title,
      latitude: firstOf(venue.latitude),
      longitude: firstOf(venue.longitude),
      url: firstOf(venue.url),
      category: 'checkin',
      tags: properties.category,
    },
    message: `Checked in: ${title}`,
  };
}

function buildNoteOrArticle(properties, kind) {
  const name = firstOf(properties.name);
  return {
    frontmatter: { title: name, category: kind, tags: properties.category },
    message: kind === 'article' ? `Article: ${name}` : 'New note',
  };
}

const BUILDERS = {
  like: buildLike,
  bookmark: buildBookmark,
  reply: buildReply,
  repost: buildRepost,
  rsvp: buildRsvp,
  checkin: buildCheckin,
  article: (properties) => buildNoteOrArticle(properties, 'article'),
  note: (properties) => buildNoteOrArticle(properties, 'note'),
};

function buildBody(properties) {
  const parts = [];

  const content = firstOf(properties.content);
  if (content) {
    // mf2 content can be a plain string or { html, value }.
    parts.push(typeof content === 'object' ? content.html || content.value : content);
  }

  if (properties.photo) {
    properties.photo.forEach((photo) => {
      const src = typeof photo === 'object' ? photo.value : photo;
      const alt = typeof photo === 'object' && photo.alt ? photo.alt : '';
      parts.push(`<img src="${src}" alt="${alt}" />`);
    });
  }

  return parts.join('\n\n');
}

function buildFilename(properties, frontmatter) {
  const slugSource = firstOf(properties['mp-slug']) || frontmatter.title;
  return slugSource ? slugify(slugSource) : String(Date.now());
}

/**
 * Handles a Micropub `create` request: builds the frontmatter/body for the
 * post's kind, writes it to the repo, and (for bookmarks) fires off
 * best-effort syndication to read-later services.
 */
export async function handleCreate(properties, { octokit, isProd, env, waitUntil }) {
  const kind = resolveKind(properties);
  const dir = CREATABLE_KINDS[kind];
  const builder = BUILDERS[kind];

  const date = firstOf(properties.published) || new Date().toISOString();
  const built = builder(properties);
  // `date` first, matching the hand-authored convention in every existing
  // post (see e.g. src/likes/2026/04/i-got-tired-of-correcting-machines.md).
  built.frontmatter = { date, ...built.frontmatter };

  const body = buildBody(properties);
  const filename = buildFilename(properties, built.frontmatter);

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const path = `src/${dir}/${year}/${month}/${filename}.md`;
  const permalink = `${SITE_URL}${year}/${month}/${filename}/`;
  const fileContent = serializePost(built.frontmatter, body);

  if (!isProd) {
    return createdResponse(permalink, `Would commit ${path} (not production, no commit made)`);
  }

  const data = await putFile(octokit, REPO_OWNER, REPO_NAME, path, fileContent, built.message);

  if (built.syndicate) {
    waitUntil(syndicateBookmark(built.syndicate, env));
  }

  return createdResponse(permalink, data.commit.message);
}
