
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-links a");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const toast = document.getElementById("toast");

  // Current year in footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation"
      );

      navLinks.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Toast notification
  let toastTimer;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  // Scroll reveal animations
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // Highlight navigation link for the current section
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navItems.forEach((link) => {
            const target = link.getAttribute("href");
            link.classList.toggle(
              "active",
              target === `#${entry.target.id}`
            );
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px"
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Membership buttons preselect the enquiry form option
  const interest = document.getElementById("interest");

  document.querySelectorAll("[data-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.dataset.plan;
      if (!interest || !plan) return;

      const matchingOption = Array.from(interest.options).find(
        (option) =>
          option.textContent.toLowerCase().includes(plan.toLowerCase())
      );

      if (matchingOption) {
        interest.value = matchingOption.value || matchingOption.textContent;
      }
    });
  });

  // Demo enquiry form
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      const customerName = String(formData.get("name") || "").trim();

      if (formStatus) {
        formStatus.textContent =
          `Thanks, ${customerName}! The form is working in demo mode, ` +
          "but your enquiry has not been sent. Connect a backend to receive it.";
      }

      showToast("Demo form submitted — no data was sent.");

      // This front-end demo does not transmit or store personal data.
      contactForm.reset();
    });
  }

  // Smooth scrolling fallback for browsers that need it
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      // Update the URL hash without an abrupt jump
      if (window.location.hash !== href) {
        history.replaceState(null, "", href);
      }
    });
  });
});
