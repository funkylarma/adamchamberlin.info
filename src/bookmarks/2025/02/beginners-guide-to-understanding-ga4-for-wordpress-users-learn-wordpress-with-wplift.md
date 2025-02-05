---
date: 2025-02-05T07:58:59.627Z
title: Beginner’s Guide to Understanding GA4 for WordPress Users – Learn WordPress with WPLift
url: https://wplift.com/how-to-add-google-analytics-to-wordpress/
category: bookmark
hasCode: true
tags:
  - 'WordPress'
  - 'ga4'
---
https://wplift.com/how-to-add-google-analytics-to-wordpress/

__Archived Content__

```markdown
---
Title: Beginner's Guide to Understanding GA4 for WordPress Users
URL: https://wplift.com/how-to-add-google-analytics-to-wordpress/
Author: Team WPLift
Tags: ga4, work
---
```

_Have you ever wondered how people are finding your site, which of your pages has the most conversion rate, or which of your campaigns is bringing the most prospective customers? Well, you can measure all of these metrics and more using a simple web-based analytical tool:_ **_Google Analytics._**

If you’re looking for a detailed resource to learn about Google Analytics for WordPress websites, you’ve landed on the right page. In this beginner’s guide, we’ll explain what Google Analytics is, how to add Google Analytics to your WordPress websites, and how to use the metrics provided by Google Analytics to improve your website performance.

Here’s a table of contents if you’d like to jump to a particular section:

 * [What is Google Analytics](https://wplift.com/how-to-add-google-analytics-to-wordpress/#h-what-is-google-analytics)
 * [Google Analytics 4: Overview](https://wplift.com/how-to-add-google-analytics-to-wordpress/#h-google-analytics-4-overview)
 * [How to Set Up Google Analytics for WordPress](https://wplift.com/how-to-add-google-analytics-to-wordpress/#Understanding_Google_Analytics_Reports_Metrics_You_Can_Track)
 * [Method 1: Set Up Google Analytics With a WordPress Plugin](https://wplift.com/how-to-add-google-analytics-to-wordpress/#Method_1_Set_Up_Google_Analytics_With_a_WordPress_Plugin)
 * [Method 2: Set Up Google Analytics Without a WordPress Plugin [Manually]](https://wplift.com/how-to-add-google-analytics-to-wordpress/#Method_2_Set_Up_Google_Analytics_Without_a_WordPress_Plugin_Manually)
 * [Understanding Google Analytics Reports](https://wplift.com/how-to-add-google-analytics-to-wordpress/#Understanding_Google_Analytics_Reports_Metrics_You_Can_Track)

## What is Google Analytics?

Google Analytics is a FREE web analytics & tracking tool offered by Google. It helps you understand your site performance and user behavior based on a wide range of different metrics.

Let’s say you own an [online eCommerce store](https://wplift.com/beginners-guide-to-woocommerce) and want to know from which country your visitors are coming. With Google Analytics, you can see the complete demographics of your users.

This includes everything from,

 * where your buyers are coming from
 * which device they are using
 * the number of people visiting your website
 * how long visitors are spending on your website
 * which pages your visitors are visiting the most

to:

 * details about the products people have purchased
 * lucrative sources that are bringing traffic to your website
 * the total number of conversions

And much more…

Basically, Google Analytics helps you understand how your visitors behave on your site. And using that behavioral data, you can measure your marketing ROI, increase sales, boost revenue, and optimize SEO.

### Google Analytics 4: Overview

Google Analytics 4 is the next generation or the 4th iteration of Google Analytics. This updated version is specially designed to provide site owners with more accurate data reports, while also protecting users’ privacy.

The older version of Google Analytics or Universal Analytics will **stop collecting data in 2023**, as Google plans to sunset the older version of GA from 1 July 2023. So if you’ve created your Google Analytics property under UA, you need to switch it to GA 4 to continue its services.

You might be wondering what the exact purpose of GA 4 is.

Until now, there have been two different analytics platforms: **Google Analytics for Firebase** and **Google Analytics**. Google’s Firebase platform is for Apps, and its standard Analytics platform is for Web data.

Comparing and analyzing the data is much more difficult when companies have two different platforms. To make this process easier, Google Analytics 4 is introduced, a unified platform where site owners get all data in a single place.

The main difference between Google Analytics 4 and Universal Analytics is the measurement models both properties use to track the data. UA’s measurement model is based on **Sessions** and **Page Views**, whereas GA 4 uses a model based on **Events** and **Parameters.**

We will discuss the GA 4 measurement model in depth in our Google Analytics Report section.

Before that, take a look at the key Features of Google Analytics 4:

 * Collects both website and app data to help you better understand the customer journey
 * Replaces session-based data with event-based data
 * Cookies-free measurement, behavioral and conversion modeling, and other privacy controls are included

If you’re new to Google Analytics, you might be feeling overwhelmed by this extensive information. Well, worry not; we’ve got you covered!

In this post, we will explain everything about Google Analytics 4, helping you understand its integrating process with WordPress websites and analyze the reports & metrics to make the most of GA 4 features.

But before we proceed to the integration process, let’s first set up your Google Analytics account.

## How to set up a Google Analytics account

Google Analytics is a free-of-cost service. To get started, you simply need an active Gmail account.

### Step 1: Sign up or log in to your Google Analytics account.

First thing first, go to the official [Google Analytics website](https://marketingplatform.google.com/about/analytics/) and click on the **Sign in to Analytics** or **Get started today** button.

The next step is logging in to your Gmail account or creating a new one if needed.

Once you log in to your Gmail account, you’ll be prompted to the Google Analytics homepage.
Click on the **Start measuring** button.

### Step 2: Google Analytics Account Setup

You’ll need to enter the details on the next page to set up your Google Analytics account.

The first step is to name your account. This name will be used internally, so it can be anything similar to your company’s name or as per your preference.

Next, you get options to set your data-sharing preferences. Select the options you want or don’t want, then click **Next.**

### Step 3: Google Analytics Property Setup

In the next step, you need to add details to your Property setup.
Add your preferred Property name, and click on the **Next** button.

Google Analytics account registers with GA 4 property by default. However, if you want to create a Universal Property, you can do that too by clicking on the **Show advanced options.**

Once you click the option, you’ll be displayed with the required details to create a UA property.

### Step 4: Add your business details

Next you need to add your business details.

 * First, select your industry category.
 * Choose your Business size.
 * Select how you intend to use Google Analytics with your business.

Once you choose your preferred options, click on the **Create** button.

As soon as you click the button, a popup window will appear with the **Google Analytics Terms of Service Agreemen**t. If you agree, you’ll need to click the checkboxes and click on **I Accept.**


### Step 5: Create Google Analytics Webs Stream

Once you accept the terms and conditions, you’ll be redirected to your Google Analytics account and displayed with Webs stream options.
Click on the **Go to stream setup** button.

We will set up Google Analytics for a WordPress site, so let’s select **Web** as our platform.

Next, add your Website URL, Stream Name, and then click the **Create stream** button.

Here you’ll notice that the **Enhanced measurement** option is by default enabled. This option allows you to track measuring metrics such as Page views, Scrolls, Outbound clicks, Site search, Video engagement, and much more in Google Analytics.

On the next screen, you’ll be displayed with your **Stream URL, Stream ID, Measurement ID**, and **Enhanced Measurements.**

Here you’ll also find different ways to add Google Analytics tags to websites.

Now we need to add Google Analytics to your WordPress website..

## How to Add Google Analytics to WordPress

Before we dive deep into how Google Analytics works and what exact metrics you can track in your GA account, let’s cover how to set up Google Analytics for a WordPress website.

You can connect Google Analytics to your WordPress site using two methods:

 1. Installing the Google Analytics WordPress Plugin
 2. Manually add the Google Analytics tracking code directly to [your WordPress theme](https://wplift.com/wordpress-themes/).

Let us show you both methods so you can pick the one that suits you best.

### Method 1: Set Up Google Analytics With a WordPress Plugin

The easiest method to integrate Google Analytics with WordPress is using a Google Analytics WordPress plugin. Because this method saves your time and doesn’t require any heavy coding.

### Using the Site Kit Plugin by Google

[Site Kit](https://wordpress.org/plugins/google-site-kit/) is the official WordPress plugin from Google. It is a simple, user-friendly, and free plugin to integrate Google Analytics with your WordPress site.

### Step 1: Install & Activate the Site Kit Plugin by Google

To get started, go to your admin dashboard, search for the Site Kit plugin, and install & activate the plugin.

### Step 2: Set up the Site Kit Plugin.

Once the Site Kit plugin is activated, you’ll see a notification banner on your WordPress dashboard.
Click on the **Start setup** button.

Complete the start-up process by giving further permissions so that the GA has your site access.

As the last part of the [plugin installation process](https://wplift.com/beginners-guide-to-wordpress-plugins), you need to verify you’re the owner of the domain, turn on **Metrics**, set up **Search Console**, and set up **Google Analytics.**

And once you successfully add Google Analytics to your WordPress site using the Site Kit plugin, you’ll see a success banner on your WP dashboard.

Simultaneously, you’ll also be able to see your site metrics from Google Analytics directly in your WordPress dashboard.

To learn about the Site Kit functionality and features in detail, check out our review of the [Google Site Kit for WordPress](https://wplift.com/google-site-kit-for-wordpress).

Understanding site metrics directly in Google Analytics for a beginner is quite tricky; that’s why we recommend you use a dedicated WordPress Google Analytics plugin to get started because:

 * WordPress Google Analytics plugins provide easy-to-understand & interactive stats directly on your WordPress dashboard.
 * Allows you to set up Google Analytics without coding.
 * You can download your site reports directly from your WP dashboard; without leaving your website
 * You get all the important metrics in one place.

### Method 2: Set Up Google Analytics Without a WordPress Plugin [Manually]

In this option, we’ll look at manually adding the required tracking codes to your WordPress site, which is the most basic but also the most difficult to implement. It’s critical to utilize a WordPress child theme if you choose this route. Otherwise, every time you alter your theme, your Google Analytics code would be replaced.

After you’ve created a Google Analytics account, you’ll need to obtain a tracking code to post on your website.

### Getting the Google Analytics Tracking Code

The service will redirect you to the place where you can acquire the Google Analytics code once you’ve finished the enrollment procedure. If you wish to retrace your steps, here’s how to manually obtain your tracking code:

 * After logging into your Google Analytics account, go to the Admin menu in the bottom left corner.
 * Select the Tracking Info option from the drop-down menu. Then choose the Tracking Code option from the drop-down menu.
 * Your Tracking ID and Global Site Tag should now be visible. Both of these codes should be saved because we’ll need them later.

After you’ve acquired the tracking code, go to your WordPress dashboard to begin the configuration process.

### 1. functions.php is a PHP script

Using the code snippet, you may integrate Google Analytics to WordPress in a few different ways.

The functions.php file is the first place where you may enter the Google Analytics monitoring code. You make a new function with the code snippet in it.

NOTE: It’s a good idea to make a backup copy of the file before making any changes for safety reasons.

 * Navigate to the Theme Editor section of the Appearance menu on your WordPress dashboard.
 * From the right column, open the Theme Functions(functions.php) file.
 * In the file, paste the code snippet below. Remember to change the Tracking ID to your own.

```javascript
    add_action('wp_head','my_analytics', 20);
function my_analytics() {
?>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <    script         async         src    =    "    https://www.googletagmanager.com/gtag/js?id=UA-26575989-48    "    >    </    script    >
    <    script    >
  window    .    dataLayer     =     window    .    dataLayer     ||         [    ]    ;
      function         gtag    (    )    {    dataLayer    .    push    (    arguments    )    ;    }
      gtag    (    'js'    ,         new         Date    (    )    )    ;
      gtag    (    'config'    ,         'UA-26575989-48'    )    ;
    </    script    >
    <?php
    }
```

 * To save your changes, click the Update File button after you’re finished.
 * The Google Analytics tracking code can easily be added to the Theme Header (header.php) file.
 * Return to the Theme Editor and make any necessary changes.
 * On the right column, open the Theme Header (header.php) file.
 * Using the WordPress Theme Editor to edit the header.php file
 * Copy the code snippet and paste it in the header section, specifically above the /head> element.
 * To save your changes, click the Update File button after you’re finished.
 * Select Appearance, then Theme Editor from your WordPress dashboard.
 * If you try to change your theme, you will be warned. To proceed, choose I understand.
 * You may now put the Analytics code you copied before into the box. Make sure it’s above the /header> tag.
 * Click Update File and you’re done.

## Understanding Google Analytics Reports: Metrics You Can Track

Now that we’ve completed the integration process of Google Analytics into WordPress, it’s also important to understand how you can read Google Analytics reports so that you can leverage its features to their full potential.

### Dashboard of Google Analytics 4

Once your WordPress site connects to your Google Analytics account, the GA 4 dashboard looks like the screenshot below:

And once Analytics starts to receive your website data, the metrics appear in your analytics dashboard.

The Google Analytics dashboard consists of 5 main pages:

 1. Home
 2. Reports
 3. Explore
 4. Advertising
 5. Configure

Let’s see what you get in all sections:

### Home Page of Google Analytics

On the home page, you can see an overview of overall traffic of your website , recent users, recently accessed pages, conversions, and revenue.

The primary purpose of the home page is to provide quick access to important pages and give a complete overview of the analytical data.

### Reports Page of Google Analytics

This is the most important page of Google Analytics. Once you have set up Google Analytics, some of the data in your reports are automatically collected from your website and app, while other data require additional configuration.

### Reports snapshot

The first tab you see on the Reports page is **Reports snapshot.**

In the Reports Snapshot section, you’ll find the summary of all the reports within your Google Analytics.

### Realtime

Next tab you’ll see is **Realtime.** As the name says**,** this section displays the real-time activity of your users on your website that has happened within the last 30 minutes.

### Lifecycle

The Life Cycle report shows how users are acquired, engaged, monetized, and retained through the funnel.

Each section is divided into multiple sub-sections to give users detailed reports to understand how the content is performing in generating sales, engaging the audience, fetching organic traffic, and more.

Simply put, Life Cycle reports help you understand your website’s Conversion Funnel.

#### Acquisition

The Acquisition report provides you with detailed information on how people are finding your website and what drives them to [your website or app](https://wplift.com/best-wordpress-to-app-plugins).

Acquisition report is further divided into 3 three subsections:

 * Acquisition Overview
 * User acquisition
 * Traffic acquisition.

The **Acquisition overview** sub-section gives you a complete overview of acquisition metrics.

You can discover how new users find your website or app by looking at the **User acquisition** report.

The **Traffic acquisition** report lets you understand what brought new and returning users to your website or app.

#### Engagement

The Engagement report includes different subsections that help you learn how much time a group of visitors spend on your site or how well your site’s content [engages your audience](https://wplift.com/tips-creating-engaging-content).

 * **Engagement overview** – Gives you a complete overview of the Engagement reports.
 * **Events** – The Events report shows you information about what people are doing on your website or app.
 * **Conversion** – The conversion report provides information about your site visitors’ conversion actions. You can analyze data to determine why people aren’t converting, how much revenue is associated with each conversion action, etc.
 * **Pages and screens** – In the Pages and Screens report, you can see which of your site pages and which of your mobile app screens people visit and interact with.
 * **Landing Page** – The Landing page report shows you the first pages visitors landed on when they visited your website.

GA4 also includes user reports on demographics and technology that tell you from which region your visitors are coming, which device they use to navigate your website and more.

There are also other report types that help you understand more about your site audience. You can explore each section and learn more about your site content performance and existing content.

### Wrapping Up!

If you’re a beginner, we suggest that before investing in premium tools, you should start with free analytics tools such as Google Analytics to understand your audience’s behavior and update your site.

If you find Google Analytics more complicated, you can also check out our post on the [best Google Analytics alternative](https://wplift.com/google-analytics-alternative) for more options.

Also, learn [how to track outbound links on WordPress with Google Analytics events.](https://wplift.com/track-outbound-links-wordpress)
