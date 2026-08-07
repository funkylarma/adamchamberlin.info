/** @format */

import { dump as yamlDump, load as yamlLoad } from 'js-yaml';

// Which mf2 property carries the referenced URL depends on the post's
// category - see the hand-authored examples in src/likes, src/bookmarks,
// src/replies and src/reposts, which all store it under a plain `url`
// frontmatter key regardless of the mf2 property name it came from.
export const URL_PROPERTY_BY_CATEGORY = {
  like: 'like-of',
  bookmark: 'bookmark-of',
  reply: 'in-reply-to',
  repost: 'repost-of',
};

/**
 * Splits a post file into its parsed frontmatter and body.
 */
export function parsePost(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw.trim() };
  const frontmatter = yamlLoad(match[1]) || {};
  const body = match[2].replace(/^\n+/, '').trimEnd();
  return { frontmatter, body };
}

// js-yaml throws on `undefined` values (there's no YAML equivalent), and
// there's no reason to persist empty arrays either.
function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0)),
  );
}

/**
 * Serialises frontmatter + body back into a post file.
 */
export function serializePost(frontmatter, body) {
  const yaml = yamlDump(compact(frontmatter), { lineWidth: -1, noRefs: true }).trimEnd();
  return `---\n${yaml}\n---\n\n${(body || '').trim()}\n`;
}

/**
 * Converts a post's frontmatter + body into an mf2 `properties` object,
 * for the ?q=source query and for building update sources.
 */
export function frontmatterToMf2(frontmatter, body) {
  const properties = {};

  if (frontmatter.title) properties.name = [frontmatter.title];
  if (body) properties.content = [body];
  if (frontmatter.date) properties.published = [new Date(frontmatter.date).toISOString()];
  if (frontmatter.tags) properties.category = Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags];
  if (frontmatter.rsvp) properties.rsvp = [frontmatter.rsvp];

  if (frontmatter.url) {
    const key = URL_PROPERTY_BY_CATEGORY[frontmatter.category] || 'url';
    properties[key] = [frontmatter.url];
  }

  if (frontmatter.draft) properties['post-status'] = ['draft'];

  return properties;
}

// Maps an incoming mf2 property name to the frontmatter key it should be
// applied to. Returns `null` for properties this endpoint doesn't manage
// (e.g. `photo`, `latitude`) - update requests for those are silently
// ignored rather than rejected outright.
function mapMf2Key(key, frontmatter) {
  if (key === 'content') return 'content';
  if (key === 'name') return 'title';
  if (key === 'category') return 'tags';
  if (key === 'published') return 'date';
  if (key === 'rsvp') return 'rsvp';
  if (key === 'url' || key === 'in-reply-to') return 'url';
  if (URL_PROPERTY_BY_CATEGORY[frontmatter.category] === key) return 'url';
  return null;
}

const arrayify = (value) => (Array.isArray(value) ? value : [value]);

/**
 * Applies a Micropub `update` request's replace/add/delete operations to a
 * post's frontmatter + body. Only understands the JSON update syntax (the
 * spec allows form-encoded update to be unsupported).
 */
export function applyUpdate(frontmatter, body, { replace = {}, add = {}, delete: del } = {}) {
  const fm = { ...frontmatter };
  let newBody = body;

  const setValue = (key, values) => {
    const target = mapMf2Key(key, fm);
    if (!target) return;
    if (target === 'content') {
      newBody = arrayify(values).join('\n\n');
    } else if (target === 'tags') {
      fm.tags = arrayify(values);
    } else {
      fm[target] = arrayify(values)[0];
    }
  };

  const addValue = (key, values) => {
    const target = mapMf2Key(key, fm);
    if (!target) return;
    if (target === 'content') {
      newBody = [newBody, ...arrayify(values)].filter(Boolean).join('\n\n');
    } else if (target === 'tags') {
      const existing = Array.isArray(fm.tags) ? fm.tags : fm.tags ? [fm.tags] : [];
      fm.tags = [...new Set([...existing, ...arrayify(values)])];
    } else {
      // Scalar properties don't have a meaningful "add" beyond replacing.
      fm[target] = arrayify(values)[0];
    }
  };

  const removeWholeProperty = (key) => {
    const target = mapMf2Key(key, fm);
    if (!target) return;
    if (target === 'content') {
      newBody = '';
    } else {
      delete fm[target];
    }
  };

  const removeValues = (key, values) => {
    const target = mapMf2Key(key, fm);
    if (target !== 'tags') {
      removeWholeProperty(key);
      return;
    }
    const toRemove = arrayify(values);
    fm.tags = (Array.isArray(fm.tags) ? fm.tags : fm.tags ? [fm.tags] : []).filter((tag) => !toRemove.includes(tag));
    if (!fm.tags.length) delete fm.tags;
  };

  Object.entries(replace).forEach(([key, values]) => setValue(key, values));
  Object.entries(add).forEach(([key, values]) => addValue(key, values));

  if (Array.isArray(del)) {
    del.forEach((key) => removeWholeProperty(key));
  } else if (del && typeof del === 'object') {
    Object.entries(del).forEach(([key, values]) => removeValues(key, values));
  }

  return { frontmatter: fm, body: newBody };
}
