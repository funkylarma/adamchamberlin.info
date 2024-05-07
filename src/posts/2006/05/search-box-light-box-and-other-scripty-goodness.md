---
title: "Search box, Light Box and other Scripty goodness"
date: "2006-05-13"
categories: 
  - "writing"
coverImage: "./src/images/image-not-found.png"
slug: "search-box-light-box-and-other-scripty-goodness"
---

I’ve been working away at those extra little bits on the site, you know all that fluff that makes you feel good about the amount of time you spend sitting in front of a computer screen.

The latest installments apart from some style changes are the use of the various [script.aculo.us](http://script.aculo.us/) Java scripts. First off we have the new AJAX powered search bar found on the home page, in the archives and on any 404. The second is the use of [Lightbox](http://www.huddletogether.com/projects/lightbox2/) for displaying photograph’s and images from within posts.  
I have [always](http://www.shibbyonline.co.uk/2005/11/30/ajaxy-sidebar-menu-options/) enjoyed using the script.aculo.us libraries for various effects but since moving themes around I sort of missed the boat when it came to the whole Lightbox revolution that appears to have taken the web by storm.

My problem was that I did want to find a way to display images in a way that kept a small clean image in the post but would allow the reader to see a larger version without directing them to an external source such as my [Flickr](http://www.flickr.com/photos/funkylarma/) account. I’m afraid that at present [Lightbox](http://www.huddletogether.com/projects/lightbox2/) is the perfect answer, of course I could have followed [Derek’s](http://5thirtyone.com/archives/233) comments and tried [Thickbox](http://codylindley.com/Javascript/257/thickbox-one-box-to-rule-them-all) which runs off the more streamlined compressed [jquery](http://jquery.com/) script. But when I’m already loading part of the script.aculo.us for the search bar it makes no sense to load another library to save space. Besides which due to my limited readership, bandwidth or page load is not a concern, I’m not exactly digg material!  

### Installing Lightbox…

[![Wet dog](/images/14181952_cc24c994d7_m.jpg)](http://www.flickr.com/photos/funkylarma/14181952/ "Photo Sharing")The installation of [Lightbox](http://www.huddletogether.com/projects/lightbox2/) was very simple really, first off download the files required from [Lokesh’s](http://www.huddletogether.com/) site, you do get the required script.aculo.us files in there but it might be worth while checking the site for [updates](http://script.aculo.us/downloads).  
Upload the Javascript files to your web host, I’m presuming you will keep them in the folder named js and this in your template/theme folder, such as; /wp-content/themes/k2/js/\*.js  
Next you need to add these to your header file to have them called on the loading of the page. Open up your required page, if your using [WordPress](http://www.wordpress.org) like me here then you want header.php in your theme directory. Now locate the head tags and insert this code between them:

`<script type="text/javascript" src=""<?php bloginfo('template_directory'); ?>/js/prototype.js"></script>   <script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/scriptaculous.js?load=effects"></script>   <script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/lightbox.js"></script>`

This will call the scripts on each page as it loads, the need for the php call to the template directory is because due to url rewriting the location of the Javascripts would need to be modified on each call, this way we know the files are in the template directory.  
The final part is to add some CSS styling and images to the mix, in the zip file from Lokesh you should find a file called lightbox.css. and a folder containing some images.  
With the CSS file, you can either call this file directly from the header as before or add it to your current CSS sheet. As I am calling this feature on every page and I like to have everything on the same place I’ve added all the styles in lightbox.css to my standard style.css of the current theme.  
The process with the images is very similar, I opted to add them to my images folder of my theme, least they are all in the same place. You will need to check the CSS file and just make sure that the path’s to the images are correct. Now upload these files and we are ready to test.

To create one of these clever tricks is very simple, just add a addition tag to your href link to the image and you are away. If you take the example above, as standard clicking on the image would open the image on it’s own and the code to do so would be:

`<a href="http://www.flickr.com/photos/funkylarma/14181952/" title="Wet Dog"><img src="http://static.flickr.com/11/14181952_cc24c994d7_m.jpg" alt="Wet dog" /></a>`

All we need to do to make it open in the lightox is add the code `rel="lightbox"` to the href link creating this:

`<a href="http://www.flickr.com/photos/funkylarma/14181952/" title="Wet Dog" rel="lightbox"><img src="http://static.flickr.com/11/14181952_cc24c994d7_m.jpg" alt="Wet dog" /></a>`

Now when you click the the image it will open in the lightbox, you can also create text links that open images in the lightbox, just add that rel tag to the link and your away.

So whats’s this your having problems? As mich as every one claims life is never that simple, there will always be a few problems. If you are experiencing some problems first off make sure your page is calling the Javascript correctly. The best way to do this is to load your page then so a view source, check that in the head the script files are being called. If not then you have to make sure that you have the right url to the files, and that they have been uploaded correctly!  
The problem I had which took a while to work out was that I was never getting a close button when the picture had loaded. There was a hotspot at the bottom of the page but nothing to indicate that was the close button. It turns out that this information is held within the lightbox java file itself. To fix it you have to open up the file lightbox.js and modify lines 62 and 63. 
When looking at these lines you can see the idea, they are links to the loading and close buttons, if like me you added these to your standard themes images then you know where they are, if not you will have to locate them. The downside is that the handy php call to themplate path will not work here, we are inside Java people, it must a complete url. Modify the lines as follows:

`var fileLoadingImage = "http://www.yourdomain.com/wp-content/themes/theme/images/loading.gif";   var fileBottomNavCloseImage = "http://www.yourdomain.com/wp-content/themes/theme/images/closelabel.gif";`

Of course replace yourdomain with _yourdomain_ and theme with the name of your theme. Hopfully this will then give you your loading and close buttons as required.

### The search bar…

The search bar was created following the [instructions](http://orderedlist.com/articles/howto-animated-live-search/) of Steve at [OrderedList](http://orderedlist.com/). View a demo [here](http://orderedlist.com/demos/livesearch/).
