const products = [
  {
    id: "queso-morolique",
    name: "Queso Morolique",
    brand: "La Bendición Foods",
    category: "Lácteos",
    origin: "Producto de Nicaragua",
    image: "assets/products/queso-morolique.jpg"
  },
  {
    id: "queso-morolique-duro",
    name: "Queso Morolique Duro",
    brand: "La Bendición Foods",
    category: "Lácteos",
    origin: "Producto de Nicaragua",
    image: "assets/products/queso-morolique-duro.jpg"
  },
  {
    id: "briomol-pasta-ajos",
    name: "Pasta de Ajos",
    brand: "Briomol",
    category: "Condimentos",
    origin: "Estelí, Nicaragua",
    presentation: "500 g",
    image: "assets/products/briomol-pasta-ajos.jpg"
  },
  {
    id: "briomol-condimento-achiote",
    name: "Condimento Achiote",
    brand: "Briomol",
    category: "Condimentos",
    origin: "Estelí, Nicaragua",
    presentation: "500 g",
    image: "assets/products/briomol-condimento-achiote.jpg"
  },
  {
    id: "lizano-salsa-original",
    name: "Salsa Original",
    brand: "Lizano",
    category: "Salsas",
    presentation: "700 ml",
    image: "assets/products/lizano-salsa-original.jpg"
  },
  {
    id: "lizano-salsa-chile",
    name: "Salsa de Chile",
    brand: "Lizano",
    category: "Salsas",
    image: "assets/products/lizano-salsa-chile.jpg"
  },
  {
    id: "coca-cola-1-litro",
    name: "Coca-Cola",
    brand: "Coca-Cola",
    category: "Bebidas",
    presentation: "1 litro",
    image: "assets/products/coca-cola-1-litro.jpg"
  },
  {
    id: "rojita-3-litros",
    name: "Rojita",
    brand: "Rojita",
    category: "Bebidas",
    presentation: "3 litros",
    image: "assets/products/rojita-3-litros.jpg"
  },
  {
    id: "vilchez-tinoco-rosquillas",
    name: "Rosquillas somoteñas",
    brand: "Vílchez Tinoco",
    category: "Snacks",
    presentation: "560 g",
    image: "assets/products/vilchez-tinoco-rosquillas.jpg"
  }
];

const menuButton = document.getElementById("menuButton");
const siteHeader = document.querySelector(".site-header");
const mobileNav = document.getElementById("mobileNav");
const productGrid = document.getElementById("productGrid");
const featuredGrid = document.getElementById("featuredGrid");
const filterBar = document.getElementById("filterBar");
const catalogSearch = document.getElementById("catalogSearch");
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalDetails = document.getElementById("modalDetails");
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

const currentPage = document.body.dataset.page;
document.querySelectorAll("[data-page-link]").forEach((link) => {
  if (link.dataset.pageLink === currentPage) link.setAttribute("aria-current", "page");
});

function updateHeaderState() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 16);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".material-symbols-outlined").textContent = isOpen ? "close" : "menu";
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".material-symbols-outlined").textContent = "menu";
  });
});

function productCard(product) {
  const button = document.createElement("button");
  button.className = "product-card reveal";
  button.type = "button";
  button.dataset.productId = product.id;
  button.dataset.category = product.category;
  button.setAttribute("aria-label", `Ver detalle de ${product.name}`);
  button.innerHTML = `
    <div class="product-media">
      <img src="${product.image}" alt="${product.name}${product.brand ? " - " + product.brand : ""}" loading="lazy">
    </div>
    <div class="product-body">
      <span class="pill">${product.category}</span>
      <h3>${product.name}</h3>
      <div class="meta">
        ${product.brand ? `<span>${product.brand}</span>` : ""}
        ${product.presentation ? `<span>${product.presentation}</span>` : ""}
      </div>
    </div>
  `;
  button.addEventListener("click", () => openProduct(product.id));
  return button;
}

let activeCategory = "Todos";
let activeSearch = "";

function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = "";
  const normalizedSearch = activeSearch.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const searchable = [product.name, product.brand, product.category, product.origin, product.presentation]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return matchesCategory && (!normalizedSearch || searchable.includes(normalizedSearch));
  });

  if (!visibleProducts.length) {
    const empty = document.createElement("p");
    empty.className = "catalog-empty";
    empty.textContent = "No encontramos productos con esos filtros. Prueba con otra categoría o palabra.";
    productGrid.appendChild(empty);
  } else {
    visibleProducts.forEach((product) => productGrid.appendChild(productCard(product)));
  }
  observeReveals();
}

function renderFeatured() {
  if (!featuredGrid) return;
  featuredGrid.innerHTML = "";
  ["queso-morolique-duro", "briomol-condimento-achiote", "vilchez-tinoco-rosquillas"]
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean)
    .forEach((product) => featuredGrid.appendChild(productCard(product)));
}

function renderFilters() {
  if (!filterBar) return;
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];
  filterBar.innerHTML = "";
  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-button${index === 0 ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeCategory = category;
      renderProducts();
    });
    filterBar.appendChild(button);
  });
}

catalogSearch?.addEventListener("input", (event) => {
  activeSearch = event.target.value;
  renderProducts();
});

function openProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product || !modal) return;

  modalImage.src = product.image;
  modalImage.alt = `${product.name}${product.brand ? " - " + product.brand : ""}`;
  modalTitle.textContent = product.name;
  modalCategory.textContent = product.category;

  const details = [
    ["Marca", product.brand],
    ["Categoría", product.category],
    ["Presentación", product.presentation],
    ["Origen visible", product.origin]
  ].filter(([, value]) => Boolean(value));

  modalDetails.innerHTML = details
    .map(([label, value]) => `<div><strong>${label}</strong><span>${value}</span></div>`)
    .join("");

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close")?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

modal?.querySelectorAll("[data-close-modal]").forEach((item) => item.addEventListener("click", closeModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open")) closeModal();
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  status?.classList.remove("show");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent("Consulta comercial - Nicamerica Import Corp.");
  const body = encodeURIComponent(
    `Nombre: ${data.get("name")}\nCorreo: ${data.get("email")}\nTeléfono: ${data.get("phone") || ""}\nEmpresa: ${data.get("company") || ""}\n\nMensaje:\n${data.get("message")}`
  );

  if (status) {
    status.textContent = "Abriendo tu correo para enviar la consulta a sales@nicamericaimport.com.";
    status.classList.add("show");
  }
  window.location.href = `mailto:sales@nicamericaimport.com?subject=${subject}&body=${body}`;
});

document.querySelectorAll(".copyright").forEach((item) => {
  item.textContent = `© ${new Date().getFullYear()} Nicamerica Import Corp. Todos los derechos reservados.`;
});

let revealObserver;
function observeReveals() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
    return;
  }

  revealObserver ||= new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal:not(.visible)").forEach((item) => revealObserver.observe(item));
}

renderFeatured();
renderFilters();
renderProducts();
observeReveals();
