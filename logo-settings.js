(function () {
    const LOGO_KEY = "furniSpaceSiteLogo";
    const defaultFavicon = document.querySelector("link[rel='icon']")?.getAttribute("href") || "";

    function setLogoImage(target, logoUrl) {
        target.classList.toggle("has-custom-logo", Boolean(logoUrl));

        if (!logoUrl) {
            return;
        }

        target.innerHTML = "";
        const image = document.createElement("img");
        image.src = logoUrl;
        image.alt = "";
        image.decoding = "async";
        target.appendChild(image);
    }

    function updateFavicon(logoUrl) {
        let favicon = document.querySelector("link[rel='icon']");

        if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            document.head.appendChild(favicon);
        }

        favicon.href = logoUrl || defaultFavicon || "images/favicon.svg";
    }

    function applyLogo() {
        const logoUrl = window.localStorage.getItem(LOGO_KEY);

        document.querySelectorAll("[data-site-logo]").forEach((target) => {
            if (!target.dataset.defaultLogoHtml) {
                target.dataset.defaultLogoHtml = target.innerHTML;
            }

            if (!logoUrl) {
                target.innerHTML = target.dataset.defaultLogoHtml;
                target.classList.remove("has-custom-logo");
                return;
            }

            setLogoImage(target, logoUrl);
        });

        updateFavicon(logoUrl);
    }

    window.FurniSpaceLogo = {
        key: LOGO_KEY,
        apply: applyLogo,
        get() {
            return window.localStorage.getItem(LOGO_KEY);
        },
        set(logoUrl) {
            window.localStorage.setItem(LOGO_KEY, logoUrl);
            applyLogo();
        },
        clear() {
            window.localStorage.removeItem(LOGO_KEY);
            applyLogo();
        }
    };

    window.addEventListener("storage", (event) => {
        if (event.key === LOGO_KEY) {
            applyLogo();
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyLogo);
    } else {
        applyLogo();
    }
})();
