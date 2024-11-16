---
title: "AJAXy sidebar menu options"
date: "2005-11-30"
categories: 
  - "writing"
tags:
- "WordPress"
- "javascript"
- "frameworks"
slug: "ajaxy-sidebar-menu-options"
---

On the [Binary Bonsai][1] forums it has been [asked][2] how I got those Java powered AJAXy looking features in my sidebar, I’ve also had a few emails about them so I thought I better write the code and share the knowledge. Here goes:  
It is a java script that creates a visual effect, you can also chuck some ajax inspired calls in there too but I opted for just creating the blind effect. The code and javascripts can be found at [script.aculo.us][3]. If you are using K2 then chances are you already have the scripts installed, check your **/js** folder in the K2 theme directory. These scripts are called for in header.php I have found that in r118 they are no longer called by default, previous r96 versions did call the scripts and it also depends on ajax commenting, to be on the safe side I added the following lines to the header.php around line 39
  
`<script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/prototype.js"></script>   <script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/effects.js"></script>`  

Thats the scripts sorted now the page styling. You call the script using a `<a href>` link with the varables for the java in there. 
Here’s the code I used to make the Del.ici.ous menu in my sidebar:
  
`<?php if ((function_exists('delicious')) && is_home() && !(is_paged()) ) { $k2deliciousname = get_option('k2deliciousname'); ?>   <div class="sb-delicious"><h2><a href="https://del.icio.us/<?php echo $k2deliciousname; ?>" title="My del.icio.us links library">Del.icio.us</a></h2><span class="metalink"><a href="#" onclick="Effect.BlindDown('deli');; return false;">Open</a></span>   <div id="deli" style="display:none;"><ul>   <span class="metalink"><a href="https://del.icio.us/rss/<?php echo $k2deliciousname; ?>" title="RSS Feed for del.icio.us links">Connect to RSS feed</a></span>   <div><?php delicious($k2deliciousname); ?></div>   </ul><span class="metalink"><a href="#" onclick="Effect.BlindUp('deli');; return false;">Close Del.icio.us</a></span>   </div>   </div>`  

The first part is the standard section of the K2 sidebar, it checks for the delicious plugin and name and would display your links. But the link to # is the clever part, you see it calls the Effect.BlindDown with a variable of _deli_ (delicious if you want) This variable is a div tag, you can see this tag next, making the style display none means the page will not show as standard, if you wanted the panel open by default remove this tag.
  
Clicking on the link runs the script which in my case does the blind down effect on the div tag which then shows the delicious links, remember to put an extra closing div at the end or a close link if you want which would call the Effect.BlindUp script.  
At present I’ve only used this on the one section but if you spend the time looking through the [script.aculo.us][4] site and testing the various other effects I’m sure it will open up a world of ideas and inspiration and as this only runs from a div tag you could add this to nearly any section of a metadata.  
_Thanks to Paul and Ka-Meng for helping me sort out the display of code._

[1]:	https://flickr.com/groups/binarybonsai/discuss/
[2]:	https://flickr.com/groups/binarybonsai/discuss/129663/
[3]:	https://script.aculo.us/
[4]:	https://script.aculo.us/