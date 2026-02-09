const form = document.querySelector("form");

const firstNameOutput = document.querySelector("#first_name_output");
const lastNameOutput = document.querySelector("#last_name_output");
const emailOutput = document.querySelector("#email_output");
const passwordOutput = document.querySelector("#password_output");
const langOutput = document.querySelector("#lang_output");
const termsOutput = document.querySelector("#terms_output");

// ====== Helper function to make a checkbox group act as one required field ======
function setupCheckboxGroup(groupName) {
  const checkboxes = form.querySelectorAll(`input[name="${groupName}"]`);

  function syncValidity() {
    const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
    checkboxes.forEach((cb) => (cb.required = !anyChecked));
  }

  // Run once and whenever a box in that group changes
  syncValidity();
  checkboxes.forEach((cb) => cb.addEventListener("change", syncValidity));
}

// Apply to both groups
setupCheckboxGroup("language");
setupCheckboxGroup("framework");

// ====== Prevent native validation popups ======
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
  const firstName = fd.get("first_name") || "";
  const lastName = fd.get("last_name") || "";
  const email = fd.get("email") || "";
  const password = fd.get("password") || "";
  const languages = fd.getAll("language").join(", ");
  const frameworks = fd.getAll("framework").join(", ");
  const terms = fd.get("accept_terms") ? "yes" : "no";

  // Output
  firstNameOutput.textContent = firstName;
  lastNameOutput.textContent = lastName;
  emailOutput.textContent = email;
  passwordOutput.textContent = password;
  langOutput.textContent = `${languages} | ${frameworks}`; // you can separate if you prefer
  termsOutput.textContent = terms;

  form.reset();
  setupCheckboxGroup("language");
  setupCheckboxGroup("framework");
});
