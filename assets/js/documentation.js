/* =========================================================
   WAZUH SOC HOME LAB
   File: assets/js/documentation.js
   Purpose: Documentation page interactions

   Features:
   1. Reading progress indicator
   2. Dynamic table of contents
   3. Active section highlighting
   4. Smooth heading navigation
   5. Copy code blocks
   6. Collapsible documentation sections
   7. Expand / collapse all sections
   8. Back-to-top support
   9. Print documentation
========================================================= */

"use strict";

/* =========================================================
   1. DOCUMENTATION APPLICATION
========================================================= */

const DocumentationApp = {

    initialized: false,

    init() {

        if (this.initialized) return;

        this.initialized = true;

        this.cacheElements();
        this.initReadingProgress();
        this.initTableOfContents();
        this.initHeadingAnchors();
        this.initCodeCopy();
        this.initCollapsibleSections();
        this.initExpandCollapseAll();
        this.initPrintButton();
        this.initBackToTop();

        console.log(
            "[Wazuh SOC Lab] Documentation initialized."
        );

    },

    /* =====================================================
       2. CACHE ELEMENTS
    ===================================================== */

    cacheElements() {

        this.progressBar = document.querySelector(
            "#readingProgress, " +
            "#reading-progress, " +
            ".reading-progress-bar"
        );

        this.progressContainer = document.querySelector(
            ".reading-progress"
        );

        this.toc = document.querySelector(
            "#tableOfContents, " +
            "#table-of-contents, " +
            ".documentation-toc, " +
            ".docs-toc"
        );

        this.content = document.querySelector(
            "#documentationContent, " +
            "#documentation-content, " +
            ".documentation-content, " +
            ".docs-content, " +
            "main"
        );

        this.backToTopButton = document.querySelector(
            "#backToTop, " +
            "#back-to-top, " +
            ".back-to-top"
        );

    },

    /* =====================================================
       3. READING PROGRESS
    ===================================================== */

    initReadingProgress() {

        if (!this.progressBar) return;

        let ticking = false;

        const updateProgress = () => {

            const documentHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;

            let progress = 0;

            if (documentHeight > 0) {

                progress =
                    (window.scrollY / documentHeight) * 100;

            }

            progress = Math.min(
                100,
                Math.max(0, progress)
            );

            this.progressBar.style.width =
                `${progress}%`;

            this.progressBar.setAttribute(
                "aria-valuenow",
                Math.round(progress)
            );

            ticking = false;

        };

        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    window.requestAnimationFrame(
                        updateProgress
                    );

                    ticking = true;

                }

            },
            { passive: true }
        );

        window.addEventListener(
            "resize",
            updateProgress,
            { passive: true }
        );

        updateProgress();

    },

    /* =====================================================
       4. TABLE OF CONTENTS
    ===================================================== */

    initTableOfContents() {

        if (!this.toc || !this.content) return;

        const headings = this.getContentHeadings();

        if (!headings.length) return;

        // Generate a TOC only when the TOC container is empty
        // or explicitly marked for automatic generation.

        const shouldGenerate =
            this.toc.children.length === 0 ||
            this.toc.hasAttribute("data-auto-toc");

        if (shouldGenerate) {

            this.generateTableOfContents(headings);

        }

        this.initActiveTocTracking(headings);

    },

    getContentHeadings() {

        if (!this.content) return [];

        return Array.from(
            this.content.querySelectorAll(
                "h2, h3"
            )
        ).filter(heading => {

            // Exclude headings inside navigation and hidden elements
            return !heading.closest(
                "nav, .documentation-toc, .docs-toc, " +
                "[hidden], [aria-hidden='true']"
            );

        });

    },

    generateTableOfContents(headings) {

        const list = document.createElement("ul");

        list.className = "docs-toc-list";

        headings.forEach((heading, index) => {

            // Generate an ID when the heading has none
            if (!heading.id) {

                heading.id = this.createHeadingId(
                    heading.textContent,
                    index
                );

            }

            const item = document.createElement("li");

            item.className =
                heading.tagName.toLowerCase() === "h3"
                    ? "toc-subitem"
                    : "toc-item";

            const link = document.createElement("a");

            link.href = `#${heading.id}`;

            link.textContent =
                heading.textContent.trim();

            link.className = "toc-link";

            link.setAttribute(
                "data-toc-target",
                heading.id
            );

            item.appendChild(link);

            list.appendChild(item);

        });

        this.toc.replaceChildren(list);

    },

    createHeadingId(text, index) {

        const slug = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        return slug || `documentation-section-${index + 1}`;

    },

    /* =====================================================
       5. ACTIVE TOC SECTION TRACKING
    ===================================================== */

    initActiveTocTracking(headings) {

        const tocLinks = this.toc.querySelectorAll(
            "a[href^='#'], [data-toc-target]"
        );

        if (!tocLinks.length) return;

        const linksById = new Map();

        tocLinks.forEach(link => {

            const targetId =
                link.getAttribute("data-toc-target") ||
                decodeURIComponent(
                    link.getAttribute("href").slice(1)
                );

            if (!targetId) return;

            linksById.set(targetId, link);

        });

        const setActiveHeading = (headingId) => {

            tocLinks.forEach(link => {

                link.classList.remove("active");

                link.removeAttribute("aria-current");

            });

            const activeLink = linksById.get(headingId);

            if (activeLink) {

                activeLink.classList.add("active");

                activeLink.setAttribute(
                    "aria-current",
                    "location"
                );

                // Keep the active item visible in a scrollable TOC
                if (
                    this.toc.scrollHeight >
                    this.toc.clientHeight
                ) {

                    activeLink.scrollIntoView({

                        block: "nearest",

                        behavior: this.prefersReducedMotion()
                            ? "auto"
                            : "smooth"

                    });

                }

            }

        };

        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            entries => {

                const visibleHeadings = entries
                    .filter(entry => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                    );

                if (visibleHeadings.length) {

                    setActiveHeading(
                        visibleHeadings[0].target.id
                    );

                }

            },
            {
                rootMargin: "-100px 0px -70% 0px",
                threshold: 0
            }
        );

        headings.forEach(heading => {

            if (heading.id) {

                observer.observe(heading);

            }

        });

    },

    /* =====================================================
       6. HEADING ANCHORS
    ===================================================== */

    initHeadingAnchors() {

        if (!this.content) return;

        const headings = this.content.querySelectorAll(
            "h2, h3"
        );

        headings.forEach(heading => {

            if (!heading.id) {

                heading.id = this.createHeadingId(
                    heading.textContent,
                    0
                );

            }

            heading.style.scrollMarginTop = "100px";

            // Add a copy-link button to each heading
            if (
                heading.querySelector(".heading-anchor")
            ) return;

            const anchor = document.createElement("button");

            anchor.type = "button";

            anchor.className = "heading-anchor";

            anchor.textContent = "#";

            anchor.title = "Copy section link";

            anchor.setAttribute(
                "aria-label",
                `Copy link to ${heading.textContent.trim()}`
            );

            anchor.addEventListener(
                "click",
                async () => {

                    const url = new URL(
                        `#${heading.id}`,
                        window.location.href
                    ).href;

                    try {

                        await this.copyText(url);

                        this.showToast(
                            "Section link copied.",
                            "success"
                        );

                    } catch (error) {

                        // Fallback: navigate to the heading
                        window.location.hash = heading.id;

                    }

                }
            );

            heading.appendChild(anchor);

        });

    },

    /* =====================================================
       7. COPY CODE BLOCKS
    ===================================================== */

    initCodeCopy() {

        if (!this.content) return;

        const codeBlocks = this.content.querySelectorAll(
            "pre"
        );

        codeBlocks.forEach(pre => {

            if (
                pre.dataset.copyInitialized === "true"
            ) return;

            pre.dataset.copyInitialized = "true";

            // Avoid duplicate buttons
            if (
                pre.querySelector(".code-copy-button")
            ) return;

            const button = document.createElement("button");

            button.type = "button";

            button.className = "code-copy-button";

            button.textContent = "Copy";

            button.setAttribute(
                "aria-label",
                "Copy code block"
            );

            button.addEventListener(
                "click",
                async () => {

                    const code = pre.querySelector("code");

                    const text = code
                        ? code.textContent
                        : pre.textContent;

                    try {

                        await this.copyText(text);

                        button.textContent = "Copied!";

                        button.classList.add("copied");

                        this.showToast(
                            "Code copied to clipboard.",
                            "success"
                        );

                        window.setTimeout(() => {

                            button.textContent = "Copy";

                            button.classList.remove("copied");

                        }, 1800);

                    } catch (error) {

                        console.error(
                            "Code copy failed:",
                            error
                        );

                        this.showToast(
                            "Unable to copy code.",
                            "error"
                        );

                    }

                }
            );

            pre.appendChild(button);

        });

    },

    /* =====================================================
       8. COLLAPSIBLE SECTIONS
    ===================================================== */

    initCollapsibleSections() {

        if (!this.content) return;

        const sections = this.content.querySelectorAll(
            "[data-doc-collapse]"
        );

        sections.forEach(section => {

            const heading = section.querySelector(
                "h2, h3, h4"
            );

            if (!heading) return;

            if (
                heading.querySelector(
                    ".docs-collapse-toggle"
                )
            ) return;

            const button = document.createElement("button");

            button.type = "button";

            button.className =
                "docs-collapse-toggle";

            button.textContent = "−";

            button.setAttribute(
                "aria-label",
                "Collapse section"
            );

            button.setAttribute(
                "aria-expanded",
                "true"
            );

            const contentElements = Array.from(
                section.children
            ).filter(element => element !== heading);

            button.addEventListener(
                "click",
                () => {

                    const isExpanded =
                        button.getAttribute(
                            "aria-expanded"
                        ) === "true";

                    button.setAttribute(
                        "aria-expanded",
                        String(!isExpanded)
                    );

                    button.textContent =
                        isExpanded ? "+" : "−";

                    button.setAttribute(
                        "aria-label",
                        isExpanded
                            ? "Expand section"
                            : "Collapse section"
                    );

                    contentElements.forEach(element => {

                        element.hidden = isExpanded;

                    });

                }
            );

            heading.appendChild(button);

        });

    },

    /* =====================================================
       9. EXPAND / COLLAPSE ALL
    ===================================================== */

    initExpandCollapseAll() {

        const expandButton = document.querySelector(
            "[data-doc-expand-all]"
        );

        const collapseButton = document.querySelector(
            "[data-doc-collapse-all]"
        );

        if (!expandButton && !collapseButton) return;

        const getSections = () => {

            if (!this.content) return [];

            return this.content.querySelectorAll(
                "[data-doc-collapse]"
            );

        };

        const setSections = (expanded) => {

            getSections().forEach(section => {

                const button = section.querySelector(
                    ".docs-collapse-toggle"
                );

                if (!button) return;

                button.setAttribute(
                    "aria-expanded",
                    String(expanded)
                );

                button.textContent =
                    expanded ? "−" : "+";

                button.setAttribute(
                    "aria-label",
                    expanded
                        ? "Collapse section"
                        : "Expand section"
                );

                Array.from(section.children)
                    .filter(
                        element =>
                            !element.matches("h2, h3, h4")
                    )
                    .forEach(element => {

                        element.hidden = !expanded;

                    });

            });

        };

        if (expandButton) {

            expandButton.addEventListener(
                "click",
                () => setSections(true)
            );

        }

        if (collapseButton) {

            collapseButton.addEventListener(
                "click",
                () => setSections(false)
            );

        }

    },

    /* =====================================================
       10. PRINT DOCUMENTATION
    ===================================================== */

    initPrintButton() {

        const printButton = document.querySelector(
            "[data-doc-print], #printDocumentation"
        );

        if (!printButton) return;

        printButton.addEventListener(
            "click",
            () => window.print()
        );

    },

    /* =====================================================
       11. BACK TO TOP
    ===================================================== */

    initBackToTop() {

        const button = this.backToTopButton;

        if (!button) return;

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                window.scrollTo({

                    top: 0,

                    behavior: this.prefersReducedMotion()
                        ? "auto"
                        : "smooth"

                });

            }
        );

    },

    /* =====================================================
       12. CLIPBOARD UTILITY
    ===================================================== */

    async copyText(text) {

        const value = String(text);

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(value);

            return;

        }

        const textarea = document.createElement("textarea");

        textarea.value = value;

        textarea.setAttribute("readonly", "");

        textarea.style.position = "fixed";

        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        const copied = document.execCommand("copy");

        textarea.remove();

        if (!copied) {

            throw new Error(
                "Clipboard is unavailable."
            );

        }

    },

    /* =====================================================
       13. TOAST NOTIFICATIONS
    ===================================================== */

    showToast(message, type = "info") {

        // Use MainApp's notification system if available
        if (
            window.MainApp &&
            typeof window.MainApp.showToast === "function"
        ) {

            window.MainApp.showToast(
                message,
                type
            );

            return;

        }

        let container = document.querySelector(
            "#toastRegion, #toast-container, .toast-container"
        );

        if (!container) {

            container = document.createElement("div");

            container.id = "toastRegion";

            container.className = "toast-container";

            container.setAttribute(
                "role",
                "status"
            );

            container.setAttribute(
                "aria-live",
                "polite"
            );

            document.body.appendChild(container);

        }

        const toast = document.createElement("div");

        toast.className =
            `site-toast site-toast--${type}`;

        toast.textContent = message;

        container.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("is-visible");

        });

        window.setTimeout(() => {

            toast.classList.remove("is-visible");

            window.setTimeout(
                () => toast.remove(),
                300
            );

        }, 3000);

    },

    /* =====================================================
       14. ACCESSIBILITY
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
   15. INITIALIZE DOCUMENTATION
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => DocumentationApp.init(),
        { once: true }
    );

} else {

    DocumentationApp.init();

}

/* =========================================================
   16. GLOBAL ACCESS
========================================================= */

window.DocumentationApp = DocumentationApp;

/* ================= END OF DOCUMENTATION.JS ============== */