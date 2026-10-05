/* MTDC — shared behaviour: mobile navigation, contact details, footer year. */
(function () {
  "use strict";

  var config = window.MTDC_CONFIG || { contact: {} };
  var contact = config.contact || {};

  /* ---------- Mobile navigation ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");

  function setNav(open) {
    if (!header || !toggle) return;
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setNav(!header.classList.contains("nav-open"));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && header.classList.contains("nav-open")) {
        setNav(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1200) setNav(false);
    });
  }

  /* ---------- Contact details from site-config.js ---------- */
  function tbc() {
    var el = document.createElement("em");
    el.className = "tbc";
    el.textContent = "To be confirmed";
    return el;
  }

  function link(href, text, external) {
    var a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    if (external) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    return a;
  }

  var renderers = {
    email: function (v) {
      return link("mailto:" + v, v);
    },
    phone: function (v) {
      return link("tel:" + v.replace(/[^\d+]/g, ""), v);
    },
    whatsapp: function (v) {
      var digits = v.replace(/\D/g, "");
      return link("https://wa.me/" + digits, "+" + digits, true);
    },
    address: function (v) {
      return document.createTextNode(v);
    },
    hours: function (v) {
      return document.createTextNode(v);
    }
  };

  document.querySelectorAll("[data-contact]").forEach(function (el) {
    var key = el.getAttribute("data-contact");
    var value = (contact[key] || "").trim();
    el.textContent = "";
    if (value && renderers[key]) {
      el.appendChild(renderers[key](value));
    } else {
      el.appendChild(tbc());
    }
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
