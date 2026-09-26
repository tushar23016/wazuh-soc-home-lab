/* =========================================================
   WAZUH SOC HOME LAB
   File: assets/js/gallery.js
   Purpose: Screenshot gallery and image lightbox

   Features:
   1. Image lightbox
   2. Next / previous navigation
   3. Keyboard controls
   4. Image captions and counter
   5. Touch swipe navigation
   6. Image download button
   7. Image loading and error handling
   8. Escape key to close
   9. Responsive-friendly interactions

   Does not modify navbar or sidebar.
========================================================= */

"use strict";

/* =========================================================
   1. GALLERY APPLICATION
========================================================= */

const GalleryApp = {

    initialized: false,

    activeGallery: [],
    activeIndex: 0,
    activeImage: null,

    touchStartX: 0,
    touchStartY: 0,

    lightbox: null,
    lightboxImage: null,
    lightboxCaption: null,
    lightboxCounter: null,
    downloadButton: null,

    init() {

        if (this.initialized) return;

        this.initialized = true;

        this.cacheElements();
        this.initGalleryImages();
        this.initLightbox();
        this.initKeyboardControls();
        this.initTouchControls();

        console.log(
            "[Wazuh SOC Lab] Gallery initialized."
        );

    },

    /* =====================================================
       2. CACHE ELEMENTS
    ===================================================== */

    cacheElements() {

        this.galleryContainers = document.querySelectorAll(
            "[data-gallery], " +
            ".dashboard-gallery, " +
            ".image-gallery, " +
            ".screenshot-gallery"
        );

    },

    /* =====================================================
       3. INITIALIZE GALLERY IMAGES
    ===================================================== */

    initGalleryImages() {

        this.galleryContainers.forEach(container => {

            const images = container.querySelectorAll(
                "img"
            );

            images.forEach((image, index) => {

                // Avoid duplicate initialization
                if (
                    image.dataset.galleryInitialized === "true"
                ) return;

                image.dataset.galleryInitialized = "true";

                // Give the image a useful accessibility label
                if (!image.hasAttribute("alt")) {

                    image.alt =
                        `Gallery image ${index + 1}`;

                }

                // Make gallery images keyboard accessible
                image.setAttribute("tabindex", "0");

                image.setAttribute(
                    "role",
                    "button"
                );

                image.setAttribute(
                    "aria-label",
                    `Open image: ${image.alt}`
                );

                image.style.cursor = "zoom-in";

                image.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        this.openGalleryImage(
                            container,
                            image
                        );

                    }
                );

                image.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            this.openGalleryImage(
                                container,
                                image
                            );

                        }

                    }
                );

            });

        });

    },

    /* =====================================================
       4. CREATE LIGHTBOX
    ===================================================== */

    initLightbox() {

        // Use an existing lightbox if the page already has one
        this.lightbox = document.querySelector(
            "#galleryLightbox, " +
            ".gallery-lightbox, " +
            "[data-gallery-lightbox]"
        );

        if (this.lightbox) {

            this.lightboxImage =
                this.lightbox.querySelector(
                    ".lightbox-image, " +
                    "[data-lightbox-image]"
                );

            this.lightboxCaption =
                this.lightbox.querySelector(
                    ".lightbox-caption, " +
                    "[data-lightbox-caption]"
                );

            this.lightboxCounter =
                this.lightbox.querySelector(
                    ".lightbox-counter, " +
                    "[data-lightbox-counter]"
                );

            this.downloadButton =
                this.lightbox.querySelector(
                    ".lightbox-download, " +
                    "[data-lightbox-download]"
                );

            return;

        }

        // Create the lightbox dynamically
        this.createLightbox();

    },

    /* =====================================================
       5. BUILD LIGHTBOX HTML
    ===================================================== */

    createLightbox() {

        const lightbox = document.createElement("div");

        lightbox.id = "galleryLightbox";

        lightbox.className = "gallery-lightbox";

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        lightbox.setAttribute(
            "role",
            "dialog"
        );

        lightbox.setAttribute(
            "aria-modal",
            "true"
        );

        lightbox.setAttribute(
            "aria-label",
            "Image viewer"
        );

        lightbox.innerHTML = `
            <div class="lightbox-backdrop"
                 data-lightbox-close></div>

            <div class="lightbox-content">

                <div class="lightbox-toolbar">

                    <span
                        class="lightbox-counter"
                        data-lightbox-counter
                        aria-live="polite">
                    </span>

                    <div class="lightbox-actions">

                        <a
                            class="lightbox-download"
                            data-lightbox-download
                            href="#"
                            download
                            aria-label="Download image"
                            title="Download image">
                            ↓
                        </a>

                        <button
                            type="button"
                            class="lightbox-close"
                            data-lightbox-close
                            aria-label="Close image viewer"
                            title="Close">
                            ×
                        </button>

                    </div>

                </div>

                <button
                    type="button"
                    class="lightbox-prev"
                    data-lightbox-prev
                    aria-label="Previous image"
                    title="Previous image">
                    &#10094;
                </button>

                <div class="lightbox-image-wrapper">

                    <img
                        class="lightbox-image"
                        data-lightbox-image
                        alt=""
                    >

                    <div
                        class="lightbox-loading"
                        aria-live="polite">
                        Loading image...
                    </div>

                </div>

                <button
                    type="button"
                    class="lightbox-next"
                    data-lightbox-next
                    aria-label="Next image"
                    title="Next image">
                    &#10095;
                </button>

                <div
                    class="lightbox-caption"
                    data-lightbox-caption>
                </div>

            </div>
        `;

        document.body.appendChild(lightbox);

        this.lightbox = lightbox;

        this.lightboxImage =
            lightbox.querySelector(
                "[data-lightbox-image]"
            );

        this.lightboxCaption =
            lightbox.querySelector(
                "[data-lightbox-caption]"
            );

        this.lightboxCounter =
            lightbox.querySelector(
                "[data-lightbox-counter]"
            );

        this.downloadButton =
            lightbox.querySelector(
                "[data-lightbox-download]"
            );

        this.bindLightboxButtons();

    },

    /* =====================================================
       6. LIGHTBOX BUTTON EVENTS
    ===================================================== */

    bindLightboxButtons() {

        if (!this.lightbox) return;

        this.lightbox.querySelectorAll(
            "[data-lightbox-close]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => this.closeLightbox()
            );

        });

        const previousButton =
            this.lightbox.querySelector(
                "[data-lightbox-prev]"
            );

        const nextButton =
            this.lightbox.querySelector(
                "[data-lightbox-next]"
            );

        if (previousButton) {

            previousButton.addEventListener(
                "click",
                () => this.showPrevious()
            );

        }

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => this.showNext()
            );

        }

    },

    /* =====================================================
       7. OPEN GALLERY IMAGE
    ===================================================== */

    openGalleryImage(container, image) {

        if (!this.lightbox) return;

        const images = Array.from(
            container.querySelectorAll("img")
        );

        this.activeGallery = images;

        this.activeIndex = images.indexOf(image);

        this.activeImage = image;

        this.previousFocusedElement = image;

        this.lightbox.classList.add("is-open");

        this.lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "lightbox-open"
        );

        document.body.style.overflow = "hidden";

        this.displayImage(this.activeIndex);

        const closeButton =
            this.lightbox.querySelector(
                ".lightbox-close"
            );

        if (closeButton) {

            closeButton.focus();

        }

    },

    /* =====================================================
       8. DISPLAY IMAGE
    ===================================================== */

    displayImage(index) {

        if (
            !this.activeGallery.length ||
            !this.lightboxImage
        ) return;

        if (index < 0) {

            index = this.activeGallery.length - 1;

        }

        if (index >= this.activeGallery.length) {

            index = 0;

        }

        this.activeIndex = index;

        const sourceImage =
            this.activeGallery[index];

        const imageSource =
            sourceImage.currentSrc ||
            sourceImage.src;

        const imageAlt =
            sourceImage.alt ||
            `Gallery image ${index + 1}`;

        const caption =
            sourceImage.dataset.caption ||
            sourceImage.getAttribute("title") ||
            imageAlt;

        // Show loading state
        this.lightboxImage.classList.remove(
            "is-loaded"
        );

        const loadingIndicator =
            this.lightbox.querySelector(
                ".lightbox-loading"
            );

        if (loadingIndicator) {

            loadingIndicator.hidden = false;

        }

        this.lightboxImage.alt = imageAlt;

        this.lightboxImage.onload = () => {

            this.lightboxImage.classList.add(
                "is-loaded"
            );

            if (loadingIndicator) {

                loadingIndicator.hidden = true;

            }

        };

        this.lightboxImage.onerror = () => {

            if (loadingIndicator) {

                loadingIndicator.textContent =
                    "Unable to load image.";

                loadingIndicator.hidden = false;

            }

        };

        this.lightboxImage.src = imageSource;

        // Caption
        if (this.lightboxCaption) {

            this.lightboxCaption.textContent =
                caption;

        }

        // Image counter
        if (this.lightboxCounter) {

            this.lightboxCounter.textContent =
                `${index + 1} / ${this.activeGallery.length}`;

        }

        // Download link
        if (this.downloadButton) {

            this.downloadButton.href = imageSource;

            this.downloadButton.download =
                this.getFileName(imageSource);

        }

        // Hide navigation for a single image
        const previousButton =
            this.lightbox.querySelector(
                "[data-lightbox-prev]"
            );

        const nextButton =
            this.lightbox.querySelector(
                "[data-lightbox-next]"
            );

        const multipleImages =
            this.activeGallery.length > 1;

        if (previousButton) {

            previousButton.hidden = !multipleImages;

        }

        if (nextButton) {

            nextButton.hidden = !multipleImages;

        }

    },

    /* =====================================================
       9. NEXT / PREVIOUS IMAGE
    ===================================================== */

    showNext() {

        if (!this.activeGallery.length) return;

        this.displayImage(
            this.activeIndex + 1
        );

    },

    showPrevious() {

        if (!this.activeGallery.length) return;

        this.displayImage(
            this.activeIndex - 1
        );

    },

    /* =====================================================
       10. CLOSE LIGHTBOX
    ===================================================== */

    closeLightbox() {

        if (!this.lightbox) return;

        this.lightbox.classList.remove(
            "is-open"
        );

        this.lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "lightbox-open"
        );

        document.body.style.overflow = "";

        this.lightboxImage.src = "";

        this.activeGallery = [];

        this.activeIndex = 0;

        this.activeImage = null;

        // Restore keyboard focus
        if (
            this.previousFocusedElement &&
            document.contains(
                this.previousFocusedElement
            )
        ) {

            this.previousFocusedElement.focus();

        }

    },

    /* =====================================================
       11. KEYBOARD CONTROLS
    ===================================================== */

    initKeyboardControls() {

        document.addEventListener(
            "keydown",
            event => {

                if (
                    !this.lightbox ||
                    !this.lightbox.classList.contains(
                        "is-open"
                    )
                ) return;

                switch (event.key) {

                    case "Escape":

                        event.preventDefault();

                        this.closeLightbox();

                        break;

                    case "ArrowRight":

                        event.preventDefault();

                        this.showNext();

                        break;

                    case "ArrowLeft":

                        event.preventDefault();

                        this.showPrevious();

                        break;

                }

            }
        );

    },

    /* =====================================================
       12. TOUCH / SWIPE SUPPORT
    ===================================================== */

    initTouchControls() {

        if (!this.lightbox) return;

        const imageWrapper =
            this.lightbox.querySelector(
                ".lightbox-image-wrapper"
            );

        if (!imageWrapper) return;

        imageWrapper.addEventListener(
            "touchstart",
            event => {

                if (!event.touches.length) return;

                this.touchStartX =
                    event.touches[0].clientX;

                this.touchStartY =
                    event.touches[0].clientY;

            },
            { passive: true }
        );

        imageWrapper.addEventListener(
            "touchend",
            event => {

                if (!event.changedTouches.length) return;

                const endX =
                    event.changedTouches[0].clientX;

                const endY =
                    event.changedTouches[0].clientY;

                const deltaX =
                    endX - this.touchStartX;

                const deltaY =
                    endY - this.touchStartY;

                // Ignore vertical scrolling gestures
                if (
                    Math.abs(deltaX) < 60 ||
                    Math.abs(deltaX) < Math.abs(deltaY)
                ) return;

                if (deltaX < 0) {

                    this.showNext();

                } else {

                    this.showPrevious();

                }

            },
            { passive: true }
        );

    },

    /* =====================================================
       13. GET IMAGE FILENAME
    ===================================================== */

    getFileName(url) {

        try {

            const pathname =
                new URL(url, window.location.href).pathname;

            const filename =
                pathname.split("/").pop();

            return filename || "wazuh-soc-image";

        } catch (error) {

            return "wazuh-soc-image";

        }

    }

};

/* =========================================================
   14. INITIALIZE GALLERY
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => GalleryApp.init(),
        { once: true }
    );

} else {

    GalleryApp.init();

}

/* =========================================================
   15. GLOBAL ACCESS
========================================================= */

window.GalleryApp = GalleryApp;

/* ================= END OF GALLERY.JS ==================== */