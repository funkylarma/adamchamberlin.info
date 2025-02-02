---
title: User Guide
subhead: Just in case I forget how to use my own site
description: This is a handy guide to remind me how to use my site
noindex: true
permalink: /guide/
---

## General Information
Full details of the site technology can be found at the [colophon](/colophon) page.

## File Structure
All user created content resides in a folder named __/src/__.
The posts and content are generated from Markdown files. Each content type is then stored with a associated folder beneath that. Most posts are then further organised within a __/yyyy/mm/__ folder format. The filename uses a slugified style title to ensure it works within a url context.

## Content Types
The content within the site can be broken down into the following types. Where possible I have tried to follow a microformat based vocabulary. The definition of a category type in the frontmatter of each post is used to create the archives and general listing formats.

### Articles
Articles are the long form content. The archive can be found here.

```markdown
---
date: 2025-01-01
title: Article title
subhead: The subhead of the page
description: Used to populate the meta description
noindex: false
cover: /images/file.jpg
category: article
tags:
  - tag1
---
```

### Notes
Notes a quick short form content.

```markdown
---
date: 2025-01-01
title: Just a note
description: Used to populate the meta description
noindex: false
category: note
tags:
  - tag1
---
```

### Bookmarks
Bookmarks are links to other content on the internet. They can either be a direct link or an archive of the link if it is of value. If the note has a __title__ then it is presumed to be a bookmark that is to be archived.

```markdown
---
date: 2025-01-01
title: Page title
description: Used to populate the meta description
link: /the/link/to/the/page/
category: bookmark
tags:
  - tag1
---
```

### Checkins
A location based note, normally populated from my Swarm account.

```markdown
---
date: 2011-12-01T08:33:46.000Z
title: Name of place
description: Used to populate the meta description
latitude: 51
longitude: 1
category: checkin
tags:
  - tag1
---
```

### Exercise
Exercise notes can be defined by two categories; __exercise__ or __race__. Within each note the sport is specified, such as __running__ or __cycling__ along with any metrics related to the exercise activity. This is normally created as part of the fit file processing and an associated [geojson](#geojson) file is created.

```markdown
---
date: 2024-06-01T19:05:03.000Z
title: Norfolk100
description: Used to populate the meta description
latitude: 51
longitude: 51
sport: running
distance: 102.126
time: 48897.051
avgSpeed: 7.5204
maxSpeed: 11.808
avgHr: 136
maxHr: 170
avgCadence: 75
maxCadence: 98
avgPower: 152
maxPower: 322
calories: 6321
geojson: /geojson/link/
category: race
tags:
  - running
---
```

### Geojson
These files are not directly processed or rendered. They are included within a location based activity and used to render a gpx track through the Mapbox API.

### Likes
Likes are links to articles or content that have particular interest.

```markdown
---
date: 2025-01-01
title: The title
link: /the/link/to/like/
category: like
---
```

### Photos
Photos are image related posts.

```markdown
---
date: 2025-01-01
title: A photo
description: Used to populate the meta description
noindex: false
category: photo
tags:
  - tag1
---
```

### Replies
Replies or comments are notes that are a direct response to another post.

```markdown
---
date: 2025-01-21
title: Who am I replying to
description: Used to populate the meta description
link: /the/link/to/the/article/
category: reply
tags:
  - tag1
---
```

### RSVPs
RSVP's are a note form that are used to express interest in an event. They can contain the rsvp status of __yes__, __no__, __maybe__ and __interested__. The styling and wording of this is formatted by the note template

```markdown
---
title: Title of the event
date: 2025-01-01
category: rsvp
rsvp: interested
link: /the/link/to/the/event/
tags:
- IndieWeb
---
```

### Signups
Signups are not a strict Indieweb note format but I am using them as a means of cataloging any events I sign up to, mainly related to exercise or racing. The signup will have a __start__ date of the event, a __link__ to the event page and a possible __location__ in text form.

```markdown
---
date: 2025-01-10
title: The event I'm signing up to
description: A description about the event
start: 2025-06-07
location:
link: /the/link/to/the/event/
category: signup
tags:
  - tag1
---
```

### Videos
Videos are related to video content that I have created. External video content could be listed under likes or bookmarks.

```markdown
---
date: 2025-01-01
title: The title
description: A description about the event
cover: /images/file.jpg
category: videography
tags:
  - tag1
---
```

## Content
The content is written in Markdown format, which allows me to create content in a variety of applications and text editors. The use of a yaml based frontmatter format for each post will ensure the future proof of all content.

### Callouts
Use these in content to call out user actions or content revisions.

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
