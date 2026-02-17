const form = document.querySelector("form");

// OUTPUTS (match your new IDs)
const firstNameOutput = document.querySelector("#first_name_output");
const lastNameOutput = document.querySelector("#last_name_output");
const addressOutput = document.querySelector("#address_output");
const phoneOutput = document.querySelector("#phone_output");
const situationOutput = document.querySelector("#situation_output");
const urgencyOutput = document.querySelector("#urgency_output");
const termsOutput = document.querySelector("#terms_output");

// ====== Helper: make a checkbox group act as one required field ======
function setupCheckboxGroup(groupName) {
  const checkboxes = form.querySelectorAll(`input[name="${groupName}"]`);
  if (!checkboxes.length) return;

  function syncValidity() {
    const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
    // If none checked, make them required (so the form blocks submit)
    checkboxes.forEach((cb) => (cb.required = !anyChecked));
  }

  syncValidity();
  checkboxes.forEach((cb) => cb.addEventListener("change", syncValidity));
}

// Apply ONLY to the multi-select group
setupCheckboxGroup("situation");

// ====== Prevent native validation popups (keeps your UX consistent) ======
form.addEventListener(
  "invalid",
  (e) => {
    e.preventDefault();
    (form.querySelector(":user-invalid") || form.querySelector(":invalid"))?.focus();
  },
  true,
);

// ====== Handle form submission ======
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Collect values
  const fd = new FormData(form);
  const firstName = (fd.get("first_name") || "").toString().trim();
  const lastName = (fd.get("last_name") || "").toString().trim();
  const address = (fd.get("address") || "").toString().trim();
  const phone = (fd.get("phone") || "").toString().trim();

  const situations = fd.getAll("situation").join(", ");
  const urgency = (fd.get("urgency") || "").toString().trim();

  const terms = fd.get("accept_terms") ? "yes" : "no";

  // Output
  firstNameOutput.textContent = firstName;
  lastNameOutput.textContent = lastName;
  addressOutput.textContent = address;
  phoneOutput.textContent = phone;

  situationOutput.textContent = situations || "—";
  urgencyOutput.textContent = urgency || "—";

  termsOutput.textContent = terms;

  // Reset
  form.reset();
  setupCheckboxGroup("situation");
});
