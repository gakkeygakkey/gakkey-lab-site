(function () {
  "use strict";

  var measurementId = "G-60H1Q3MMZ0";
  var consentKey = "gakkey_analytics_consent";
  var analyticsLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  function getConsent() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      // Continue with the choice for the current page when storage is unavailable.
    }
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted"
    });

    if (window.location.hostname !== "lab.gakkey.com") return;

    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(script);
  }

  function setBannerVisible(visible) {
    var banner = document.querySelector(".cookie-consent");
    if (!banner) return;
    banner.hidden = !visible;
  }

  function chooseConsent(value) {
    saveConsent(value);
    setBannerVisible(false);

    if (value === "granted") {
      loadAnalytics();
    } else {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied"
      });
    }
  }

  function createConsentBanner() {
    var isJapanese = document.documentElement.lang === "ja";
    var banner = document.createElement("aside");
    banner.className = "cookie-consent";
    banner.setAttribute("aria-label", isJapanese ? "Cookieの設定" : "Cookie settings");
    banner.innerHTML =
      '<div class="cookie-consent-copy">' +
        '<strong>' + (isJapanese ? "Cookieの使用について" : "About cookies") + '</strong>' +
        '<p>' +
          (isJapanese
            ? "当サイトでは、利用状況の把握と改善のためGoogle AnalyticsのCookieを使用します。同意するまで計測は開始しません。"
            : "We use Google Analytics cookies to understand site usage and improve this website. Tracking does not begin until you consent.") +
          ' <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">' +
          (isJapanese ? "Googleのプライバシーポリシー" : "Google Privacy Policy") +
          '</a>' +
        '</p>' +
      '</div>' +
      '<div class="cookie-consent-actions">' +
        '<button type="button" data-consent="denied">' + (isJapanese ? "拒否する" : "Decline") + '</button>' +
        '<button class="primary" type="button" data-consent="granted">' + (isJapanese ? "同意する" : "Accept") + '</button>' +
      '</div>';

    banner.addEventListener("click", function (event) {
      var button = event.target.closest("[data-consent]");
      if (!button) return;
      chooseConsent(button.getAttribute("data-consent"));
    });
    document.body.appendChild(banner);
  }

  function createSettingsButton() {
    var footer = document.querySelector(".footer-links") || document.querySelector(".footer");
    if (!footer) return;

    var isJapanese = document.documentElement.lang === "ja";
    var button = document.createElement("button");
    button.className = "cookie-settings";
    button.type = "button";
    button.textContent = isJapanese ? "Cookie設定" : "Cookie settings";
    button.addEventListener("click", function () {
      setBannerVisible(true);
    });
    footer.appendChild(button);
  }

  function appNameFromUrl(url) {
    if (url.indexOf("Bridge-Meter") !== -1) return "Bridge Meter";
    if (url.indexOf("Relative-Time-Counter") !== -1) return "Relative Time Counter";
    if (url.indexOf("Side-Note") !== -1) return "Side Note";
    return "Unknown";
  }

  function enableDownloadTracking() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href*="/releases/download/"][href$=".dmg"]');
      if (!link || getConsent() !== "granted") return;

      var url = link.href;
      window.gtag("event", "app_download", {
        app_name: appNameFromUrl(url),
        file_name: url.split("/").pop(),
        link_url: url
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    createConsentBanner();
    createSettingsButton();
    enableDownloadTracking();

    if (getConsent() === "granted") {
      setBannerVisible(false);
      loadAnalytics();
    } else if (getConsent() === "denied") {
      setBannerVisible(false);
    }
  });
})();
