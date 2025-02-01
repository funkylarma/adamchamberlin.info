import { slugifyString } from '../utils/index.js';

import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItLinkAttributes from 'markdown-it-link-attributes';
import markdownItPrism from 'markdown-it-prism';


// Options for the `markdown-it` library
const markdownItOptions = {
  html: true,
  breaks: true,
  linkify: true,
}

// Options for the `markdown-it-anchor` library
const markdownItAnchorOptions = {
  level: [ 2, 3, 4 ],
  slugifyString,
  permalink: markdownItAnchor.permalink.linkAfterHeader( {
    class: 'deeplink',
    symbol: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon icon-link" viewBox="0 0 16 16"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/></svg>',
    style: 'visually-hidden',
    visuallyHiddenClass: 'visually-hidden',
    assistiveText: ( title ) => `Permalink to heading ${title}`,
    wrapper: [ '<div class="heading-wrapper">', '</div>' ],
  } ),
}

const mardownItLinkAttributesOptions = {
  // Only external links (explicit protocol; internal links use relative paths)
  pattern: /^https?:/,
  attrs: {
    rel: 'noopener',
  },
};

const markdownItPrismOptions = {
  defaultLanguage: 'plaintext',
}

const md = markdownIt( markdownItOptions )
  .use( markdownItAnchor, markdownItAnchorOptions )
  .use( markdownItAttrs, mardownItLinkAttributesOptions )
  .use( markdownItPrism, markdownItPrismOptions )

export { md }