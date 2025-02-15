---
title: "Living with Mint"
date: "2005-10-24"
category: article
tags:
- "mint"
- "analytics"
- "updates"
slug: "living-with-mint"
---

As some may know the other week [I installed Mint](https://adamchamberlin.info/2005/10/got-minted/), a little web stats application from Shaun Inman.
Well a week on, how does Mint taste? Did it leave a breath of freshness or loose its taste just way too quickly?

Sorry but how many mint related wise cracks can you get before it all turns sour?
[Paul Stamatiou](https://www.paulstamatiou.com/2005/10/12/mint-appreciation-day/) has done a very useful run down of the application with a list of handy Peppers.

The basic requirements for an installation of Mint are php support and a MySql database, oh yes and visitors must have JavaScript enabled on their browsers or it won’t work!

The installation is quite simple really and to make it even easier Shaun has created a wonderful little app that checks your web server for compatibility so you can be sure before you sign up and fork out the charge. Whilst this does NOT ensure Mint will work it does provide a nice chunk of reassurance. For me this process went off without a hitch, php was detected and connection to the MySql database was successful. This process basically tests the database connection my creating a dummy database and writing a entry to it, you must input your connection details; username, password, database name and server, don’t worry it does tidy up after itself.

Once completed I decided to bite the bullet and purchase Mint, payment is by Pay Pal but all major credit cards are taken so I was in luck. Within minutes of placing my order and email arrived with the account information for me to log in and download my copy. Once downloaded you just modify the config file (/lib/configuration.php) with your details, not too taxing just the usual database connection details and the domain name to be monitored, make sure you use the same one as you specified in your purchase, Im not sure if or how it checks but I guess they must be the same. Then just upload all files to your web server and open the install file in a browser, hopefully everything will work and you will be presented with a message about including a line of code in the header of your web pages. This line is how the magic really happens, ok not so much magic just a JavaScript that runs and logs the visit, hence the need for JavaScript to be enabled. If you have got this far adding a line of code to your web pages should not be too difficult, dont worry if missed the message you can view it again from the Mint admin page.

The main page is the lovely little refuge were you can see all the various details of your site, all displayed in subtle shades of grey and green (mint I guess) for me the interface is a very pleasant place and really makes viewing site statistics a bit more interesting. To access your ‘mint’ page just point your browser to yourdomain.com/mint/ and log in using your chosen name (email address) and password. From here you can see the default information panes and statistics, clicking on the Preferences link at the top takes you to the Mint configuration section. This page allows you to select the name of your site and the local time, the order of the information panes or if they display at all and install new Peppers. As standard Mint comes bundled with a Pepper called User Agent 007, which detects and displays the visitors browser and platform, along with screen resolution and Flash player version. To install a new Pepper, check on the Mint [forums](https://haveamint.com/forum/) for up to date information and new releases, you download the required peppers and extract to the Pepper folder within Mint. Upload the new files, which are normally within a folder named after their creator, interesting, and then log into your admin/config page. You should now see an extra link under the Pepper section, which is cleverly entitled install pepper; genius I tell you! Install and tinker, each Pepper normally comes with its own configuration page which available by clicking the Pepper name at the top of the Pepper pane.

Looking back at a weeks worth of Mint there is only one question that really needs to be asked; is it worth the $30? Well at the time the $30 turned into £17 and to me, yes it is. I lose that much when I go out, I either drink too much or have a nasty hole in the pocket. The cost of the application yes is steep for what it is and what it does but compared to the Webalizer pages I used to use it is well worth the investment. Ok it will not catch everyone, those users who do not have JavaScript enabled which according to recent results is not a lot but for the whole look and feel I can live with this. I think that it is more of a image thing really, if you add into the whole scheme the new Mint Dashboard widget for Tiger and I’m sorry but I’m sold. Every morning it is now a case of cup of tea, open Mail and check the Mint widget whilst waiting. The only problem I can see happening is the fact that you become so lost in the stats and the look that you forget the purpose of the application, which is…. well to do, actually less, than what Webalizer did for me, for free!

If I had to put a bottom line on the Mint style I would compare it to an iPod: There are plenty of other, cheaper machines out there (I’m not entering the iPod/iTunes combo here) that do just a good job if not better but the one to be seen using and telling your mates is the iPod.
