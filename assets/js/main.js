/* =========================================================
   WAZUH SOC HOME LAB
   File: assets/js/main.js
   Purpose: Main website initialization and shared features
========================================================= */

"use strict";

/* =========================================================
   1. MAIN APPLICATION
========================================================= */

const MainApp = {

    initialized: false,

    init() {
        if (this.initialized) return;

        this.initialized = true;

        this.cacheElements();
        this.handlePageLoader();
        this.setCurrentYear();
        this.initBackToTop();
        this.initScrollReveal();
        this.initCopyButtons();
        this.secureExternalLinks();
        this.initFormProtection();
        this.initKeyboardHelpers();
        this.markAppReady();

        console.log("[Wazuh SOC Lab] MainApp initialized.");
    },

    /* =====================================================
       2. CACHE ELEMENTS
    ===================================================== */

    cacheElements() {

        this.loader = document.querySelector(
            "#loader, #preloader, .loader, .preloader"
        );

        this.backToTopButton = document.querySelector(
            "#backToTop, #back-to-top, .back-to-top"
        );

    },

    /* =====================================================
       3. PAGE LOADER
    ===================================================== */

    handlePageLoader() {

        const hideLoader = () => {

            if (!this.loader) return;

            this.loader.classList.add("is-hidden");

            this.loader.setAttribute(
                "aria-hidden",
                "true"
            );

            window.setTimeout(() => {

                if (this.loader) {
                    this.loader.style.display = "none";
                }

            }, 700);

        };

        if (document.readyState === "complete") {

            hideLoader();

        } else {

            window.addEventListener(
                "load",
                hideLoader,
                { once: true }
            );

        }

        // Fallback for slow-loading pages
        window.setTimeout(hideLoader, 5000);

    },

    /* =====================================================
       4. AUTOMATIC FOOTER YEAR
    ===================================================== */

    setCurrentYear() {

        const year = new Date().getFullYear();

        document.querySelectorAll(
            "[data-current-year], #currentYear"
        ).forEach(element => {

            element.textContent = year;

        });

    },

    /* =====================================================
       5. BACK TO TOP BUTTON
    ===================================================== */

    initBackToTop() {

        const button = this.backToTopButton;

        if (!button) return;

        const updateButton = () => {

            const visible = window.scrollY > 350;

            button.classList.toggle(
                "is-visible",
                visible
            );

            button.setAttribute(
                "aria-hidden",
                String(!visible)
            );

            button.tabIndex = visible ? 0 : -1;

        };

        button.addEventListener("click", event => {

            event.preventDefault();

            window.scrollTo({

                top: 0,

                behavior: this.prefersReducedMotion()
                    ? "auto"
                    : "smooth"

            });

        });

        window.addEventListener(
            "scroll",
            updateButton,
            { passive: true }
        );

        updateButton();

    },

    /* =====================================================
       6. SCROLL REVEAL ANIMATIONS
    ===================================================== */

    initScrollReveal() {

        const elements = document.querySelectorAll(
            "[data-reveal], .reveal"
        );

        if (!elements.length) return;

        // Accessibility: respect reduced-motion preference
        if (
            !("IntersectionObserver" in window) ||
            this.prefersReducedMotion()
        ) {

            elements.forEach(element => {

                element.classList.add(
                    "reveal-ready",
                    "is-visible"
                );

                element.classList.remove("is-hidden");

            });

            return;
        }

        elements.forEach(element => {

            element.classList.add("reveal-ready");

        });

        const observer = new IntersectionObserver(
            (entries, activeObserver) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");

                    entry.target.classList.remove("is-hidden");

                    activeObserver.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,

                rootMargin: "0px 0px -40px 0px"
            }
        );

        elements.forEach(element => {

            observer.observe(element);

        });

    },

    /* =====================================================
       7. COPY TO CLIPBOARD
    ===================================================== */

    initCopyButtons() {

        const buttons = document.querySelectorAll(
            "[data-copy], .copy-btn, .copy-button"
        );

        buttons.forEach(button => {

            if (
                button.dataset.copyInitialized === "true"
            ) return;

            button.dataset.copyInitialized = "true";

            button.addEventListener(
                "click",
                async event => {

                    event.preventDefault();

                    const selector = button.getAttribute(
                        "data-copy-target"
                    );

                    const target = selector
                        ? document.querySelector(selector)
                        : null;

                    const value = target
                        ? (
                            "value" in target
                                ? target.value
                                : target.textContent
                        )
                        : button.getAttribute("data-copy");

                    if (!value) {

                        this.showToast(
                            "Nothing to copy.",
                            "warning"
                        );

                        return;
                    }

                    try {

                        await this.copyText(value);

                        this.showToast(
                            "Copied to clipboard.",
                            "success"
                        );

                        const originalText =
                            button.dataset.originalText ||
                            button.textContent;

                        button.dataset.originalText =
                            originalText;

                        button.classList.add("copied");

                        if (
                            button.hasAttribute("data-copy-label")
                        ) {

                            button.textContent =
                                button.getAttribute(
                                    "data-copy-label"
                                );

                        }

                        window.setTimeout(() => {

                            button.classList.remove("copied");

                            if (
                                button.hasAttribute(
                                    "data-copy-label"
                                )
                            ) {

                                button.textContent =
                                    originalText;

                            }

                        }, 1600);

                    } catch (error) {

                        console.error(
                            "Clipboard operation failed:",
                            error
                        );

                        this.showToast(
                            "Copy failed. Please copy manually.",
                            "error"
                        );

                    }

                }
            );

        });

    },

    /* =====================================================
       8. CLIPBOARD FUNCTION
    ===================================================== */

    async copyText(text) {

        const value = String(text);

        // Modern Clipboard API
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(value);

            return;

        }

        // Fallback for older browsers and local testing
        const textarea = document.createElement("textarea");

        textarea.value = value;

        textarea.setAttribute("readonly", "");

        textarea.style.position = "fixed";

        textarea.style.opacity = "0";

        textarea.style.pointerEvents = "none";

        document.body.appendChild(textarea);

        textarea.select();

        const copied = document.execCommand("copy");

        textarea.remove();

        if (!copied) {

            throw new Error(
                "Clipboard API is unavailable."
            );

        }

    },

    /* =====================================================
       9. TOAST NOTIFICATIONS
    ===================================================== */

    showToast(message, type = "info") {

        let container = document.querySelector(
            "#toastRegion, #toast-container, .toast-container"
        );

        if (!container) {

            container = document.createElement("div");

            container.id = "toastRegion";

            container.className = "toast-container";

            container.setAttribute("role", "status");

            container.setAttribute(
                "aria-live",
                "polite"
            );

            document.body.appendChild(container);

        }

        const toast = document.createElement("div");

        toast.className =
            `site-toast site-toast--${type}`;

        toast.setAttribute(
            "role",
            type === "error" ? "alert" : "status"
        );

        toast.textContent = message;

        container.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("is-visible");

        });

        window.setTimeout(() => {

            toast.classList.remove("is-visible");

            window.setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3200);

    },

    /* =====================================================
       10. SECURE EXTERNAL LINKS
    ===================================================== */

    secureExternalLinks() {

        document.querySelectorAll(
            'a[target="_blank"]'
        ).forEach(link => {

            const rel = new Set(

                (link.getAttribute("rel") || "")
                    .split(/\s+/)
                    .filter(Boolean)

            );

            rel.add("noopener");

            rel.add("noreferrer");

            link.setAttribute(
                "rel",
                Array.from(rel).join(" ")
            );

        });

    },

    /* =====================================================
       11. OPTIONAL FORM PROTECTION
    ===================================================== */

    initFormProtection() {

        document.querySelectorAll(
            "form[data-prevent-double-submit]"
        ).forEach(form => {

            form.addEventListener("submit", () => {

                if (!form.checkValidity()) return;

                const button = form.querySelector(
                    'button[type="submit"], input[type="submit"]'
                );

                if (!button) return;

                button.disabled = true;

                button.classList.add(
                    "is-submitting"
                );

                if (button.tagName === "INPUT") {

                    button.dataset.originalText =
                        button.value;

                    button.value = "Please wait...";

                } else if (
                    button.hasAttribute("data-loading-text")
                ) {

                    button.dataset.originalText =
                        button.textContent;

                    button.textContent =
                        button.getAttribute(
                            "data-loading-text"
                        );

                }

            });

        });

    },

    /* =====================================================
       12. KEYBOARD ACCESSIBILITY
    ===================================================== */

    initKeyboardHelpers() {

        document.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Escape") return;

                const overlays = document.querySelectorAll(
                    ".modal.is-open, " +
                    ".modal.active, " +
                    "[data-modal].is-open, " +
                    ".lightbox.is-open"
                );

                overlays.forEach(overlay => {

                    overlay.classList.remove(
                        "is-open",
                        "active"
                    );

                    overlay.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                });

            }
        );

    },

    /* =====================================================
       13. APP READY STATE
    ===================================================== */

    markAppReady() {

        const markReady = () => {

            document.documentElement.classList.add(
                "app-ready"
            );

            document.body.classList.add(
                "app-ready"
            );

        };

        if (
            document.readyState === "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                markReady,
                { once: true }
            );

        } else {

            markReady();

        }

    },

    /* =====================================================
       14. REDUCED MOTION CHECK
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
   15. INITIALIZE MAIN APPLICATION
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => MainApp.init(),
        { once: true }
    );

} else {

    MainApp.init();

}




/* =========================================================
   16. GLOBAL ACCESS
========================================================= */

window.MainApp = MainApp;

/* ================= END OF MAIN.JS ======================== */