import "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.umd.js";

/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */
CookieConsent.run({
  cookie: {
    name: "ac_cookie",
  },
  guiOptions: {
    consentModal: {
      layout: "cloud inline",
      position: "bottom center",
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      position: "right",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      enabled: true, // this category is enabled by default
      readOnly: true, // this category cannot be disabled
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^_ga/, // regex: match all cookies starting with '_ga'
          },
          {
            name: "_gid", // string: exact cookie name
          },
        ],
      },
      services: {
        ga4: {
          label: "Google Analytics 4",
        },
      },
    },
  },
  language: {
    default: "en",
    translations: {
      en: {
        consentModal: {
          title: "Do you like cookies?",
          description:
            "We all love cookies but not these one's, these are the boring type.",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage Individual preferences",
        },
        preferencesModal: {
          title: "Manage cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Accept current selection",
          closeIconLabel: "Close modal",
          sections: [
            {
              title: "Did somebody say... cookies?",
              description: "I want one!",
            },
            {
              title: "Strictly Necessary cookies",
              description:
                "These cookies are essential for the proper functioning of the website and cannot be disabled.",
              linkedCategory: "necessary",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Service",
                  description: "Description",
                  expiration: "Expiration",
                },
                body: [
                  {
                    name: "ac_cookie",
                    domain: "Adam Chamberlin",
                    description: "Set to remember your cookie choice",
                    expiration: "Expires after 182 days",
                  },
                ],
              },
            },
            {
              title: "Performance and Analytics",
              description:
                'These cookies collect information about how you use my website. All of the data is anonymized and cannot be used to identify you. Find out more on the <a href="https://cookiedatabase.org/service/google-analytics/">Cookie Database</a>',
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Service",
                  description: "Description",
                  expiration: "Expiration",
                },
                body: [
                  {
                    name: "_ga",
                    domain: "Google Analytics",
                    description:
                      'The _ga cookie, installed by <a href="https://cookiedatabase.org/cookie/google-analytics/_ga/">Google Analytics</a>, calculates visitor, session and campaign data and also keeps track of site usage for the site\'s analytics report. The cookie stores information anonymously and assigns a randomly generated number to recognize unique visitors.',
                    expiration: "Expires after two years",
                  },
                  {
                    name: "_gid",
                    domain: "Google Analytics",
                    description:
                      'Cookie set by <a href="#das">Google Analytics</a>',
                    expiration: "Session or 24 hours",
                  },
                ],
              },
            },
            {
              title: "More information",
              description:
                'For any queries in relation to my policy on cookies and your choices, please view the <a href="/privacy-policy/">privacy policy</a>.',
            },
          ],
        },
      },
    },
  },
});
