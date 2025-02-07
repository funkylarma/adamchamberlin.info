---
date: 2025-02-05
title: The Many Purposes of Timeline Apps for the Open Web
url: https://www.macstories.net/stories/the-many-purposes-of-timeline-apps-for-the-open-web/
canonical: https://www.macstories.net/stories/the-many-purposes-of-timeline-apps-for-the-open-web/
author: MacStories
category: like
tags:
  - Reeder
---

![Tapestry (left) and Reeder.](https://cdn.macstories.net/wednesday-05-feb-2025-03-12-44-1738721567692.png)

Tapestry (left) and Reeder.

[Writing at The Verge](https://www.theverge.com/apps/605756/tapestry-reeder-surf-timeline-apps) following the release of The Iconfactory’s new app [Tapestry](https://usetapestry.com), David Pierce perfectly encapsulates how I feel about the idea of “timeline apps” (a name that I’m _totally_ going to steal, thanks David):

> ⁠⁠What I like even more, though, is the idea behind Tapestry. There’s actually a whole genre of apps like this one, which I’ve taken to calling “timeline apps.” So far, in addition to Tapestry, there’s [Reeder](https://reederapp.com/), [Unread](https://www.goldenhillsoftware.com/unread/), [Feeeed](https://feeeed.nateparrott.com/), [Surf](https://surf.social/), and a few others. They all have slightly different interface and feature ideas, but they all have the same basic premise: that pretty much everything on the internet is just feeds. And that you might want a better place to read them.⁠⁠
> \[…\]
> These apps can also take some getting used to. If you’re coming from an RSS reader, where everything has the same format — headline, image, intro, link — a timeline app will look hopelessly chaotic. If you’re coming from social, where everything moves impossibly fast and there’s more to see every time you pull to refresh, the timeline you curate is guaranteed to feel boring by comparison.⁠⁠

I have a somewhat peculiar stance on this new breed of timeline apps, and since I’ve never written about them on MacStories before, allow me to clarify and share some recent developments in my workflow while I’m at it.

I think both [Tapestry](https://apps.apple.com/us/app/tapestry-by-iconfactory/id6448078074) and the new [Reeder](https://apps.apple.com/us/app/reeder/id6475002485) are exquisitely designed apps, for different reasons. I know that Tapestry’s colorful and opinionated design doesn’t work for everyone; personally, I dig the different colors for each connected service, am a big fan the ‘Mini’ layout, and appreciate the multiple font options available. Most of all, however, I _love_ that Tapestry can be extended with [custom connectors](https://github.com/TheIconfactory/Tapestry?tab=readme-ov-file) built with standard web technologies – JavaScript and JSON – so that anyone who produces anything on the web can be connected to Tapestry. (The fact that MacStories’ [own JSON feed](https://www.macstories.net/feed/json) is a default recommended source in Tapestry is just icing on the cake.) And did you know that The Iconfactory also [created a developer tool](https://apps.apple.com/us/app/tapestry-loom/id6578414736?mt=12) to make your own Tapestry connectors?

I like the new Reeder for different reasons. The app’s animations are [classic](https://www.macstories.net/iphone/reeder-the-new-best-rss-reader-for-iphone/) Silvio Rizzi work – fluid and smooth like nothing else on iOS and iPadOS. In my experience, the app has maintained impeccable timeline sync, and just this week, it was updated with powerful new filtering capabilities, enabling the creation of saved searches for any source within the app. (More on this below.)

My problem with timeline apps is that I struggle to understand their pitch as alternatives to browsing Mastodon and Bluesky (supported by both Tapestry and Reeder) when they don’t support key functionalities of those services such as posting, replying, reposting, or marking items as favorites.

Maybe it’s just me, but when I’m using a social media app, ￼I want to have access to its full feature set and be able to respond to people or interact with posts. I want to browse my custom Bluesky feeds or post a Mastodon poll if I want to. Instead, both Tapestry and Reeder act as glorified readers for those social timelines. And I understand that perhaps that’s _exactly_ what some people want! But until these apps can tap into Mastodon and Bluesky (and/or their [decentralized](https://en.wikipedia.org/wiki/ActivityPub) [protocols](https://atproto.com)) to support **interactions**￼ in addition to reading, I’d rather just use the main social media apps (or clients like [Ivory](https://apps.apple.com/us/app/ivory-for-mastodon-by-tapbots/id6444602274)).[1](#fn-77770-Skybot) To an extent, the same applies for Reddit: if neither of these apps allow me to browse an entire subreddit or sort its posts by different criteria, what’s the point?

But: the beauty of the open web and the approach embraced by Tapestry and Reeder is that there are plenty of potential use cases to satisfy everyone. Crucially, this includes people who are not like me. There is no one-size-fits-all approach here because _the web isn’t built like that_.

So, while I still haven’t decided which of these two apps I’m going to use yet, I’ve found my own way to take advantage of timeline apps: I like to use them as specialized feeds for timelines that I don’t want to (or can’t) have in my RSS reader or add as lists to Mastodon/Bluesky.

For instance, I created a custom MacStories timeline in Tapestry with feeds for all kinds of places on the web where MacStories publishes content or social media posts. I love how Tapestry brings everything together in a unified, colorful timeline that I can use alongside my RSS and social apps to see all sorts of posts by our company.

![The colors!](https://cdn.macstories.net/wednesday-05-feb-2025-03-12-08-1738721532442.png)

The colors!

Reeder’s latest addition is also something I’m considering at the moment. The app can now create saved filters, which are based on multiple filtering conditions. These rules can be stacked to create custom views that aggregate specific subsets of posts from sources that, typically, would be their own silos. Want to create an “AI” feed that cuts through RSS, Bluesky, YouTube, and Reddit to find you the latest AI news or products by keyword? How about a filter to show only YouTube videos that mention Nintendo? All of this (and more) is possible with Reeder’s latest update, with an interface that…I’ll just let the screenshots speak for themselves.

![Silvio Rizzi's design taste never disappoints.](https://cdn.macstories.net/wednesday-05-feb-2025-03-11-17-1738721481711.png)

Silvio Rizzi’s design taste never disappoints.

Which leads me back to my main point. I feel like thinking about this new generation of apps as social media clients would be wrong and shortsighted; it reduces the scope of what they’re trying to accomplish down to a mere copy of a social media timeline. Instead, I think Tapestry and Reeder are coming at this from two different angles ([Tapestry](https://apps.apple.com/us/app/tapestry-by-iconfactory/id6448078074) with better developer tools; [Reeder](https://apps.apple.com/us/app/reeder/id6475002485) with superior user filters), but with the same larger ambition nonetheless: to embrace the open nature of the Web and move past closed platforms that feel increasingly archaic today.

The fact that I can make a timeline out of anything doesn’t mean that Tapestry or Reeder have to be my everything-timelines. It means that the modern web lets me _choose_ what I want to see in these apps. I can’t help but feel that there’s something special about that we must protect.

* * *

1.  Speaking of which: are the folks at Tapbots [considering](https://bsky.app/profile/paul.tapbots.com) a Bluesky client? [↩︎](#fnref-77770-Skybot)

* * *

### Access Extra Content and Perks

Founded in 2015, [Club MacStories](https://club.macstories.net/plans?utm_source=ms&utm_medium=web-inline) has delivered exclusive content every week for nearly a decade.

What started with weekly and monthly email newsletters has blossomed into [a family of memberships](https://club.macstories.net/plans?utm_source=ms&utm_medium=web-inline) designed every MacStories fan.

**[Club MacStories](https://club.macstories.net/plans/club)**: Weekly and monthly newsletters via email and the web that are brimming with apps, tips, automation workflows, longform writing, early access to the [MacStories Unwind podcast](https://www.macstories.net/unwind/), periodic giveaways, and more;

**[Club MacStories+](https://club.macstories.net/plans/plus)**: Everything that Club MacStories offers, plus an active Discord community, advanced search and custom RSS features for exploring the Club’s entire back catalog, bonus columns, and dozens of app discounts;

**[Club Premier](https://club.macstories.net/plans/premier)**: All of the above _and_ AppStories+, an extended version of our flagship podcast that’s delivered early, ad-free, and in high-bitrate audio.

Learn more [here](https://club.macstories.net/plans?utm_source=ms&utm_medium=web-inline) and from our [Club FAQs](https://club.macstories.net/faq).

[Join Now](https://club.macstories.net/?utm_source=ms&utm_medium=rss)
