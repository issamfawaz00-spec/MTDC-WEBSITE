/*
 * MTDC site configuration
 * -----------------------------------------------------------------------------
 * Fill these in once the details are approved. Anything left as an empty
 * string is shown on the site as "To be confirmed" and is never linked.
 *
 * formEndpoint:
 *   URL that receives enquiry form submissions as a POST (multipart form data).
 *   Works with services such as Formspree, Basin, Getform, or your own backend.
 *   While this is empty, the forms validate input but clearly tell the visitor
 *   that online enquiries are not yet connected and that nothing was sent.
 *   A success message is only shown when the endpoint returns a 2xx response.
 */
window.MTDC_CONFIG = {
  companyName: "MT Distribution Channel",
  shortName: "MTDC",
  tagline: "Helping brands move from product to market.",
  coverage: "Abuja / FCT",

  contact: {
    email: "", // e.g. "info@example.com"
    phone: "", // display format, e.g. "+234 ..."
    whatsapp: "", // international digits only, e.g. "234XXXXXXXXXX"
    address: "", // full office / warehouse address
    hours: "" // e.g. "Mon–Sat, 8:00am–6:00pm"
  },

  formEndpoint: ""
};
