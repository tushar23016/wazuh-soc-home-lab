/* =========================================================
   WAZUH SOC HOME LAB
   File: assets/js/search.js
   Purpose: Website search and content filtering

   Features:
   1. Live content search
   2. Search result panel
   3. Keyboard navigation
   4. Search result highlighting
   5. Clear search
   6. Search empty-state handling
   7. Escape key support
   8. Responsive-friendly behavior

   Does not modify navbar or sidebar navigation.
========================================================= */

"use strict";

/* =========================================================
   1. SEARCH APPLICATION
========================================================= */

const SearchApp = {

    initialized: false,

    activeIndex: -1,

    results: [],

    init() {

        if (this.initialized) return;

        this.initialized = true;

        this.cacheElements();

        if (!this.searchInput) {
            console.info(
                "[Wazuh SOC Lab] Search input not found."
            );
            return;
        }

        this.createSearchPanel();

        this.collectSearchableContent();

        this.bindEvents();

        console.log(
            "[Wazuh SOC Lab] Search initialized."
        );

    },

    /* =====================================================
       2. CACHE SEARCH ELEMENTS
    ===================================================== */

    cacheElements() {

        this.searchInput = document.querySelector(
            "#siteSearch, " +
            "#searchInput, " +
            "#search-input, " +
            ".search-input, " +
            "[data-site-search]"
        );

        this.searchForm = document.querySelector(
            "#searchForm, " +
            ".search-form, " +
            "[data-search-form]"
        );

        this.searchButton = document.querySelector(
            "#searchButton, " +
            ".search-button, " +
            "[data-search-button]"
        );

        this.clearButton = document.querySelector(
            "#clearSearch, " +
            ".clear-search, " +
            "[data-clear-search]"
        );

        this.searchContainer = this.searchInput
            ? this.searchInput.closest(
                ".search-container, " +
                ".search-wrapper, " +
                ".search-box, " +
                "[data-search-container]"
            )
            : null;

        this.searchableContainer = document.querySelector(
            "[data-search-content], " +
            "#searchableContent, " +
            ".searchable-content, " +
            "main"
        );

    },

    /* =====================================================
       3. CREATE SEARCH RESULTS PANEL
    ===================================================== */

    createSearchPanel() {

        if (!this.searchInput) return;

        this.searchPanel = document.querySelector(
            "#searchResults, " +
            ".search-results, " +
            "[data-search-results]"
        );

        if (!this.searchPanel) {

            this.searchPanel = document.createElement("div");

            this.searchPanel.id = "searchResults";

            this.searchPanel.className =
                "search-results";

            this.searchPanel.setAttribute(
                "role",
                "listbox"
            );

            this.searchPanel.setAttribute(
                "aria-label",
                "Search results"
            );

            this.searchPanel.hidden = true;

            if (this.searchContainer) {

                this.searchContainer.appendChild(
                    this.searchPanel
                );

            } else {

                this.searchInput.insertAdjacentElement(
                    "afterend",
                    this.searchPanel
                );

            }

        }

        this.searchInput.setAttribute(
            "autocomplete",
            "off"
        );

        this.searchInput.setAttribute(
            "aria-autocomplete",
            "list"
        );

        this.searchInput.setAttribute(
            "aria-controls",
            "searchResults"
        );

        this.searchInput.setAttribute(
            "aria-expanded",
            "false"
        );

    },

    /* =====================================================
       4. COLLECT SEARCHABLE CONTENT
    ===================================================== */

    collectSearchableContent() {

        this.searchItems = [];

        if (!this.searchableContainer) return;

        const selectors = [
            "h1",
            "h2",
            "h3",
            "h4",
            "p",
            "li",
            "article",
            ".card",
            ".feature-card",
            ".module-card",
            ".doc-card",
            ".project-card",
            "[data-search-item]"
        ];

        const elements = this.searchableContainer
            .querySelectorAll(selectors.join(","));

        const seen = new Set();

        elements.forEach((element, index) => {

            // Skip hidden or non-content elements
            if (
                element.closest(
                    "nav, header, footer, aside, " +
                    ".search-results, " +
                    "[hidden], " +
                    "[aria-hidden='true']"
                )
            ) {
                return;
            }

            // Ignore empty text
            const text = element.textContent
                .replace(/\s+/g, " ")
                .trim();

            if (!text || text.length < 3) return;

            // Avoid indexing the same element twice
            if (seen.has(element)) return;

            seen.add(element);

            // Ignore elements nested inside another indexed
            // element when they contain identical text.
            const normalizedText = text.toLowerCase();

            const existing = this.searchItems.some(item =>
                item.text.toLowerCase() === normalizedText
            );

            if (existing) return;

            this.searchItems.push({

                element: element,

                text: text,

                normalizedText: normalizedText,

                id: element.id || `search-item-${index}`,

                title: this.getResultTitle(element),

                url: this.getResultUrl(element)

            });

        });

    },

    /* =====================================================
       5. GET RESULT TITLE
    ===================================================== */

    getResultTitle(element) {

        // Prefer a heading inside the indexed element
        const heading = element.matches(
            "h1, h2, h3, h4"
        )
            ? element
            : element.querySelector(
                "h1, h2, h3, h4, strong"
            );

        if (heading) {

            const title = heading.textContent.trim();

            if (title) return title;

        }

        // Use the nearest section heading
        const section = element.closest("section");

        if (section) {

            const sectionHeading = section.querySelector(
                "h1, h2, h3"
            );

            if (sectionHeading) {

                return sectionHeading.textContent.trim();

            }

        }

        return element.textContent
            .trim()
            .split(/\s+/)
            .slice(0, 8)
            .join(" ");

    },

    /* =====================================================
       6. GET RESULT URL
    ===================================================== */

    getResultUrl(element) {

        // If the element itself is a link
        if (
            element.tagName === "A" &&
            element.href
        ) {
            return element.href;
        }

        // Look for a link inside the result element
        const link = element.querySelector("a[href]");

        if (link && link.href) {
            return link.href;
        }

        // If the element has an ID, link to its section
        if (element.id) {

            return `#${element.id}`;

        }

        // Look for the closest section with an ID
        const section = element.closest("section[id]");

        if (section) {

            return `#${section.id}`;

        }

        return null;

    },

    /* =====================================================
       7. BIND SEARCH EVENTS
    ===================================================== */

    bindEvents() {

        // Live search
        this.searchInput.addEventListener(
            "input",
            () => {

                this.performSearch(
                    this.searchInput.value
                );

            }
        );

        // Search form submission
        if (this.searchForm) {

            this.searchForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.performSearch(
                        this.searchInput.value
                    );

                }
            );

        }

        // Optional search button
        if (this.searchButton) {

            this.searchButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    this.performSearch(
                        this.searchInput.value
                    );

                }
            );

        }

        // Clear search
        if (this.clearButton) {

            this.clearButton.addEventListener(
                "click",
                () => this.clearSearch()
            );

        }

        // Keyboard navigation
        this.searchInput.addEventListener(
            "keydown",
            event => this.handleKeyboard(event)
        );

        // Close results when clicking outside
        document.addEventListener(
            "click",
            event => {

                if (
                    this.searchContainer &&
                    !this.searchContainer.contains(
                        event.target
                    )
                ) {

                    this.hideResults();

                }

            }
        );

        // Close with Escape
        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {

                    this.hideResults();

                }

            }
        );

    },

    /* =====================================================
       8. PERFORM SEARCH
    ===================================================== */

    performSearch(query) {

        const searchTerm = query
            .trim()
            .toLowerCase();

        this.activeIndex = -1;

        if (!searchTerm) {

            this.hideResults();

            this.removeHighlights();

            return;

        }

        const terms = searchTerm
            .split(/\s+/)
            .filter(Boolean);

        this.results = this.searchItems
            .map(item => {

                const title = item.title.toLowerCase();

                const content = item.normalizedText;

                let score = 0;

                terms.forEach(term => {

                    if (title.includes(term)) {

                        score += 10;

                    }

                    if (content.includes(term)) {

                        score += 3;

                    }

                });

                // Every search term must appear somewhere
                const matchesAllTerms = terms.every(term =>
                    content.includes(term)
                );

                return {

                    ...item,

                    score: score,

                    matches: matchesAllTerms

                };

            })
            .filter(item => item.matches)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        this.renderResults(searchTerm);

    },

    /* =====================================================
       9. RENDER SEARCH RESULTS
    ===================================================== */

    renderResults(searchTerm) {

        if (!this.searchPanel) return;

        this.searchPanel.replaceChildren();

        this.searchPanel.hidden = false;

        this.searchInput.setAttribute(
            "aria-expanded",
            "true"
        );

        if (!this.results.length) {

            const empty = document.createElement("div");

            empty.className = "search-empty";

            empty.textContent =
                `No results found for "${searchTerm}"`;

            this.searchPanel.appendChild(empty);

            return;

        }

        const header = document.createElement("div");

        header.className = "search-results-header";

        header.textContent =
            `${this.results.length} result` +
            (this.results.length !== 1 ? "s" : "");

        this.searchPanel.appendChild(header);

        this.results.forEach((result, index) => {

            const item = document.createElement("a");

            item.className = "search-result-item";

            item.setAttribute(
                "role",
                "option"
            );

            item.setAttribute(
                "aria-selected",
                "false"
            );

            item.setAttribute(
                "data-search-index",
                index
            );

            if (result.url) {

                item.href = result.url;

            } else {

                item.href = "#";

            }

            const title = document.createElement("div");

            title.className = "search-result-title";

            title.textContent = result.title;

            const description =
                document.createElement("div");

            description.className =
                "search-result-description";

            description.textContent =
                this.createSnippet(
                    result.text,
                    searchTerm
                );

            item.appendChild(title);

            item.appendChild(description);

            item.addEventListener(
                "click",
                event => {

                    if (!result.url) {

                        event.preventDefault();

                        result.element.scrollIntoView({

                            behavior: this.prefersReducedMotion()
                                ? "auto"
                                : "smooth",

                            block: "center"

                        });

                    }

                    this.hideResults();

                }
            );

            this.searchPanel.appendChild(item);

        });

    },

    /* =====================================================
       10. CREATE SEARCH SNIPPET
    ===================================================== */

    createSnippet(text, query) {

        const normalized = text
            .replace(/\s+/g, " ")
            .trim();

        const lowerText = normalized.toLowerCase();

        const firstTerm = query
            .toLowerCase()
            .split(/\s+/)[0];

        const position = lowerText.indexOf(firstTerm);

        if (position === -1) {

            return normalized.slice(0, 120) +
                (normalized.length > 120 ? "..." : "");

        }

        const start = Math.max(
            0,
            position - 45
        );

        const end = Math.min(
            normalized.length,
            position + 90
        );

        let snippet = normalized.slice(start, end);

        if (start > 0) {

            snippet = "..." + snippet;

        }

        if (end < normalized.length) {

            snippet += "...";

        }

        return snippet;

    },

    /* =====================================================
       11. KEYBOARD NAVIGATION
    ===================================================== */

    handleKeyboard(event) {

        const resultElements =
            this.searchPanel.querySelectorAll(
                ".search-result-item"
            );

        if (!resultElements.length) return;

        if (event.key === "ArrowDown") {

            event.preventDefault();

            this.activeIndex = Math.min(
                this.activeIndex + 1,
                resultElements.length - 1
            );

            this.updateActiveResult();

        }

        if (event.key === "ArrowUp") {

            event.preventDefault();

            this.activeIndex = Math.max(
                this.activeIndex - 1,
                0
            );

            this.updateActiveResult();

        }

        if (event.key === "Enter") {

            if (this.activeIndex >= 0) {

                event.preventDefault();

                resultElements[
                    this.activeIndex
                ].click();

            }

        }

    },

    updateActiveResult() {

        const items =
            this.searchPanel.querySelectorAll(
                ".search-result-item"
            );

        items.forEach((item, index) => {

            const active =
                index === this.activeIndex;

            item.classList.toggle(
                "active",
                active
            );

            item.setAttribute(
                "aria-selected",
                String(active)
            );

            if (active) {

                item.scrollIntoView({

                    block: "nearest",

                    behavior: "auto"

                });

            }

        });

    },

    /* =====================================================
       12. CLEAR SEARCH
    ===================================================== */

    clearSearch() {

        if (this.searchInput) {

            this.searchInput.value = "";

            this.searchInput.focus();

        }

        this.hideResults();

        this.removeHighlights();

    },

    /* =====================================================
       13. HIDE SEARCH RESULTS
    ===================================================== */

    hideResults() {

        if (!this.searchPanel) return;

        this.searchPanel.hidden = true;

        this.activeIndex = -1;

        if (this.searchInput) {

            this.searchInput.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    },

    /* =====================================================
       14. REMOVE SEARCH HIGHLIGHTS
    ===================================================== */

    removeHighlights() {

        document.querySelectorAll(
            ".search-highlight"
        ).forEach(element => {

            const parent = element.parentNode;

            if (!parent) return;

            parent.replaceChild(
                document.createTextNode(
                    element.textContent
                ),
                element
            );

            parent.normalize();

        });

    },

    /* =====================================================
       15. REDUCED MOTION
    ===================================================== */

    prefersReducedMotion() {

        return Boolean(

            window.matchMedia &&

            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches

        );

    }

};

/* =========================================================
   16. INITIALIZE SEARCH
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => SearchApp.init(),
        { once: true }
    );

} else {

    SearchApp.init();

}

/* =========================================================
   17. GLOBAL ACCESS
========================================================= */

window.SearchApp = SearchApp;

/* ================= END OF SEARCH.JS ===================== */