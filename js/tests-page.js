
// Format test price
function formatPrice(price) {
  return price === null || price === undefined
    ? "Price to be confirmed"
    : "Rs. " + Number(price).toLocaleString("en-PK");
}

// Display test cards
function renderTests(list) {
  const grid = document.getElementById("tests-grid");
  const count = document.getElementById("results-count");

  if (!grid || !count) return;

  count.textContent = `Showing ${list.length} tests`;

  grid.innerHTML = list.map(test => `
    <div class="col-12 col-md-6 col-xl-4">
      <div class="item-card test-card">
        <span class="test-category">${test.category}</span>

        <h3 class="h5 mt-2">${test.name}</h3>

        <p class="meta">
          <i class="fa-solid fa-droplet"></i>
          ${test.sampleType}
          |
          <i class="fa-regular fa-clock"></i>
          ${test.reportTime}
        </p>

        ${test.fasting
          ? '<span class="fasting-label">Fasting Required</span>'
          : ''
        }

        <p class="price mt-3">${formatPrice(test.price)}</p>

        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-outline-primary btn-sm"
                  data-test-details="${test.id}">
            Details
          </button>

          <button class="btn btn-primary-lab btn-sm"
                  data-add-test="${test.id}">
            Add to My Tests
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Display categories
function renderCategories() {
  const categories = [...new Set(tests.map(test => test.category))];

  const list = document.getElementById("category-list");
  const select = document.getElementById("category-filter");

  if (!list || !select) return;

  list.innerHTML = categories.map(category => `
    <button class="category-btn"
            type="button"
            data-category="${category}">
      ${category}
    </button>
  `).join("");

  select.innerHTML += categories.map(category => `
    <option value="${category}">${category}</option>
  `).join("");
}

// Initialize Tests page
function initializeTestsPage() {
  renderCategories();
  renderTests(tests);
}

initializeTestsPage();
