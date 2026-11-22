
/* ==============================
   CHEMVERSE - PERIODIC TABLE
============================== */

export async function initializePeriodicTable() {

    const periodicTable = document.getElementById("periodicTable");
    const visibleCount = document.getElementById("visibleCount");
    const searchInput = document.getElementById("elementSearch");
    const categoryFilters = document.getElementById("categoryFilters");
    const resetButton = document.getElementById("resetFilters");
    const elementDetails = document.getElementById("elementDetails");

    let allElements = [];
    let activeCategory = "all";
    let searchQuery = "";
    let selectedElement = null;


    // Category names for display
    const categoryNames = {
        "alkali-metal": "Alkali Metal",
        "alkaline-earth-metal": "Alkaline Earth Metal",
        "transition-metal": "Transition Metal",
        "post-transition-metal": "Post-transition Metal",
        "metalloid": "Metalloid",
        "nonmetal": "Nonmetal",
        "halogen": "Halogen",
        "noble-gas": "Noble Gas",
        "lanthanide": "Lanthanide",
        "actinide": "Actinide"
    };


    // Load element data from JSON
    async function loadElements() {

        try {

            const response = await fetch("./data/elements.json");

            if (!response.ok) {
                throw new Error("Unable to load elements.json");
            }

            const elements = await response.json();

            if (elements.length !== 118) {
                throw new Error(
                    `Expected 118 elements, found ${elements.length}.`
                );
            }

            return elements;

        } catch (error) {

            console.error("CHEMVERSE data error:", error);

            periodicTable.textContent =
                "Unable to load elements. Check data/elements.json.";

            return [];

        }
    }


    
// Create an individual element tile
function createElementTile(element) {

    const tile = document.createElement("button");

    tile.type = "button";
    tile.className = "element-tile";

    // Add category styling
    tile.classList.add(element.category);

    // Show complete element name on hover
    tile.title = `${element.name} (${element.symbol})`;

    // Highlight selected element
    if (selectedElement?.number === element.number) {
        tile.classList.add("selected");
    }

    tile.dataset.number = element.number;

    // Position the element
    let column;
    let row;

    if (element.number >= 57 && element.number <= 71) {

        // Lanthanides
        column = element.number - 53;
        row = 11;

    }
    else if (element.number >= 89 && element.number <= 103) {

        // Actinides
        column = element.number - 85;
        row = 12;

    }
    else {

        column = element.group + 1;

        row = element.period <= 5
            ? element.period + 1
            : element.period + 2;

    }

    tile.style.gridColumn = column;
    tile.style.gridRow = row;

    // Element information
    tile.innerHTML = `
        <span class="element-number">${element.number}</span>
        <span class="element-symbol">${element.symbol}</span>
        <span class="element-name">${element.name}</span>
    `;

    tile.setAttribute(
        "aria-label",
        `${element.name}, atomic number ${element.number}`
    );

    return tile;
}



    // Create lanthanide and actinide placeholders
    function createSeriesPlaceholder(text, row) {

        const placeholder = document.createElement("div");

        placeholder.className = "series-placeholder";
        placeholder.style.gridColumn = "4";
        placeholder.style.gridRow = row;
        placeholder.textContent = text;

        return placeholder;
    }


    // Display element information
    function displayElementDetails(element) {

        const category =
            categoryNames[element.category] || element.category;

        elementDetails.innerHTML = `
            <div class="element-detail-content">
                <button class="detail-close" type="button" aria-label="Close details">
                &times;
                </button>

                <div class="detail-heading">

                    <div class="detail-symbol">
                        <span>${element.number}</span>
                        <h2>${element.symbol}</h2>
                    </div>

                    <div>
                        <h2>${element.name}</h2>
                        <p>${category}</p>
                    </div>

                </div>

                <div class="detail-properties">

                    <div class="property-item">
                        <span>Atomic Number</span>
                        <strong>${element.number}</strong>
                    </div>

                    <div class="property-item">
                        <span>Atomic Mass</span>
                        <strong>${element.mass} u</strong>
                    </div>

                    <div class="property-item">
                        <span>Symbol</span>
                        <strong>${element.symbol}</strong>
                    </div>

                    <div class="property-item">
                        <span>Category</span>
                        <strong>${category}</strong>
                    </div>

                    <div class="property-item">
                        <span>Period</span>
                        <strong>${element.period}</strong>
                    </div>

                    <div class="property-item">
                        <span>Group</span>
                        <strong>${element.group}</strong>
                    </div>

                </div>

            </div>
        `;
        elementDetails.classList.add("open");
    }


    // Restore the default information panel
    function showDetailsPlaceholder() {

        elementDetails.classList.remove("open");

        elementDetails.innerHTML = `
            <div class="details-placeholder">
                <span>⚛</span>
                <h2>Discover an Element</h2>
                <p>
                    Select any element from the periodic table
                    to explore its properties.
                </p>
            </div>
        `;
    }


    // Apply search and category filters
    function getFilteredElements() {

        return allElements.filter(element => {

            const matchesCategory =
                activeCategory === "all" ||
                element.category === activeCategory;

            const query = searchQuery.toLowerCase();

            const matchesSearch =
                element.name.toLowerCase().includes(query) ||
                element.symbol.toLowerCase().includes(query) ||
                String(element.number).includes(query);

            return matchesCategory && matchesSearch;

        });
    }


    // Render the periodic table
    function renderPeriodicTable() {

        const filteredElements = getFilteredElements();

        periodicTable.replaceChildren();

        // Group numbers (1–18) across the top
        for (let group = 1; group <= 18; group++) {

            const label = document.createElement("div");

            label.className = "axis-label group-label";
            label.textContent = group;

            label.style.gridColumn = group + 1;
            label.style.gridRow = 1;

            periodicTable.appendChild(label);
        }


        // Period numbers (1–7) along the left
        for (let period = 1; period <= 7; period++) {

            const label = document.createElement("div");

            label.className = "axis-label period-label";
            label.textContent = period;

            label.style.gridColumn = 1;
            label.style.gridRow = period <= 5
                ? period + 1
                : period + 2;

            periodicTable.appendChild(label);

        }

        // Show placeholders only in the complete table view
        if (activeCategory === "all" && searchQuery === "") {

            periodicTable.append(
                createSeriesPlaceholder("57–71", 8),
                createSeriesPlaceholder("89–103", 9)
            );

        }


        // Generate element tiles
        filteredElements.forEach(element => {

            periodicTable.appendChild(
                createElementTile(element)
            );

        });


        // Show message if no elements match
        if (filteredElements.length === 0) {

            const message = document.createElement("div");

            message.className = "no-elements-message";
            message.style.gridColumn = "1 / -1";
            message.textContent = "No matching elements found.";

            periodicTable.appendChild(message);

        }


        // Update count
        visibleCount.textContent = filteredElements.length;


        // Clear selection if selected element is no longer visible
        if (
            selectedElement &&
            !filteredElements.some(
                element => element.number === selectedElement.number
            )
        ) {

            selectedElement = null;
            showDetailsPlaceholder();

        }

    }


    // Handle element clicks
    periodicTable.addEventListener("click", event => {

        const tile = event.target.closest(".element-tile");

        if (!tile) return;

        const elementNumber = Number(tile.dataset.number);

        selectedElement = allElements.find(
            element => element.number === elementNumber
        );

        renderPeriodicTable();
        displayElementDetails(selectedElement);

    });


    // Handle search
    searchInput.addEventListener("input", () => {

        searchQuery = searchInput.value.trim();

        renderPeriodicTable();

    });


    // Handle category filters
    categoryFilters.addEventListener("click", event => {

        const filterButton = event.target.closest(".filter-btn");

        if (!filterButton) return;

        activeCategory = filterButton.dataset.category;

        document.querySelectorAll(".filter-btn").forEach(button => {

            button.classList.toggle(
                "active",
                button === filterButton
            );

        });

        renderPeriodicTable();

    });


    // Reset all filters
    resetButton.addEventListener("click", () => {

        activeCategory = "all";
        searchQuery = "";
        selectedElement = null;

        searchInput.value = "";

        document.querySelectorAll(".filter-btn").forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category === "all"
            );

        });

        showDetailsPlaceholder();
        renderPeriodicTable();

    });


    // Close popup using the close button or backdrop
    elementDetails.addEventListener("click", event => {

        if (
            event.target === elementDetails ||
            event.target.closest(".detail-close")
        ) {
            elementDetails.classList.remove("open");
        }

    });


    // Close popup using Escape key
    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            elementDetails.classList.remove("open");
        }

    });

    // Initialize
    allElements = await loadElements();

    if (allElements.length === 0) return;

    renderPeriodicTable();

}
