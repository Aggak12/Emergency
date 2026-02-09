const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalImg = document.getElementById("modalImg");

function openModal({ title, desc, imgSrc, imgAlt }) {
  modalTitle.textContent = title || "";
  modalDesc.textContent = desc || "";
  modalImg.src = imgSrc || "";
  modalImg.alt = imgAlt || title || "Modal image";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // prevent background scroll
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalImg.src = ""; // clears old image flash
}

document.addEventListener("click", (e) => {
  // OPEN
  const btn = e.target.closest(".js-open-modal");
  if (btn) {
    e.preventDefault();

    const card = btn.closest("article");
    if (!card) return;

    const titleEl = card.querySelector("h2, h3");
    const descEl = card.querySelector("p");
    const imgEl = card.querySelector("img");

    openModal({
      title: titleEl ? titleEl.textContent.trim() : "",
      desc: descEl ? descEl.textContent.trim() : "",
      imgSrc: imgEl ? imgEl.getAttribute("src") : "",
      imgAlt: imgEl ? imgEl.getAttribute("alt") : "",
    });
    return;
  }

  // CLOSE (backdrop or close button)
  if (e.target.matches("[data-close='true']")) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});
