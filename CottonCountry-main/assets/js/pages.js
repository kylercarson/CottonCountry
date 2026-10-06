// Shared small-screen navigation on secondary pages.
const menu = document.querySelector(".menu-toggle");
const navigation = document.getElementById("navigation");
if (menu && navigation && !document.getElementById("ride-form")) {
  function closeMenu() {
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
  });
  navigation
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      menu.focus();
    }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) closeMenu();
  });
}
const copyrightYear = document.getElementById("year");
if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

// Close Services when leaving the dropdown or following a link.
const servicesDropdown = document.querySelector(".services-dropdown");
if (servicesDropdown) {
  document.addEventListener("click", (event) => {
    if (
      !servicesDropdown.contains(event.target) ||
      event.target.closest(".services-menu a")
    )
      servicesDropdown.open = false;
  });
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && servicesDropdown.open) {
        servicesDropdown.open = false;
        servicesDropdown.querySelector("summary").focus();
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
  servicesDropdown.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !servicesDropdown.contains(event.relatedTarget))
      servicesDropdown.open = false;
  });
  if (menu)
    menu.addEventListener("click", () => {
      servicesDropdown.open = false;
    });
}
