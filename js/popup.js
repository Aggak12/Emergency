const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalImg = document.getElementById("modalImg");

let lastFocusEl = null;

function openModal({ title, desc, imgSrc, imgAlt }) {
  lastFocusEl = document.activeElement;

  modalTitle.textContent = title || "";
  modalDesc.innerHTML = desc || "";
  modalImg.src = imgSrc || "";
  modalImg.alt = imgAlt || title || "Modal image";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // optional: focus the close button for accessibility
  const closeBtn = modal.querySelector(".modal__close");
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  modalTitle.textContent = "";
  modalDesc.innerHTML = "";
  modalImg.src = "";
  modalImg.alt = "";

  if (lastFocusEl) lastFocusEl.focus();
}

document.addEventListener("click", (e) => {
  // OPEN
  const btn = e.target.closest(".js-open-modal");
  if (btn) {
    e.preventDefault();

    const card = btn.closest("article");
    if (!card) return;

    const titleEl = card.querySelector("h2, h3");
    const fullEl = card.querySelector(".news__full");
    const teaserEl = card.querySelector(".news__teaser, p");
    const imgEl = card.querySelector("img");

    openModal({
      title: titleEl ? titleEl.textContent.trim() : "",
      desc: fullEl ? fullEl.innerHTML.trim() : teaserEl ? teaserEl.textContent.trim() : "",
      imgSrc: imgEl ? imgEl.getAttribute("src") : "",
      imgAlt: imgEl ? imgEl.getAttribute("alt") : "",
    });
    return;
  }

  // CLOSE (backdrop or close button)
  const closeEl = e.target.closest("[data-close='true']");
  if (closeEl) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});
