const markdownIt = require('markdown-it'),
      markdownItPrism = require('markdown-it-prism'),
      markdownItAttrs = require('markdown-it-attrs'),
      markdownItAnchor = require('markdown-it-anchor'),
      markdownItLinkAttributes = require('markdown-it-link-attributes');

const { 
  slugifyString 
} = require('../utils');
      
/** Configures and returns a markdown parser. */
const makeMarkdownParser = () =>
  markdownIt({
    // Use of HTML tags in Markdown
    html: true,
    // Conversion of \n to <br>
    breaks: false,
    // Automatically hyperlinking inline links
    linkify: true,
    // Smart quotes and other symbol replacements
    typographer: true,
  })
    // https://github.com/11ty/eleventy/issues/2438
    .disable('code')
    
    // Markdown prism
    .use(markdownItPrism, {
      defaultLanguage: 'plaintext',
    })
    
    .use(markdownItAttrs)
    
    .use(markdownItAnchor, {
      slugify: slugifyString,
      tabIndex: false,
      permalink: markdownItAnchor.permalink.headerLink({
        class: 'heading-anchor',
      }),
    })
    
    .use(markdownItLinkAttributes, {
      // Only external links (explicit protocol; internal links use relative paths)
      pattern: /^https?:/,
      attrs: {
        rel: 'noopener',
      },
    })
  
  /** A customized, default markdown parser. Suitable for most of my parsing needs. */
  const markdown = makeMarkdownParser();
  
  module.exports = {
    markdown,
    makeMarkdownParser,
  };
    
    