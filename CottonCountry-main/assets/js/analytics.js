// Optional GA4 analytics. No analytics script loads until the visitor opts in.
(() => {
  const privacyUrl = new URL("../../privacy/", document.currentScript.src).href;
  const id = window.COTTON_COUNTRY_CONFIG?.gaMeasurementId || "";
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  const storageKey = "cotton-analytics-choice";
  let allowed = false;
  let initialized = false;
  let banner;
  function readChoice() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }
  function remember(choice) {
    try {
      localStorage.setItem(storageKey, choice);
    } catch {
      /* Choice works for this visit. */
    }
  }
  function safePageUrl() {
    return window.location.origin + window.location.pathname;
  }
  function enable() {
    allowed = true;
    window[`ga-disable-${id}`] = false;
    if (initialized) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
      return;
    }
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: safePageUrl(),
      page_referrer: "",
    });
    window.gtag("event", "page_view", {
      page_location: safePageUrl(),
      page_title: document.title,
      page_referrer: "",
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
  }
  function choose(choice) {
    remember(choice);
    banner.hidden = true;
    if (choice === "allow") enable();
    else {
      allowed = false;
      window[`ga-disable-${id}`] = true;
      if (initialized)
        window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  }
  // Only fixed event labels are accepted. Never send submitted form values.
  window.cottonTrack = function (eventName, parameters = {}) {
    if (!allowed || typeof window.gtag !== "function") return;
    if (!["phone_click", "generate_lead"].includes(eventName)) return;
    const payload = { page_location: safePageUrl(), page_referrer: "" };
    if (["ride_request", "general_contact"].includes(parameters.form_type))
      payload.form_type = parameters.form_type;
    window.gtag("event", eventName, payload);
  };
  document.addEventListener("click", (event) => {
    if (event.target.closest('a[href^="tel:"]'))
      window.cottonTrack("phone_click");
  });
  banner = document.createElement("section");
  banner.className = "analytics-banner";
  banner.setAttribute("aria-label", "Optional analytics preferences");
  banner.innerHTML =
    '<p>May we use optional analytics to understand website visits and clicks on our call buttons? Forms and phone links work either way. <a href="' + privacyUrl + '">Privacy details</a></p><div class="choices"><button class="button" type="button" data-allow>Allow analytics</button><button class="button decline" type="button" data-decline>No thanks</button></div>';
  banner
    .querySelector("[data-allow]")
    .addEventListener("click", () => choose("allow"));
  banner
    .querySelector("[data-decline]")
    .addEventListener("click", () => choose("deny"));
  document.body.appendChild(banner);
  document.querySelectorAll("[data-analytics-settings]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      banner.hidden = false;
      banner.querySelector("[data-allow]").focus();
    });
  });
  const choice = readChoice();
  banner.hidden = choice === "allow" || choice === "deny";
  if (choice === "allow") enable();
})();
