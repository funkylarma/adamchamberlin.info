---
title: "How Many Fonts..."
date: "2008-02-26"
categories: 
  - "writing"
cover: "./src/images/image-not-found.png"
slug: "how-many-fonts"
---

[Jon Hicks](http://www.hicksdesign.co.uk/) has been ’[fiddling](http://www.hicksdesign.co.uk/journal/fiddling)’ with his site; his words not mine. If you take a visit over there you might notice some good looking heading tags. Or you might not. Why is that? Jon has decided to target specific fonts in the CSS. Normally when declaring fonts in a tag you would go some thing along the lines of a couple of system fonts and then a font family: body { font-family: “Arial Black”, “Helvectica Bold”, sans-serif } But Jon has broken the mold (again) and selected some fonts that are not present on your standard OS installation. Have a look (sorry Jon I’ve just copied your code)

```
body { font-family: "P22 Underground Pro", "P22 Johnston Underground", "P22 Underground", "Gill Sans", "Gill Sans MT", GillSans, Helvetica, Arial, sans-serif; }
```

As you can see the first three fonts are definitely not an [OS standard](http://www.ampsoft.net/webdesign-l/WindowsMacFonts.html). This in my mind is a brilliant substitute to font replacement hacks and tricks. But how far do you go to catch everyone and every font type. Luckily for me I got to view the site from a machine with P22 Underground installed. But after a quick trip to Font Explorer I de-activated the font and presto; Gill Sans! Whilst you could get carried away with this and apply different fonts to all manor of tags and elements, what effect will it have on your page loading and the load on the CSS file?
