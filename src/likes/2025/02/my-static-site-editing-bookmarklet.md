---
date: 2025-02-16
title: My static site editing bookmarklet
url: https://jamesg.blog/2025/02/16/my-static-site-editing-bookmarklet/
canonical: https://jamesg.blog/2025/02/16/my-static-site-editing-bookmarklet/
author: James' Coffee Blog
category: like
tags:
  - Feedbin
---


I have a bookmarklet called “Edit” in my browser bookmarks bar. This bookmarklet [1](https://jamesg.blog/longform-feed#1) lets me do three things.

First, if I am on a page that returns a 404, the bookmarklet, when clicked, opens a blank GitHub document with the same file name as the path I am viewing. For example, `/bakery` would open a GitHub URL to create a new page called `bakery.html` in the folder in which I keep static HTML files on my website. This file automatically includes the front matter header I need to create new pages. In this example, the following front matter would be added to the file:

\---
layout: default
title: bakery
permalink: /bakery/
---

I can then edit the file to add text, then click “Commit” to add the file to my project GitHub. This then starts the action that builds my static website. This can work because GitHub has a `?filename` and `&value=` argument you can pass to pre-populate the editor for a file that doesn’t exist with content.

With this setup, I can add new pages to my site with the right markup without having to open my code editor.

If I am on a page that already exists and matches the pattern `/something`, the bookmarklet opens the corresponding HTML file for the page in GitHub. This lets me directly edit a page without having to find the location of the page. This works because most of my static files are named after the paths they take (i.e. `/bakery` would be in a file called `/bakery.html`). [2](https://jamesg.blog/longform-feed#2) I use this functionality to edit a lot of the wiki-style pages on this website, like `/fonts`.

If I am on a blog post page (i.e. `/2025/02/14/tell-us-something-good`), the blog post page is opened in GitHub. I use this a lot to fix typos or formatting issues I notice once a blog post is live.

If I am on a page that doesn’t match any of the rules, the bookmarklet tells me that it can’t do anything.

Here is what the bookmarklet looks like:

javascript: (function() {
    var url \= window.location.href;
    var githubUrl \= "https://github.com/capjamesg/jamesg.blog/";
    var exampleMatch \= url.match(/https:\\/\\/jamesg\\.blog\\/(\[^\\/\]+)/);
    if (exampleMatch) {
        var example \= exampleMatch\[1\];
        var filename \= \`${encodeURIComponent(example)}.html\`;
        var value \= \`---\\nlayout: default\\ntitle: ${example}\\npermalink: /${example}/\\n---\\n\\n\`;
        var value \= encodeURIComponent(value);
        if (document.body.innerText.includes("Page Not Found")) {
            var githubCreateUrl \= \`${githubUrl}/new/main/pages/templates?filename=${filename}&value=${value}\`;
            window.open(githubCreateUrl, "\_blank");
            return;
        }
        var githubEditUrl \= \`${githubUrl}/edit/main/pages/templates/${filename}\`;
        window.open(githubEditUrl, "\_blank");
        return;
    }
    var postMatch \= url.match(/https:\\/\\/jamesg\\.blog\\/(\\d{4})\\/(\\d{2})\\/(\\d{2})\\/(.+)\\//, );
    if (postMatch) {
        var year \= postMatch\[1\];
        var month \= postMatch\[2\];
        var day \= postMatch\[3\];
        var slug \= postMatch\[4\];
        var postEditUrl \= \`${githubUrl}/edit/main/pages/posts/${year}\-${month}\-${day}\-${slug}.md\`;
        window.open(githubUrl, "\_blank");
        return;
    }
    alert("URL format is incorrect or not supported.");
})();

To use this bookmarklet for your own site, you will need to make a few changes:

1.  Replace `jamesg.blog` with your domain name in the `exampleMatch` regex.
2.  Replace `githubUrl` with the name of the repository your site is stored in.
3.  Replace the `value` template with the front matter you need for a new page, or whatever content you want to add to a blank page.
4.  Replace the “Page Not Found” text with a message you display on 404 pages.

My post editing regex takes a URL like `https://jamesg.blog/2025/02/14/tell-us-something-good` and gets the information I need to make the structure `https://github.com/capjamesg/jamesg.blog/edit/main/pages/posts/YYYY-MM-DD-SLUG.md`. These match the URL conventions on my site.

If you want to use the post editing part, you will also need to:

1.  Replace the `githubEditUrl` folder (in my example `pages/templates`) with the folder where you keep your HTML files.
2.  Replace the `postMatch` regex with a regex that follows your file structure.
3.  Replace the `postEditUrl` with the path where you keep your pages and posts.

You can also delete the `postMatch` part if you don’t need the post editor.

I use this bookmarklet regularly for editing my website. It is convenient to have the ability to create new files or edit files on my static site with a click rather than having to find the right folder in my code editor to make a change. The post editing feature is especially useful for making quick changes to posts I just published. To edit a post, I can go to the post in my browser, click the “Edit” bookmarklet, then edit my site.

This bookmarklet is in the same category of tooling as [Create](https://jamesg.blog/create/), the static HTML file I use to format blog posts. Create formats a URL in a similar structure to the one in the bookmarklet above so I can easily create new blog posts from a static web page. I am intrigued by what other tools I can make to improve the user experience of editing static websites.

1

You can learn more about bookmarklets at https://indieweb.org/bookmarklets

[\[↩\]](https://jamesg.blog/longform-feed#f-1)

2

This doesn’t work if a page has a custom permalink different than the filename, but this isn’t common in my setup.

[\[↩\]](https://jamesg.blog/longform-feed#f-2)
