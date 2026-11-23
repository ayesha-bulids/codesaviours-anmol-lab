
// Packages Page - Dynamic Rendering

const packagesGrid = document.getElementById("packages-grid");

// Format package price
function formatPackagePrice(price) {
  return price === null || price === undefined
    ? "Rs. [TBD]"
    : "Rs. " + Number(price).toLocaleString("en-PK");
}

// Calculate savings only when actual prices are available
function getPackageSavings(pkg) {
  if (
    typeof pkg.price === "number" &&
    typeof pkg.originalPrice === "number" &&
    pkg.originalPrice > pkg.price
  ) {
    return pkg.originalPrice - pkg.price;
  }

  return null;
}

// Render all packages
function renderPackages() {
  if (!packagesGrid) return;

  packagesGrid.innerHTML = packages.map(pkg => {
    const includedTests = tests.filter(test =>
      pkg.testIds.includes(test.id)
    );

    const savings = getPackageSavings(pkg);
    const collapseId = `package-tests-${pkg.id}`;

    return `
      <div class="col-md-6 col-lg-6">
        <div class="item-card package-card h-100">

          <div class="d-flex justify-content-between align-items-start mb-3">
            <h3 class="h4">${pkg.name}</h3>
            <span class="badge bg-light text-dark">
              ${includedTests.length} Tests
            </span>
          </div>

          <p class="meta">${pkg.bestFor}</p>

          <div class="package-price mb-3">
            <h4>${formatPackagePrice(pkg.price)}</h4>
            ${
              savings !== null
                ? `<p class="text-success mb-0">
                    Save Rs. ${savings.toLocaleString("en-PK")}
                   </p>`
                : `<p class="text-muted mb-0">Savings: [TBD]</p>`
            }
          </div>

          <p class="mb-2">
            <strong>Fasting:</strong>
            ${pkg.fasting ? "Required" : "Not required"}
          </p>

          <button
            class="btn btn-outline-primary-lab w-100 mb-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#${collapseId}"
            aria-expanded="false"
            aria-controls="${collapseId}">
            View Included Tests
            <i class="fa-solid fa-chevron-down ms-2"></i>
          </button>

          <div class="collapse mb-3" id="${collapseId}">
            <div class="included-tests">
              ${
                includedTests.length
                  ? `<ul class="list-group list-group-flush">
                      ${includedTests.map(test => `
                        <li class="list-group-item">
                          <i class="fa-solid fa-check text-success me-2"></i>
                          ${test.name}
                        </li>
                      `).join("")}
                    </ul>`
                  : `<p class="text-muted">No test details available.</p>`
              }
            </div>
          </div>

          <button
            class="btn btn-primary-lab w-100"
            type="button"
            data-add-package="${pkg.id}">
            Add Package to My Tests
          </button>

        </div>
      </div>
    `;
  }).join("");
}

// Add all package tests to My Tests
function addPackageToMyTests(packageId) {
  const selectedPackage = packages.find(pkg =>
    pkg.id === packageId
  );

  if (!selectedPackage) return;

  const savedIds = getMyTests();

  const updatedIds = [
    ...new Set([...savedIds, ...selectedPackage.testIds])
  ];

  saveMyTests(updatedIds);

  alert(`${selectedPackage.name} added to My Tests!`);
}

// Handle package button clicks
packagesGrid?.addEventListener("click", event => {
  const button = event.target.closest("[data-add-package]");

  if (!button) return;

  const packageId = Number(button.dataset.addPackage);

  addPackageToMyTests(packageId);
});

// Start rendering
renderPackages();
