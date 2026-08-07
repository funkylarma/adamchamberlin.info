/** @format */

// Files/folders under functions/ that start with an underscore are not
// routed by Cloudflare Pages, so this directory is safe to use for shared
// code imported by functions/micropub.js.

export const SITE_URL = 'https://adamchamberlin.info/';

// Declared in includes/partials/head.liquid as rel="token_endpoint".
export const TOKEN_ENDPOINT = 'https://tokens.indieauth.com/token';

export const REPO_OWNER = 'funkylarma';
export const REPO_NAME = 'adamchamberlin.info';

// Directories that hold individual h-entry posts. Every one of them shares
// the same src/<dir>/<year>/<month>/<slug>.md file layout and, via that
// directory's *.11tydata.js `permalink`, the same /<year>/<month>/<slug>/
// URL - the directory name itself never appears in the public URL. That
// means a post's URL alone can't tell us which directory it lives in, so
// anything that needs to find a post from its URL (update/delete/undelete/
// source) has to probe each of these in turn.
export const CONTENT_DIRS = [
  'notes',
  'articles',
  'likes',
  'bookmarks',
  'checkins',
  'replies',
  'reposts',
  'rsvps',
  'photos',
  'media',
  'signups',
  'exercise',
  'services',
  'videos',
];

// Which of those directories `action=create` is allowed to write into.
// The rest (photos, media, signups, exercise, services, videos) are
// populated by other automated imports and are only reachable here via
// update/delete/undelete.
export const CREATABLE_KINDS = {
  like: 'likes',
  bookmark: 'bookmarks',
  reply: 'replies',
  repost: 'reposts',
  rsvp: 'rsvps',
  checkin: 'checkins',
  article: 'articles',
  note: 'notes',
};

// Micropub scopes accepted for each action. `undelete` doesn't have a
// dedicated scope in most clients, so a `create` scope is accepted too.
export const ACTION_SCOPES = {
  create: ['create', 'post'],
  update: ['update'],
  delete: ['delete'],
  undelete: ['undelete', 'create'],
};
