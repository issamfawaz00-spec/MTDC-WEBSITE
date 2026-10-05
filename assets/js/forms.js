/*
 * MTDC — enquiry forms.
 *
 * Forms marked [data-enquiry-form] are validated in the browser and then
 * POSTed to MTDC_CONFIG.formEndpoint. A success message is shown ONLY when
 * the endpoint answers with a 2xx status. If no endpoint is configured yet,
 * the visitor is told plainly that nothing was sent.
 */
(function () {
  "use strict";

  var config = window.MTDC_CONFIG || {};
  var endpoint = (config.formEndpoint || "").trim();
  var catalogue = window.MTDC_CATALOGUE || { products: [] };

  function setStatus(box, type, lines) {
    box.className = "form-status is-" + type;
    box.textContent = "";
    lines.forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      box.appendChild(p);
    });
    box.setAttribute("tabindex", "-1");
    box.focus({ preventScroll: false });
  }

  function clearErrors(form) {
    form.querySelectorAll(".field.has-error").forEach(function (f) {
      f.classList.remove("has-error");
    });
    form.querySelectorAll(".field-error").forEach(function (e) {
      e.remove();
    });
  }

  function messageFor(input) {
    var v = input.validity;
    var label = (input.labels && input.labels[0] && input.labels[0].firstChild.textContent.trim()) || "This field";
    if (v.valueMissing) {
      return input.type === "checkbox" ? "Please tick this box to continue." : label + " is required.";
    }
    if (v.typeMismatch && input.type === "email") return "Please enter a valid email address.";
    if (v.patternMismatch) return input.getAttribute("data-pattern-message") || "Please check the format.";
    if (v.tooShort) return label + " is too short.";
    return input.validationMessage;
  }

  function validate(form) {
    clearErrors(form);
    var firstInvalid = null;
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      if (input.closest(".hp-field") || input.checkValidity()) return;
      var field = input.closest(".field") || input.parentElement;
      field.classList.add("has-error");
      var err = document.createElement("span");
      err.className = "field-error";
      err.id = (input.id || input.name) + "-error";
      err.textContent = messageFor(input);
      field.appendChild(err);
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", err.id);
      if (!firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function prefillProduct(form) {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("product");
    if (!id) return;
    var product = (catalogue.products || []).filter(function (p) {
      return p.id === id;
    })[0];
    if (!product) return;

    var productField = form.querySelector('[name="product_of_interest"]');
    if (productField && !productField.value) {
      productField.value = [product.brand, product.name, product.packSize ? "(" + product.packSize + ")" : ""]
        .filter(Boolean)
        .join(" ");
    }
    var typeField = form.querySelector('[name="enquiry_type"]');
    if (typeField) typeField.value = "Product enquiry";
  }

  document.querySelectorAll("[data-enquiry-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var submit = form.querySelector('[type="submit"]');
    var submitLabel = submit ? submit.textContent : "";

    form.noValidate = true;
    prefillProduct(form);

    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true" && input.checkValidity()) {
          var field = input.closest(".field") || input.parentElement;
          field.classList.remove("has-error");
          var err = field.querySelector(".field-error");
          if (err) err.remove();
          input.removeAttribute("aria-invalid");
          input.removeAttribute("aria-describedby");
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate(form)) {
        setStatus(status, "error", ["Please correct the highlighted fields and try again."]);
        return;
      }

      /* Honeypot: silently drop obvious bots without claiming success. */
      var hp = form.querySelector('.hp-field input');
      if (hp && hp.value) return;

      if (!endpoint) {
        setStatus(status, "info", [
          "Your enquiry has NOT been sent. Online enquiries are not connected yet.",
          "Your details are still in the form. Please contact MTDC directly using the details on our Contact page."
        ]);
        return;
      }

      var data = new FormData(form);
      data.append("_page", window.location.pathname);

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }

      fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          setStatus(status, "success", [
            "Thank you. Your enquiry has been sent to MTDC.",
            "Our team will get back to you using the contact details you provided."
          ]);
        })
        .catch(function () {
          setStatus(status, "error", [
            "Sorry, your enquiry could not be sent. Nothing was submitted.",
            "Please try again in a moment, or contact MTDC directly."
          ]);
        })
        .then(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = submitLabel;
          }
        });
    });
  });
})();
