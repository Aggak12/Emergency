document.addEventListener("DOMContentLoaded", async () => {
  // ——— inline the <img> SVG so CSS/JS can target its internals
  const img = document.querySelector("img[data-inline-svg]");
  if (!img) return;

  try {
    const res = await fetch(img.src, { credentials: "same-origin" });
    if (!res.ok) throw new Error(`Failed to load SVG: ${res.status}`);
    const svgText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) throw new Error("No <svg> root found");

    // carry over img semantics
    if (img.id) svg.id = img.id;
    const cls = (img.getAttribute("class") || "").trim();
    svg.setAttribute("class", (cls ? cls + " " : "") + "inline-svg");

    const alt = img.getAttribute("alt");
    if (alt) {
      const title = doc.createElementNS(svg.namespaceURI, "title");
      title.textContent = alt;
      svg.prepend(title);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", alt);
    }

    // let CSS control size
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    // swap the nodes
    img.replaceWith(svg);

    // ——— hotspots (your <g data-name="..."> elements in the SVG)
    const hotspots = svg.querySelectorAll('g[data-name="face1"], g[data-name="face2"], g[data-name="body1"]');
    hotspots.forEach((el) => {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", el.getAttribute("data-name") || "hotspot");
    });

    // ——— right-hand panel targets (the exact section you pasted)
    const panel = {
      title: document.querySelector(".info-text h2"),
      article: document.querySelector(".info-text article"),
      efficiency: document.querySelector("#efficiency"),
      requirement: document.querySelector("#requirement"),
    };

    // ——— placeholder content per hotspot (edit later with your real copy)
    const CONTENT = {
      face1: {
        title: "Random Title A — Face 1",
        paragraphs: [
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi, nulla? Facilis, corporis.",
          "Natus, repellendus. Dolores illum quos laudantium adipisci obcaecati aspernatur exercitationem.",
          "Cupiditate odit veritatis, molestias tempora blanditiis pariatur quidem deserunt quae.",
        ],
        efficiency: "Face 1: Lorem ipsum dolor sit amet, consectetur.",
        requirement: "Face 1: Requisitum placeholder text goes here.",
      },
      face2: {
        title: "Random Title B — Face 2",
        paragraphs: [
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, aspernatur.",
          "Molestias beatae autem itaque, similique accusamus at dolor consequuntur exercitationem.",
          "Iste, molestiae! Eius quas voluptates, doloribus sapiente tenetur perspiciatis minima.",
        ],
        efficiency: "Face 2: Efficiency blurb lorem ipsum.",
        requirement: "Face 2: Requirement text lorem ipsum.",
      },
      body1: {
        title: "Random Title C — Body 1",
        paragraphs: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure, commodi.", "Quibusdam dicta exercitationem, esse nemo dignissimos iusto accusantium nam!", "Explicabo repellat debitis, similique nulla sequi nostrum omnis."],
        efficiency: "Bottom: Efficiency hint lorem ipsum.",
        requirement: "Bottom: Requirement placeholder lorem ipsum.",
      },
    };

    // ——— helpers
    function setActive(el) {
      hotspots.forEach((h) => h.classList.remove("is-active"));
      el.classList.add("is-active");
    }

    function updatePanel(key) {
      const data = CONTENT[key];
      if (!data) return;

      if (panel.title) panel.title.textContent = data.title;

      if (panel.article) {
        panel.article.innerHTML = "";
        data.paragraphs.forEach((txt) => {
          const p = document.createElement("p");
          p.textContent = txt;
          panel.article.appendChild(p);
        });
      }

      if (panel.efficiency) panel.efficiency.textContent = data.efficiency;
      if (panel.requirement) panel.requirement.textContent = data.requirement;
    }

    // ——— wire interactions
    hotspots.forEach((el) => {
      const key = el.getAttribute("data-name"); // "face1" | "face2" | "bottomtext"

      const hoverOn = () => el.classList.add("is-hovered");
      const hoverOff = () => el.classList.remove("is-hovered");

      el.addEventListener("pointerenter", hoverOn);
      el.addEventListener("pointerleave", hoverOff);
      el.addEventListener("focus", hoverOn);
      el.addEventListener("blur", hoverOff);

      el.addEventListener("click", () => {
        setActive(el);
        updatePanel(key);
      });

      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          el.click();
        }
      });
    });

    // ——— initial state (preload one so you see it working)
    const first = svg.querySelector('g[data-name="face1"]');
    if (first) {
      setActive(first);
      updatePanel("face1");
    }
  } catch (err) {
    console.error(err);
  }
});
