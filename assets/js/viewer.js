/* =========================================================
   WAZUH SOC HOME LAB
   File: assets/js/viewer.js
   Purpose: Universal image / evidence viewer

   Features:
   1. Open individual images
   2. Fullscreen viewer
   3. Zoom in / out
   4. Reset zoom
   5. Pan image
   6. Mouse wheel zoom
   7. Double-click zoom
   8. Keyboard controls
   9. Escape to close
   10. Touch-friendly zoom
   11. Download image
   12. Accessible viewer controls

   This file is independent from gallery.js.
========================================================= */

"use strict";


/* =========================================================
   1. VIEWER APPLICATION
========================================================= */

const ViewerApp = {

    initialized: false,

    viewer: null,

    viewerImage: null,

    currentSource: null,

    currentAlt: "",

    currentScale: 1,

    minScale: 0.5,

    maxScale: 5,

    scaleStep: 0.25,

    translateX: 0,

    translateY: 0,

    isDragging: false,

    dragStartX: 0,

    dragStartY: 0,

    startTranslateX: 0,

    startTranslateY: 0,

    touchStartDistance: 0,

    touchStartScale: 1,

    previousFocusedElement: null,


    /* =====================================================
       2. INITIALIZE
    ===================================================== */

    init() {

        if (this.initialized) return;

        this.initialized = true;

        this.createViewer();

        this.bindTriggers();

        this.bindKeyboard();

        console.log(
            "[Wazuh SOC Lab] Viewer initialized."
        );

    },


    /* =====================================================
       3. CREATE VIEWER
    ===================================================== */

    createViewer() {

        this.viewer = document.querySelector(
            "#imageViewer, " +
            ".image-viewer, " +
            "[data-image-viewer]"
        );

        if (!this.viewer) {

            this.viewer =
                document.createElement("div");

            this.viewer.id = "imageViewer";

            this.viewer.className =
                "image-viewer";

            this.viewer.setAttribute(
                "role",
                "dialog"
            );

            this.viewer.setAttribute(
                "aria-modal",
                "true"
            );

            this.viewer.setAttribute(
                "aria-hidden",
                "true"
            );

            this.viewer.innerHTML = `

                <div
                    class="viewer-backdrop"
                    data-viewer-close>
                </div>


                <div class="viewer-container">


                    <div class="viewer-toolbar">


                        <div class="viewer-title">

                            <span
                                data-viewer-title>
                            </span>

                        </div>


                        <div class="viewer-controls">


                            <button
                                type="button"
                                class="viewer-button"
                                data-viewer-zoom-out
                                aria-label="Zoom out"
                                title="Zoom out">

                                −

                            </button>


                            <button
                                type="button"
                                class="viewer-button"
                                data-viewer-reset
                                aria-label="Reset zoom"
                                title="Reset zoom">

                                100%

                            </button>


                            <button
                                type="button"
                                class="viewer-button"
                                data-viewer-zoom-in
                                aria-label="Zoom in"
                                title="Zoom in">

                                +

                            </button>


                            <a
                                class="viewer-button"
                                data-viewer-download
                                href="#"
                                download
                                aria-label="Download image"
                                title="Download image">

                                ↓

                            </a>


                            <button
                                type="button"
                                class="viewer-button viewer-close"
                                data-viewer-close
                                aria-label="Close viewer"
                                title="Close">

                                ×

                            </button>


                        </div>

                    </div>


                    <div class="viewer-stage">

                        <div class="viewer-image-wrapper">

                            <img
                                class="viewer-image"
                                data-viewer-image
                                alt=""
                                draggable="false"
                            >

                        </div>

                    </div>


                    <div
                        class="viewer-status"
                        data-viewer-status
                        aria-live="polite">

                        100%

                    </div>


                </div>
            `;

            document.body.appendChild(
                this.viewer
            );

        }


        this.viewerImage =
            this.viewer.querySelector(
                "[data-viewer-image]"
            );


        this.viewerTitle =
            this.viewer.querySelector(
                "[data-viewer-title]"
            );


        this.viewerStatus =
            this.viewer.querySelector(
                "[data-viewer-status]"
            );


        this.downloadButton =
            this.viewer.querySelector(
                "[data-viewer-download]"
            );


        this.bindViewerControls();

        this.bindMouseControls();

        this.bindTouchControls();

    },


    /* =====================================================
       4. FIND VIEWER TRIGGERS
    ===================================================== */

    bindTriggers() {

        const selectors = [

            "[data-viewer]",

            ".viewer-trigger",

            ".zoomable-image",

            ".evidence-image",

            ".documentation-image"

        ];


        const elements =
            document.querySelectorAll(
                selectors.join(",")
            );


        elements.forEach(element => {

            if (
                element.dataset.viewerInitialized ===
                "true"
            ) {

                return;

            }


            element.dataset.viewerInitialized =
                "true";


            element.setAttribute(
                "tabindex",
                "0"
            );


            element.setAttribute(
                "role",
                "button"
            );


            element.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    this.open(element);

                }
            );


            element.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        this.open(element);

                    }

                }
            );

        });

    },


    /* =====================================================
       5. OPEN VIEWER
    ===================================================== */

    open(element) {

        if (!this.viewerImage) return;


        this.previousFocusedElement =
            document.activeElement;


        const source =
            element.currentSrc ||
            element.src ||
            element.dataset.src ||
            element.getAttribute(
                "data-image"
            );


        if (!source) {

            console.warn(
                "[Wazuh SOC Lab] Viewer: image source not found."
            );

            return;

        }


        const alt =
            element.alt ||
            element.dataset.title ||
            element.dataset.caption ||
            "Wazuh SOC Lab image";


        this.currentSource = source;

        this.currentAlt = alt;


        this.viewerImage.src =
            source;


        this.viewerImage.alt =
            alt;


        if (this.viewerTitle) {

            this.viewerTitle.textContent =
                element.dataset.title ||
                alt;

        }


        if (this.downloadButton) {

            this.downloadButton.href =
                source;

            this.downloadButton.download =
                this.getFileName(source);

        }


        this.resetZoom();


        this.viewer.classList.add(
            "is-open"
        );


        this.viewer.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "viewer-open"
        );


        document.body.style.overflow =
            "hidden";


        const closeButton =
            this.viewer.querySelector(
                "[data-viewer-close]"
            );


        if (closeButton) {

            closeButton.focus();

        }

    },


    /* =====================================================
       6. CLOSE VIEWER
    ===================================================== */

    close() {

        if (!this.viewer) return;


        this.viewer.classList.remove(
            "is-open"
        );


        this.viewer.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "viewer-open"
        );


        document.body.style.overflow =
            "";


        this.viewerImage.src =
            "";


        this.currentSource =
            null;


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
       7. VIEWER BUTTONS
    ===================================================== */

    bindViewerControls() {

        const zoomIn =
            this.viewer.querySelector(
                "[data-viewer-zoom-in]"
            );


        const zoomOut =
            this.viewer.querySelector(
                "[data-viewer-zoom-out]"
            );


        const reset =
            this.viewer.querySelector(
                "[data-viewer-reset]"
            );


        const closeButtons =
            this.viewer.querySelectorAll(
                "[data-viewer-close]"
            );


        if (zoomIn) {

            zoomIn.addEventListener(
                "click",
                () => this.zoomIn()
            );

        }


        if (zoomOut) {

            zoomOut.addEventListener(
                "click",
                () => this.zoomOut()
            );

        }


        if (reset) {

            reset.addEventListener(
                "click",
                () => this.resetZoom()
            );

        }


        closeButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => this.close()
            );

        });

    },


    /* =====================================================
       8. ZOOM IN
    ===================================================== */

    zoomIn() {

        this.setScale(
            this.currentScale +
            this.scaleStep
        );

    },


    /* =====================================================
       9. ZOOM OUT
    ===================================================== */

    zoomOut() {

        this.setScale(
            this.currentScale -
            this.scaleStep
        );

    },


    /* =====================================================
       10. SET SCALE
    ===================================================== */

    setScale(scale) {

        this.currentScale =
            Math.min(
                this.maxScale,
                Math.max(
                    this.minScale,
                    scale
                )
            );


        this.updateTransform();

    },


    /* =====================================================
       11. RESET ZOOM
    ===================================================== */

    resetZoom() {

        this.currentScale =
            1;

        this.translateX =
            0;

        this.translateY =
            0;

        this.updateTransform();

    },


    /* =====================================================
       12. UPDATE IMAGE TRANSFORM
    ===================================================== */

    updateTransform() {

        if (!this.viewerImage) return;


        this.viewerImage.style.transform =
            `translate3d(
                ${this.translateX}px,
                ${this.translateY}px,
                0
            ) scale(${this.currentScale})`;


        const percentage =
            Math.round(
                this.currentScale * 100
            );


        if (this.viewerStatus) {

            this.viewerStatus.textContent =
                `${percentage}%`;

        }


        const resetButton =
            this.viewer.querySelector(
                "[data-viewer-reset]"
            );


        if (resetButton) {

            resetButton.textContent =
                `${percentage}%`;

        }

    },


    /* =====================================================
       13. MOUSE CONTROLS
    ===================================================== */

    bindMouseControls() {

        if (!this.viewerImage) return;


        this.viewerImage.addEventListener(
            "wheel",
            event => {

                if (
                    !this.viewer.classList.contains(
                        "is-open"
                    )
                ) {

                    return;

                }


                event.preventDefault();


                const direction =
                    event.deltaY < 0
                        ? 1
                        : -1;


                this.setScale(
                    this.currentScale +
                    direction *
                    this.scaleStep
                );

            },
            { passive: false }
        );


        this.viewerImage.addEventListener(
            "dblclick",
            event => {

                event.preventDefault();


                if (
                    this.currentScale === 1
                ) {

                    this.setScale(2);

                } else {

                    this.resetZoom();

                }

            }
        );


        this.viewerImage.addEventListener(
            "mousedown",
            event => {

                if (
                    this.currentScale <= 1
                ) {

                    return;

                }


                event.preventDefault();


                this.isDragging =
                    true;


                this.dragStartX =
                    event.clientX;


                this.dragStartY =
                    event.clientY;


                this.startTranslateX =
                    this.translateX;


                this.startTranslateY =
                    this.translateY;


                this.viewerImage.classList.add(
                    "is-dragging"
                );

            }
        );


        document.addEventListener(
            "mousemove",
            event => {

                if (!this.isDragging) return;


                this.translateX =
                    this.startTranslateX +
                    (
                        event.clientX -
                        this.dragStartX
                    );


                this.translateY =
                    this.startTranslateY +
                    (
                        event.clientY -
                        this.dragStartY
                    );


                this.updateTransform();

            }
        );


        document.addEventListener(
            "mouseup",
            () => {

                this.isDragging =
                    false;


                if (this.viewerImage) {

                    this.viewerImage.classList.remove(
                        "is-dragging"
                    );

                }

            }
        );

    },


    /* =====================================================
       14. TOUCH CONTROLS
    ===================================================== */

    bindTouchControls() {

        if (!this.viewerImage) return;


        this.viewerImage.addEventListener(
            "touchstart",
            event => {

                if (
                    event.touches.length === 2
                ) {

                    this.touchStartDistance =
                        this.getTouchDistance(
                            event.touches
                        );


                    this.touchStartScale =
                        this.currentScale;

                }

            },
            { passive: true }
        );


        this.viewerImage.addEventListener(
            "touchmove",
            event => {

                if (
                    event.touches.length !== 2
                ) {

                    return;

                }


                event.preventDefault();


                const distance =
                    this.getTouchDistance(
                        event.touches
                    );


                if (
                    !this.touchStartDistance
                ) {

                    return;

                }


                const ratio =
                    distance /
                    this.touchStartDistance;


                this.setScale(
                    this.touchStartScale *
                    ratio
                );

            },
            { passive: false }
        );


        this.viewerImage.addEventListener(
            "touchend",
            () => {

                this.touchStartDistance =
                    0;

            }
        );

    },


    /* =====================================================
       15. TOUCH DISTANCE
    ===================================================== */

    getTouchDistance(touches) {

        const first =
            touches[0];


        const second =
            touches[1];


        const x =
            second.clientX -
            first.clientX;


        const y =
            second.clientY -
            first.clientY;


        return Math.sqrt(
            x * x +
            y * y
        );

    },


    /* =====================================================
       16. KEYBOARD CONTROLS
    ===================================================== */

    bindKeyboard() {

        document.addEventListener(
            "keydown",
            event => {

                if (
                    !this.viewer ||
                    !this.viewer.classList.contains(
                        "is-open"
                    )
                ) {

                    return;

                }


                switch (event.key) {

                    case "Escape":

                        event.preventDefault();

                        this.close();

                        break;


                    case "+":

                    case "=":

                        event.preventDefault();

                        this.zoomIn();

                        break;


                    case "-":

                        event.preventDefault();

                        this.zoomOut();

                        break;


                    case "0":

                        event.preventDefault();

                        this.resetZoom();

                        break;

                }

            }
        );

    },


    /* =====================================================
       17. GET FILENAME
    ===================================================== */

    getFileName(url) {

        try {

            const pathname =
                new URL(
                    url,
                    window.location.href
                ).pathname;


            const filename =
                pathname
                    .split("/")
                    .pop();


            return filename ||
                "wazuh-soc-evidence";

        } catch (error) {

            return "wazuh-soc-evidence";

        }

    }

};


/* =========================================================
   18. INITIALIZE
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => ViewerApp.init(),
        { once: true }
    );

} else {

    ViewerApp.init();

}


/* =========================================================
   19. GLOBAL ACCESS
========================================================= */

window.ViewerApp =
    ViewerApp;


/* ================= END OF VIEWER.JS ==================== */