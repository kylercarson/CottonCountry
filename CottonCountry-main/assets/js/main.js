"use strict";
const config = window.COTTON_COUNTRY_CONFIG || {};
document.querySelectorAll("[data-phone]").forEach((link) => {
  link.href = `tel:${config.phoneLink || "+18067010404"}`;
  link.textContent =
    (link.textContent.trim().startsWith("Call") ? "Call " : "") +
    (config.phoneDisplay || "(806) 701-0404");
});
document.querySelectorAll("[data-email]").forEach((link) => {
  link.href = `mailto:${config.email}`;
  link.textContent = config.email;
});
document.getElementById("year").textContent = new Date().getFullYear();
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("navigation");
function closeMenu() {
  toggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
  if (e.matches) closeMenu();
});
document.querySelectorAll("[data-service]").forEach((link) =>
  link.addEventListener("click", () => {
    document.getElementById("service-select").value = link.dataset.service;
  }),
);
const date = new Date();
document.getElementById("ride-date").min =
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
function setupForm(id, endpoint, successMessage, buttonText) {
  const form = document.getElementById(id);
  const status = document.getElementById(`${id}-status`);
  const submit = form.querySelector('button[type="submit"]');
  const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(
    endpoint || "",
  );
  if (configured) form.action = endpoint;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!configured) {
      status.textContent =
        "Online submissions are not available yet. Please call or email us.";
      return;
    }
    submit.disabled = true;
    submit.textContent = "Sending…";
    status.textContent = "";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      if (window.cottonTrack)
        window.cottonTrack("generate_lead", {
          form_type: id === "ride-form" ? "ride_request" : "general_contact",
        });
      status.textContent = successMessage;
    } catch (error) {
      status.textContent =
        "We could not confirm that your message was sent. Please call or email us. Your information remains in the form.";
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      submit.textContent = buttonText + " ↗";
    }
  });
}
setupForm(
  "ride-form",
  config.rideFormEndpoint,
  "Thank you! Your ride request has been sent. Our team will contact you to discuss the details. Your ride is not confirmed until we contact you.",
  "Send request",
);
setupForm(
  "contact-form",
  config.contactFormEndpoint,
  "Thank you! Your message has been sent. Our team will get in touch using the contact details you provided.",
  "Send message",
);

// One-time section reveals and a scroll-linked van drive. No animation library.
(() => {
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const vehicle = document.querySelector(".hero-vehicle");
  const hero = document.querySelector(".hero");
  let observer;
  let frame = 0;
  let motionActive = false;
  const items = [
    ...document.querySelectorAll(
      ".section-heading, .service-card, .about-art, .about-grid > div:last-child, .coverage-grid > div, .steps-section h2, .steps article, .faq-grid > div, .contact-grid > div:first-child, .form-panel",
    ),
  ];

  function updateVehicle() {
    frame = 0;
    if (!vehicle || !hero || !motionActive) return;
    const bounds = hero.getBoundingClientRect();
    // Stop at the edge of the hero; scrolling back brings the van home.
    const progress = Math.max(
      0,
      Math.min(1, -bounds.top / Math.max(1, bounds.height * 0.7)),
    );
    vehicle.style.setProperty("--vehicle-offset", `${progress * 100}%`);
  }
  function requestVehicleUpdate() {
    if (!frame && motionActive)
      frame = window.requestAnimationFrame(updateVehicle);
  }
  function show(element) {
    element.classList.add("is-visible");
    if (observer) observer.unobserve(element);
  }
  function configureMotion() {
    if (observer) observer.disconnect();
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    motionActive = !motionPreference.matches;
    if (!motionActive) {
      items.forEach(show);
      if (vehicle) vehicle.style.removeProperty("--vehicle-offset");
      return;
    }
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) show(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
      );
      items.forEach((element) => {
        element.classList.add("scroll-reveal");
        if (element.matches(".about-art, .coverage-grid > div:first-child"))
          element.classList.add("reveal-left");
        if (element.matches(".about-grid > div:last-child, .area-panel"))
          element.classList.add("reveal-right");
        if (element.matches(".service-card, .steps article")) {
          const position = [...element.parentElement.children].indexOf(element);
          element.style.setProperty(
            "--reveal-delay",
            `${(position % 3) * 80}ms`,
          );
        }
        // Content already on screen is visible immediately, including hash targets.
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) show(element);
        else if (!element.classList.contains("is-visible"))
          observer.observe(element);
      });
    }
    updateVehicle();
  }
  window.addEventListener("scroll", requestVehicleUpdate, { passive: true });
  window.addEventListener("resize", requestVehicleUpdate, { passive: true });
  motionPreference.addEventListener("change", configureMotion);
  document.addEventListener("focusin", (event) => {
    const item = event.target.closest(".scroll-reveal");
    if (item) show(item);
  });
  configureMotion();
})();

// Service pages can preselect the ride form; personal values are never prefilled.
const requestedService = new URLSearchParams(window.location.search).get(
  "service",
);
const servicePicker = document.getElementById("service-select");
if (
  requestedService &&
  [...servicePicker.options].some((option) => option.value === requestedService)
) {
  servicePicker.value = requestedService;
}
