
// Anmol Lab - Main JavaScript File

// Initialize AOS animations
document.addEventListener("DOMContentLoaded", function () {

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    console.log("Anmol Lab Website Loaded Successfully!");

});
