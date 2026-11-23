
const ITEMS_PER_PAGE = 9;
let visibleCount = ITEMS_PER_PAGE;

// Format test price
function formatPrice(price) {
  return price === null || price === undefined
    ? "Price to be confirmed"
    : "Rs. " + Number(price).toLocaleString("en-PK");
}

// Get filtered and sorted tests
function getFilteredTests() {
  const search = document.getElementById("test-search")?.value
    .trim().toLowerCase() || "";

  const category =
    document.getElementById("category-filter")?.value || "all";

  const fasting =
    document.getElementById("fasting-filter")?.value || "all";

  const sort =
    document.getElementById("sort-filter")?.value || "default";

  let filtered = tests.filter(test => {
    const matchesSearch =
      test.name.toLowerCase().includes(search) ||
      test.category.toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || test.category === category;

    const matchesFasting =
      fasting === "all" ||
      (fasting === "yes" && test.fasting) ||
      (fasting === "no" && !test.fasting);

    return matchesSearch && matchesCategory && matchesFasting;
  });

  if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "low") {
    filtered.sort((a, b) => {
      if (a.price == null) return 1;
      if (b.price == null) return -1;
      return a.price - b.price;
    });
  }

  if (sort === "high") {
    filtered.sort((a, b) => {
      if (a.price == null) return 1;
      if (b.price == null) return -1;
      return b.price - a.price;
    });
  }

  return filtered;
}

// Display test cards
function renderTests() {
  const grid = document.getElementById("tests-grid");
  const count = document.getElementById("results-count");
  const noResults = document.getElementById("no-results");
  const loadMore = document.getElementById("load-more");

  if (!grid || !count) return;

  const filtered = getFilteredTests();
  const displayed = filtered.slice(0, visibleCount);

  count.textContent =
    `Showing ${displayed.length} of ${filtered.length} tests`;

  if (noResults) {
    noResults.classList.toggle("d-none", filtered.length !== 0);
  }

  grid.innerHTML = displayed.map(test => `
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
          : ''}

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

  if (loadMore) {
    loadMore.classList.toggle(
      "d-none",
      displayed.length >= filtered.length
    );
  }

  updateCategoryButtons();
}

// Display categories
function renderCategories() {
  const categories = [...new Set(tests.map(test => test.category))];

  const list = document.getElementById("category-list");
  const select = document.getElementById("category-filter");

  if (list) {
    list.innerHTML = categories.map(category => `
      <button class="category-btn"
              type="button"
              data-category="${category}">
        ${category}
      </button>
    `).join("");
  }

  if (select) {
    select.innerHTML = `
      <option value="all">All Categories</option>
      ${categories.map(category => `
        <option value="${category}">${category}</option>
      `).join("")}
    `;
  }
}

// Highlight selected category
function updateCategoryButtons() {
  const selected =
    document.getElementById("category-filter")?.value || "all";

  document.querySelectorAll("[data-category]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === selected
    );
  });
}

// Reset pagination and update results
function applyFilters() {
  visibleCount = ITEMS_PER_PAGE;
  renderTests();
}

// Initialize page
function initializeTestsPage() {
  renderCategories();

  const params = new URLSearchParams(window.location.search);

  const searchInput = document.getElementById("test-search");
  const categoryFilter = document.getElementById("category-filter");
  const fastingFilter = document.getElementById("fasting-filter");
  const sortFilter = document.getElementById("sort-filter");
  const loadMore = document.getElementById("load-more");
  const clearFilters = document.getElementById("clear-filters");
  const categoryList = document.getElementById("category-list");

  if (searchInput) {
    searchInput.value = params.get("search") || "";
    searchInput.addEventListener("input", applyFilters);
  }

  if (categoryFilter) {
    const requestedCategory = params.get("category");

    if (
      requestedCategory &&
      [...categoryFilter.options].some(
        option => option.value === requestedCategory
      )
    ) {
      categoryFilter.value = requestedCategory;
    }

    categoryFilter.addEventListener("change", applyFilters);
  }

  if (fastingFilter) {
    fastingFilter.addEventListener("change", applyFilters);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", applyFilters);
  }

  if (categoryList) {
    categoryList.addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (!button) return;

      if (categoryFilter) {
        categoryFilter.value = button.dataset.category;
      }

      applyFilters();
    });
  }

  if (loadMore) {
    loadMore.addEventListener("click", () => {
      visibleCount += ITEMS_PER_PAGE;
      renderTests();
    });
  }

  if (clearFilters) {
    clearFilters.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (categoryFilter) categoryFilter.value = "all";
      if (fastingFilter) fastingFilter.value = "all";
      if (sortFilter) sortFilter.value = "default";

      applyFilters();
    });
  }

  renderTests();
}

initializeTestsPage();

// Current test selected for modal
let selectedModalTestId = null;

// Render My Tests list
function renderMyTests() {
  const ids = getMyTests();
  const selectedTests = tests.filter(test => ids.includes(test.id));

  const list = document.getElementById("my-tests-list");
  const count = document.getElementById("my-tests-count");
  const offcanvasCount = document.getElementById("offcanvas-tests-count");
  const summary = document.getElementById("my-tests-summary");

  if (!list) return;

  if (count) count.textContent = ids.length;
  if (offcanvasCount) offcanvasCount.textContent = ids.length;

  if (summary) {
    summary.classList.toggle("d-none", ids.length === 0);
  }

  if (selectedTests.length === 0) {
    list.innerHTML = '<p class="text-muted">No tests selected yet.</p>';
  } else {
    list.innerHTML = selectedTests.map(test => `
      <div class="border rounded p-3 mb-3">
        <h6>${test.name}</h6>
        <p class="small text-muted mb-2">${test.category}</p>
        <p class="small mb-2">${formatPrice(test.price)}</p>
        <button class="btn btn-sm btn-outline-danger"
                data-remove-test="${test.id}">
          Remove
        </button>
      </div>
    `).join("");
  }
}

// Add test to My Tests
function addToMyTests(id) {
  const ids = getMyTests();

  if (!ids.includes(id)) {
    ids.push(id);
    saveMyTests(ids);
  }

  renderMyTests();
}

// Show test details modal
function showTestDetails(id) {
  const test = tests.find(item => item.id === id);
  if (!test) return;

  selectedModalTestId = id;

  document.getElementById("testDetailsTitle").textContent = test.name;

  document.getElementById("test-details-content").innerHTML = `
    <p><strong>Category:</strong> ${test.category}</p>
    <p><strong>Sample Type:</strong> ${test.sampleType}</p>
    <p><strong>Report Time:</strong> ${test.reportTime}</p>
    <p><strong>Fasting:</strong> ${test.fasting ? "Required" : "Not required"}</p>
    <p><strong>Price:</strong> ${formatPrice(test.price)}</p>
    <p><strong>Description:</strong> ${test.description}</p>
  `;

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("testDetailsModal")
  ).show();
}

// Handle card buttons
document.getElementById("tests-grid")?.addEventListener("click", event => {
  const detailsButton = event.target.closest("[data-test-details]");
  const addButton = event.target.closest("[data-add-test]");

  if (detailsButton) {
    showTestDetails(Number(detailsButton.dataset.testDetails));
  }

  if (addButton) {
    addToMyTests(Number(addButton.dataset.addTest));
    addButton.textContent = "Added";
    addButton.disabled = true;
  }
});

// Add test from modal
document.getElementById("modal-add-test")?.addEventListener("click", () => {
  if (selectedModalTestId !== null) {
    addToMyTests(selectedModalTestId);
  }

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("testDetailsModal")
  ).hide();
});

// Remove test from My Tests
document.getElementById("my-tests-list")?.addEventListener("click", event => {
  const button = event.target.closest("[data-remove-test]");
  if (!button) return;

  const id = Number(button.dataset.removeTest);
  const updatedIds = getMyTests().filter(testId => testId !== id);

  saveMyTests(updatedIds);
  renderMyTests();

  // Re-enable the Add button on its test card
  const cardButton = document.querySelector(
    `[data-add-test="${id}"]`
  );

  if (cardButton) {
    cardButton.disabled = false;
    cardButton.textContent = "Add to My Tests";
  }
});

// Load saved tests when page opens
renderMyTests();
