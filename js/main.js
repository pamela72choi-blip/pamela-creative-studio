/* Shared site elements. Future pages only need data-site-header and data-site-footer. */
document.documentElement.classList.add("has-js");

const navigationItems = [
  ["網頁前端設計", "web-design.html"],
  ["社群貼文圖片", "social-media-design.html"],
  ["商品頁", "product-pages.html"],
  ["公仔、吉祥物、文創商品", "characters-mascots.html"],
  ["包裝設計", "packaging-design.html"],
  ["海報、型錄、印刷品設計", "print-design.html"],
  ["教學影片", "tutorial-videos.html"],
  ["實拍影片 + 後製", "video-production.html"],
  ["短影音", "short-form-videos.html"],
  ["關於 PAMELA", "about-pamela.html"],
  ["服務報價", "service-pricing.html"],
  ["幫你找最適合的方案", "find-the-right-solution.html"],
];

function buildHeader() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const links = navigationItems.map(([label, href]) => {
    const active = href === currentPage ? ' aria-current="page"' : "";
    return `<li><a href="${href}"${active}>${label}</a></li>`;
  }).join("");

  return `
    <header class="site-header">
      <div class="page-shell site-header__inner">
        <a class="site-brand site-brand--active" href="index.html" aria-label="Pamela Creative Studio 首頁">
          <span>Pamela Creative Studio</span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="開啟選單">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        </button>
        <nav class="site-nav" id="site-navigation" aria-label="主要選單"><ul>${links}</ul></nav>
      </div>
    </header>`;
}

function buildFooter() {
  return `
    <footer class="site-footer">
      <div class="page-shell site-footer__inner">
        <span>Copyright © <strong>Pamela Creative Studio</strong></span>
        <a href="mailto:pamela72choi@gmail.com">pamela72choi@gmail.com</a>
      </div>
    </footer>`;
}

document.querySelector("[data-site-header]").innerHTML = buildHeader();
document.querySelector("[data-site-footer]").innerHTML = buildFooter();

// A persistent shortcut to the guided solution questionnaire.
const currentPageName = window.location.pathname.split("/").pop() || "index.html";
if (currentPageName !== "find-the-right-solution.html") {
  const solutionShortcut = document.createElement("a");
  solutionShortcut.className = "solution-shortcut";
  solutionShortcut.href = "find-the-right-solution.html";
  solutionShortcut.setAttribute("aria-label", "幫你找最適合的方案");
  solutionShortcut.innerHTML = `
    <img src="assets/images/ui/find-the-right-solution.gif" alt="" width="1254" height="1254">
    <span>幫你找<br>最適合的方案</span>`;
  document.body.append(solutionShortcut);
}

// Keep the compact navigation accessible on small screens.
const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNavigation.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "關閉選單" : "開啟選單");
});

// Product-page gallery and scrollable detail modal.
const productGrid = document.querySelector("[data-products]");
if (productGrid) {
  const jpgProducts = new Set([5, 6, 9, 11, 22]);
  const pageCounts = [2, 3, 10, 11, 13, 14, 9, 10, 8, 10, 9, 12, 10, 10, 9, 4, 8, 10, 3, 7, 6, 7, 12];
  const modal = document.querySelector("[data-product-modal]");
  const modalContent = document.querySelector("[data-product-content]");
  const closeModal = () => { modal.hidden = true; modalContent.replaceChildren(); };
  pageCounts.forEach((count, index) => {
    const id = String(index + 1).padStart(3, "0");
    const folder = `product-pages/ecommerce-${id}`;
    const cover = `${folder}/cover.jpg`;
    const card = document.createElement("button");
    card.className = "product-card"; card.type = "button";
    card.innerHTML = `<img src="${cover}" alt="商品頁作品 ${index + 1}" loading="lazy">`;
    card.addEventListener("click", () => {
      const extension = jpgProducts.has(index + 1) ? "jpg" : "webp";
      modalContent.replaceChildren(...Array.from({ length: count }, (_, page) => {
        const image = document.createElement("img");
        image.src = `${folder}/${String(page).padStart(2, "0")}.${extension}`;
        image.alt = `商品頁作品 ${index + 1}，第 ${page + 1} 張`;
        return image;
      }));
      modal.hidden = false;
    });
    productGrid.append(card);
  });
  document.querySelector("[data-product-close]").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
}

// First Characters & Mascots artwork: open its full project in a scrollable modal.
const characterProjectCover = document.querySelector('img[src="assets/images/characters-mascots/characters-mascots_01.webp"]');
if (characterProjectCover) {
  const trigger = document.createElement("button");
  trigger.className = "project-detail-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-label", "查看角色設計完整作品");
  characterProjectCover.parentNode.insertBefore(trigger, characterProjectCover);
  trigger.append(characterProjectCover);
  trigger.addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.className = "product-modal";
    modal.innerHTML = '<div class="product-modal__dialog" role="dialog" aria-modal="true" aria-label="角色設計完整作品"><button class="product-modal__close" type="button" aria-label="關閉">×</button><div class="product-modal__content"></div></div>';
    const content = modal.querySelector(".product-modal__content");
    ["00", "01", "02", "03"].forEach((file, index) => {
      const image = document.createElement("img");
      image.src = `characters-mascots/characters-mascots_01/${file}.jpg`;
      image.alt = `角色設計完整作品 ${index + 1}`;
      content.append(image);
    });
    const close = () => modal.remove();
    modal.querySelector("button").addEventListener("click", close);
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    document.body.append(modal);
  });
}

// Open the corresponding original manuscript from a clickable project image.
document.querySelectorAll("[data-manuscript], [data-manuscripts]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.className = "product-modal";
    modal.innerHTML = '<div class="product-modal__dialog" role="dialog" aria-modal="true" aria-label="設計原稿展示"><button class="product-modal__close" type="button" aria-label="關閉">×</button><div class="product-modal__content"></div></div>';
    const manuscriptPaths = (trigger.dataset.manuscripts || trigger.dataset.manuscript).split("|");
    const content = modal.querySelector(".product-modal__content");
    manuscriptPaths.forEach((path, index) => {
      const image = document.createElement("img");
      image.src = path;
      image.alt = `${trigger.querySelector("img").alt}原稿展示 ${index + 1}`;
      content.append(image);
    });

    const close = () => {
      document.removeEventListener("keydown", handleKeydown);
      modal.remove();
    };
    const handleKeydown = (event) => { if (event.key === "Escape") close(); };

    modal.querySelector(".product-modal__close").addEventListener("click", close);
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    document.addEventListener("keydown", handleKeydown);
    document.body.append(modal);
    modal.querySelector(".product-modal__close").focus();
  });
});

// Discourage direct saving and provide a global return-to-top control.
document.addEventListener("contextmenu", (event) => { if (event.target.closest("img, video")) event.preventDefault(); });
document.addEventListener("dragstart", (event) => { if (event.target.closest("img")) event.preventDefault(); });
document.querySelectorAll("img").forEach((image) => { image.draggable = false; });
document.querySelectorAll("video").forEach((video) => video.setAttribute("controlsList", "nodownload"));
const r2VideoBaseUrl = "https://pub-a2157632985d4f04aa1c42a87810a69a.r2.dev";
document.querySelectorAll('video source[src^="assets/videos/"]').forEach((source) => {
  const localPath = source.getAttribute("src").replace("assets/videos/", "");
  source.src = `${r2VideoBaseUrl}/${localPath}`;
  source.parentElement.load();
});

// Open portfolio videos from static preview images.
document.querySelectorAll("[data-video-preview]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const localSource = trigger.dataset.videoPreview;
    const videoSource = localSource.startsWith("assets/videos/")
      ? `${r2VideoBaseUrl}/${localSource.replace("assets/videos/", "")}`
      : localSource;
    const label = trigger.getAttribute("aria-label") || "播放作品影片";
    const modal = document.createElement("div");
    modal.className = "product-modal";
    modal.innerHTML = `
      <div class="product-modal__dialog video-modal__dialog" role="dialog" aria-modal="true" aria-label="${label}">
        <button class="product-modal__close" type="button" aria-label="關閉">×</button>
        <div class="product-modal__content video-modal__content">
          <video controls autoplay playsinline controlsList="nodownload">
            <source src="${videoSource}" type="video/mp4">
            您的瀏覽器不支援影片播放。
          </video>
        </div>
      </div>`;

    const video = modal.querySelector("video");
    const dialog = modal.querySelector(".video-modal__dialog");
    video.addEventListener("loadedmetadata", () => {
      if (!video.videoWidth || !video.videoHeight) return;
      const viewportPadding = 60;
      const availableWidth = Math.max(240, window.innerWidth - viewportPadding);
      const availableHeight = Math.max(240, window.innerHeight - viewportPadding);
      const aspectRatio = video.videoWidth / video.videoHeight;
      dialog.style.width = `${Math.min(900, availableWidth, availableHeight * aspectRatio)}px`;
    }, { once: true });
    const close = () => {
      video.pause();
      video.removeAttribute("src");
      video.querySelector("source")?.removeAttribute("src");
      video.load();
      document.removeEventListener("keydown", handleKeydown);
      modal.remove();
      trigger.focus();
    };
    const handleKeydown = (event) => { if (event.key === "Escape") close(); };

    modal.querySelector(".product-modal__close").addEventListener("click", close);
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    document.addEventListener("keydown", handleKeydown);
    document.body.append(modal);
    modal.querySelector(".product-modal__close").focus();
  });
});

const topButton = document.createElement("button");
topButton.className = "back-to-top";
topButton.type = "button";
topButton.textContent = "↑";
topButton.setAttribute("aria-label", "回上面");
topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.body.append(topButton);
window.addEventListener("scroll", () => topButton.classList.toggle("is-visible", window.scrollY > 420), { passive: true });

// Reveal portfolio media from below and text from the right as it enters view.
const revealTargets = document.querySelectorAll([
  "main img",
  "main video",
  ".portfolio-card span",
  ".about-page__title",
  ".about-page__intro h2",
  ".about-page__intro p",
  ".about-page__skills h3",
  ".about-page__skills p"
].join(","));

revealTargets.forEach((element, index) => {
  element.classList.add("reveal-on-scroll");
  if (!element.matches("img, video")) element.classList.add("reveal-on-scroll--text");
  element.style.setProperty("--reveal-delay", `${(index % 6) * 90}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5%" });
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-revealed"));
}
