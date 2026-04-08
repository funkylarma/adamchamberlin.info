---
date: 2026-04-08
title: 'I got tired of correcting machines so I gave them five rules'
url: https://stuffandnonsense.co.uk/blog/i-got-tired-of-correcting-machines-so-i-gave-them-five-rules
canonical: https://stuffandnonsense.co.uk/blog/i-got-tired-of-correcting-machines-so-i-gave-them-five-rules
author: 'Stuff & Nonsense • And All That Malarkey'
category: like
tags:
  - Feedbin
---

<!-- @format -->

Although I feel deeply conflicted, I’ve been using AI coding tools more often to speed up particular aspects of development. Recently, I added an `AGENTS.md` to my setup so I don’t need to repeat my preferences.

![Hello fleshy ones](https://stuffandnonsense.co.uk/content/img/2026-04-08.png)

Judge Dredd. Robot Wars. 2000AD comic.

I started using ChatGPT and DeepSeek to help me fix bugs and debug error messages, especially when I was new to working with Eleventy. I asked them questions, pasted in code, and then copied the result back into my project. Now, I use Codex to clone my boilerplate files and set up new projects. But whenever I started something new, I had to tell the machine my preferences again.

Machines don’t write code the way I do, so I constantly needed to reorder CSS selectors. Machines use too many class attributes and overly specific selectors, and don’t format CSS and HTML the way I like. When I switched to Codex, I realised there was a way to stop repeating myself by telling it ways to make the machine’s code more like mine.

The AGENTS.md file
------------------

Codex supports files called `AGENTS.md`, which is to a machine what a README is to fleshy ones. It can tell an agent what I care about and how I write code. It also defines a set of rules which prevent me from repeating myself at the start of every project.

You can add an `AGENTS.md` file to any project repo or put one into Codex’s hidden global config folder, which is in the root of your user directory (on a Mac.) Putting preferences there means that every new project starts using them.

```
~/.codex/AGENTS.md
```

I included a list of five things I was constantly correcting and needed the machine to stop doing. Here’s my global file:

```
# AGENTS.md## Core rules

- Prefer plain CSS and vanilla JavaScript.
- Prefer inline SVG when control, styling, or reuse matter.
- Use native platform features. Avoid dependencies and libraries.
- Use semantic HTML.

## CSS rules
- Don’t indent CSS declarations.
- Don’t use the `transform` shorthand property. 
- Keep the closing curly brace on the same line as the last property.
- Order all CSS properties alphabetically.
- Prefer shallow selectors and avoid deep selector chains.
- Use individual transform properties (`rotate`, `scale`, `translate`).

## Motion
- Always respect `prefers-reduced-motion`.
- Motion should be subtle, purposeful, and non-disruptive.
- Use CSS for animation and JavaScript for triggers.

## Writing
- Use British English.
- Use sentence case for headings, interface copy, and labels.
```

Quickly running through that list:

1\. By telling Codex I prefer native platform features, I get solutions that rely more on CSS, which is faster and much easier for me to work with.

2\. Machines will also happily wrap everything in `<div>` elements unless I tell it otherwise. I want meaningful structure, so I ask it to prioritise semantic elements like `<article>`, `<header>`, `<footer>`, and `<section>`. I also work mostly with inline SVG because I need control over animation and styling, so I make that explicit too.

3\. I’m especially picky about how I write CSS. Nothing AI did was technically incorrect; it just wasn’t my way of doing things. My AGENTS file tells the machine to write properties in alphabetical order, so I can scan them more quickly. I also want consistent formatting and simple selectors, so code stays easy to read.

4\. When I animate, I’m often aiming for ambient motion to add atmosphere. I also need animations that respect someone’s motion preferences, not as an afterthought.

5\. Finally, when adding UI copy such as button text and form labels, I want British English spelling in sentence case.

* * *

AGENTS.md as a project brief
----------------------------

A global AGENTS file gets used by every project, but putting one in a project repo makes it act more like a brief. Here’s the boilerplate file I use with Eleventy projects:

```
# AGENTS.md## Overview
- This is an Eleventy project.
- Follow existing patterns in templates, styles, and naming.
- Make the smallest change that solves the problem cleanly.
- Don’t write new code unless absolutely necessary.

## Structure
- `src/` contains all source files.
- `src/_includes/` contains layouts and partials.
- `src/css/` contains global and component styles.
- `src/js/` contains small progressive-enhancement scripts.

## Working approach
- Don’t refactor unrelated code.
- Reuse existing patterns before creating new ones.

## HTML
- Don’t add unnecessary wrapper elements.
- Reuse existing partials where possible.
- Use semantic HTML elements.

## CSS
- Extend existing styles before creating new ones.
- Follow the global AGENTS.md for formatting and style rules.
- Keep selectors shallow and readable.
- Place media queries at the end of stylesheets.
- Use `.alt-*` for variations and `.item-*` for content types when needed.

## JavaScript
- Always use progressive enhancement.
- Don’t use JavaScript if HTML and CSS can solve the problem.
- Keep scripts small and vanilla.
- Scope behaviour to the relevant component or page.

## Eleventy
- Don’t duplicate already defined logic.
- Reuse existing collections, data files, and filters.
- Check if the content fits an existing collection before creating a new one.

## Verification
- Run the local build before finishing.
```

* * *

Wrapping up
-----------

I started using AI coding tools to free up time by avoiding repetitive tasks. AGENTS files define the rules the machine should follow, so I don’t have to also spend time editing its code to suit my style.

-   [Global AGENTS.md](https://gist.github.com/malarkey/0eb8aba779811d55ca9060ef2e371bb9)
-   [AGENTS.md project brief](https://gist.github.com/malarkey/3834149866c0dcd436ed14c84f411b2b)
