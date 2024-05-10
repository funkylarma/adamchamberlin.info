const markdownIt = require('markdown-it'),
      markdownItPrism = require('markdown-it-prism'),
      markdownItAttrs = require('markdown-it-attrs'),
      markdownItAnchor = require('markdown-it-anchor'),
      markdownItLinkAttributes = require('markdown-it-link-attributes');

const { 
  slugifyString 
} = require('../utils');

const markdownItAnchorOptions = {
  permalink: true,
  permalinkClass: 'deeplink',
  permalinkSymbol:
    '#',
  level: [2, 3, 4],
  slugify: slugifyString,
  renderPermalink: (slug, opts, state, idx) => {
    // based on fifth version in
    // https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
    const linkContent = state.tokens[idx + 1].children[0].content;
  
    // Create the openning <div> for the wrapper
    const headingWrapperTokenOpen = Object.assign(
      new state.Token('div_open', 'div', 1),
      {
        attrs: [['class', 'heading-wrapper']],
      }
    );
    // Create the closing </div> for the wrapper
    const headingWrapperTokenClose = Object.assign(
      new state.Token('div_close', 'div', -1),
      {
        attrs: [['class', 'heading-wrapper']],
      }
    );
  
    // Create the tokens for the full accessible anchor link
    // <a class="deeplink" href="#your-own-platform-is-the-nearest-you-can-get-help-to-setup">
    //   <span aria-hidden="true">
    //     ${opts.permalinkSymbol}
    //   </span>
    //   <span class="visually-hidden">
    //     Section titled Your "own" platform is the nearest you can(get help to) setup
    //   </span>
    // </a >
    const anchorTokens = [
      Object.assign(new state.Token('link_open', 'a', 1), {
        attrs: [
          ...(opts.permalinkClass ? [['class', opts.permalinkClass]] : []),
          ['href', opts.permalinkHref(slug, state)],
          ...Object.entries(opts.permalinkAttrs(slug, state)),
        ],
      }),
      Object.assign(new state.Token('span_open', 'span', 1), {
        attrs: [['aria-hidden', 'true']],
      }),
      Object.assign(new state.Token('html_block', '', 0), {
        content: opts.permalinkSymbol,
      }),
      Object.assign(new state.Token('span_close', 'span', -1), {}),
      Object.assign(new state.Token('span_open', 'span', 1), {
        attrs: [['class', 'visually-hidden']],
      }),
      Object.assign(new state.Token('html_block', '', 0), {
        content: `Section titled ${linkContent}`,
      }),
      Object.assign(new state.Token('span_close', 'span', -1), {}),
      new state.Token('link_close', 'a', -1),
    ];
  
    // idx is the index of the heading's first token
    // insert the wrapper opening before the heading
    state.tokens.splice(idx, 0, headingWrapperTokenOpen);
    // insert the anchor link tokens after the wrapper opening and the 3 tokens of the heading
    state.tokens.splice(idx + 3 + 1, 0, ...anchorTokens);
    // insert the wrapper closing after all these
    state.tokens.splice(
      idx + 3 + 1 + anchorTokens.length,
      0,
      headingWrapperTokenClose
    );
  },
};

const mardownItLinkAttributesOptions = {
  // Only external links (explicit protocol; internal links use relative paths)
  pattern: /^https?:/,
  attrs: {
    rel: 'noopener',
  }
};
      
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
    
    .use(markdownItAnchor, markdownItAnchorOptions)
    
    .use(markdownItLinkAttributes, mardownItLinkAttributesOptions)
  
  /** A customized, default markdown parser. Suitable for most of my parsing needs. */
  const markdown = makeMarkdownParser();
  
  module.exports = {
    markdown,
    makeMarkdownParser,
  };
    
    