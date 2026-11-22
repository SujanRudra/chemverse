
/* ==============================
   CHEMVERSE - NAVIGATION
============================== */

export function initializeNavigation() {

    const navLinks = document.getElementById("navLinks");
    const menuToggle = document.getElementById("menuToggle");

    const sections = document.querySelectorAll(".page-section");
    const navigationLinks = document.querySelectorAll(".nav-link");


    // Switch between sections
    function showSection(sectionId, updateHistory = true) {

        const targetSection = document.getElementById(sectionId);

        if (!targetSection) return;

        // Hide all sections
        sections.forEach(section => {
            section.classList.remove("active");
        });

        // Display selected section
        targetSection.classList.add("active");


        // Update active navigation link
        navigationLinks.forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.section === sectionId
            );

        });


        // Close mobile menu
        navLinks.classList.remove("open");
        menuToggle.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");


        // Update browser history only for user navigation
        if (updateHistory) {

            const newURL = `#${sectionId}`;

            if (window.location.hash !== newURL) {

                history.pushState(
                    { section: sectionId },
                    "",
                    newURL
                );

            }

        }


        // Return to the top of the page
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // Handle navigation clicks
    document.addEventListener("click", event => {

        const sectionTrigger = event.target.closest("[data-section]");

        if (!sectionTrigger) return;

        event.preventDefault();

        const sectionId = sectionTrigger.dataset.section;

        showSection(sectionId);

    });


    // Handle browser Back and Forward buttons
    window.addEventListener("popstate", () => {

        const sectionId = window.location.hash.slice(1) || "home";

        showSection(sectionId, false);

    });


    // Mobile menu toggle
    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.classList.toggle("open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    // Initialize the section based on the URL
    const initialSection = window.location.hash.slice(1);

    const validInitialSection =
        document.getElementById(initialSection)?.classList.contains("page-section")
            ? initialSection
            : "home";

    // Display the initial section without creating a history entry
    showSection(validInitialSection, false);

}
