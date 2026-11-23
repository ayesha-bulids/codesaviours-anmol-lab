/* Shared parts (top bar, navbar, footer, floating buttons) are built here so they are edited in ONE place. */
const LAB = {
  name: "Anmol Lab",
  phone: "[TBD]", whatsapp: "[TBD]", email: "[TBD]", address: "[TBD] Lab address",
  homeSample: true, // set false if the lab does not offer home collection
  hours: [["Monday - Friday","[TBD]"],["Saturday","[TBD]"],["Sunday","[TBD]"]]
};
const NAV = [["Home","index.html"],["About","about.html"],["Tests","tests.html"],["Packages","packages.html"],["Reports","reports.html"],["Contact","contact.html"]];
const page = location.pathname.split("/").pop() || "index.html";
const waLink = "https://wa.me/" + LAB.whatsapp.replace(/\D/g, "");
const hoursHtml = LAB.hours.map(h => `<li><span>${h[0]}</span><span>${h[1]}</span></li>`).join("");

function buildChrome() {
  const header = document.getElementById("site-header");
  if (header) header.innerHTML = `
  <div class="top-bar"><div class="container">
    <span class="tb-hide"><i class="fa-regular fa-clock"></i> ${LAB.hours[0][1]}</span>
    <a href="tel:${LAB.phone}"><i class="fa-solid fa-phone"></i> ${LAB.phone}</a>
    ${LAB.homeSample ? '<span class="tb-hide"><i class="fa-solid fa-house-medical"></i> Home Sample Collection Available</span>' : ""}
  </div></div>
  <nav class="navbar navbar-expand-lg site-nav"><div class="container">
    <a class="navbar-brand" href="index.html"><img src="images/logo.png" alt="Anmol Lab logo"></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle menu"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-lg-3">
        ${NAV.map(n => `<li class="nav-item"><a class="nav-link ${n[1] === page ? "active" : ""}" href="${n[1]}">${n[0]}</a></li>`).join("")}
        <li class="nav-item">
  <a class="nav-link" href="tests.html#myTestsOffcanvas"
     data-bs-toggle="offcanvas"
     data-bs-target="#myTestsOffcanvas">
    My Tests
    <span id="my-tests-badge" class="badge bg-danger">0</span>
  </a>
</li>
      </ul>
      <a class="btn btn-accent" href="booking.html">Book Home Sample</a>
    </div></div></nav>`;

  const footer = document.getElementById("site-footer");
  if (footer) footer.innerHTML = `
  <footer class="site-footer"><div class="container"><div class="row g-4">
    <div class="col-lg-3 col-md-6"><img src="images/logo.png" alt="Anmol Lab logo" height="44"><p class="mt-2">[TBD] Short lab description.</p></div>
    <div class="col-lg-3 col-md-6"><h4>Quick links</h4><ul>${NAV.map(n => `<li><a href="${n[1]}">${n[0]}</a></li>`).join("")}</ul></div>
    <div class="col-lg-3 col-md-6"><h4>Opening hours</h4><ul>${LAB.hours.map(h => `<li>${h[0]}: ${h[1]}</li>`).join("")}</ul></div>
    <div class="col-lg-3 col-md-6"><h4>Contact</h4><ul>
      <li><i class="fa-solid fa-location-dot"></i> ${LAB.address}</li>
      <li><i class="fa-solid fa-phone"></i> <a href="tel:${LAB.phone}">${LAB.phone}</a></li>
      <li><i class="fa-brands fa-whatsapp"></i> <a href="${waLink}">${LAB.whatsapp}</a></li>
      <li><i class="fa-solid fa-envelope"></i> <a href="mailto:${LAB.email}">${LAB.email}</a></li></ul></div>
  </div><p class="footer-notice">Test results should always be discussed with your doctor.</p></div>
  <div class="footer-bottom">&copy; 2026 Anmol Lab. All rights reserved.</div></footer>
  <a class="float-btn wa-btn" href="${waLink}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
  <button class="float-btn top-btn" id="top-btn" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>`;
}
buildChrome();

// Get saved test IDs from localStorage
function getMyTests() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("anmolMyTests") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

// Save test IDs
function saveMyTests(ids) {
  localStorage.setItem("anmolMyTests", JSON.stringify(ids));
  updateMyTestsBadge();
}

// Update navbar badge
function updateMyTestsBadge() {
  const badge = document.getElementById("my-tests-badge");

  if (badge) {
    badge.textContent = getMyTests().length;
  }
}

updateMyTestsBadge();


// Close hamburger menu after a link click
document.querySelectorAll("#mainNav .nav-link").forEach(l => l.addEventListener("click", () => {
  const el = document.getElementById("mainNav");
  if (el.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(el).hide();
}));

// Back to top
const topBtn = document.getElementById("top-btn");
if (topBtn) {
  window.addEventListener("scroll", () => topBtn.classList.toggle("show", window.scrollY > 400));
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Home hero search -> tests.html?search=word
const sf = document.getElementById("search-form");
if (sf) sf.addEventListener("submit", e => {
  e.preventDefault();
  const w = document.getElementById("search-input").value.trim();
  location.href = "tests.html" + (w ? "?search=" + encodeURIComponent(w) : "");
});

// Home: render popular tests and package preview from data files
const price = p => (p === null || p === undefined) ? "Rs. [TBD]" : "Rs. " + p;
const pt = document.getElementById("popular-tests");
if (pt && typeof tests !== "undefined") {
  pt.innerHTML = tests.filter(t => t.popular).slice(0, 6).map(t => `
  <div class="col-md-6 col-lg-4"><div class="item-card"><h3 class="h5">${t.name}</h3>
    <p class="meta">Sample: ${t.sampleType} | Report: ${t.reportTime}</p>
    <p class="price">${price(t.price)}</p><a class="btn btn-primary-lab" href="booking.html">Book Now</a></div></div>`).join("");
}
const pp = document.getElementById("package-preview");
if (pp && typeof packages !== "undefined") {
  pp.innerHTML = packages.slice(0, 3).map(p => `
  <div class="col-md-4"><div class="item-card"><h3 class="h5">${p.name}</h3>
    <p class="meta">${p.testIds.length} tests included</p>
    <p class="price">${price(p.price)}</p><a class="btn btn-primary-lab" href="packages.html">View Details</a></div></div>`).join("");
}
const hl = document.getElementById("hours-list"); if (hl) hl.innerHTML = hoursHtml;
document.querySelectorAll("[data-lab]").forEach(el => el.textContent = LAB[el.dataset.lab]);

if (window.AOS) AOS.init({ duration: 500, once: true, disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches });