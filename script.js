// ==============================
// 🌐 API CONFIG (PAGE BASED)
// ==============================
const API_MAP = {
    index: "https://69dce09c84f912a26404571d.mockapi.io/Tv_Unit",
    sofa: "https://your-api.com/sofa",
    bedroom: "https://69dce09c84f912a26404571d.mockapi.io/badroom"
};

// ==============================
// 🖼️ DEFAULT IMAGE
// ==============================
const DEFAULT_IMG = "https://via.placeholder.com/300x200?text=No+Image";

// ==============================
// 📦 DOM ELEMENTS
// ==============================
const container = document.getElementById("products");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");

const dropdownMenu = document.getElementById("dropdownMenu");
const menuIcon = document.getElementById("menuIcon");
const navMenu = document.getElementById("navMenu");
const overlay = document.getElementById("overlay");

// ==============================
// 📄 DETECT CURRENT PAGE
// ==============================
let page = window.location.pathname.split("/").pop().replace(".html", "");

// fallback for local file
if (!page || page === "") page = "index";

console.log("Current Page:", page);

// ==============================
// 🧠 SMART IMAGE DETECTOR
// ==============================
function getImage(item) {
    return (
        item.tv_img ||
        item.image ||
        item.img ||
        item.photo ||
        item.thumbnail ||
        item.url ||
        DEFAULT_IMG
    );
}

// ==============================
// 📊 LOAD DATA FROM API
// ==============================
function loadData() {
    const API_URL = API_MAP[page];

    if (!API_URL) {
        container.innerHTML = "<p>No API found for this page</p>";
        return;
    }

    container.innerHTML = "<p style='text-align:center'>Loading...</p>";

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                container.innerHTML = "<p>No data found</p>";
                return;
            }

            let html = "";

            data.forEach(item => {
                const img = getImage(item);

                html += `
                    <div class="card">
                        <img 
                            src="${img}" 
                            data-img="${img}"
                            onerror="this.src='${DEFAULT_IMG}'"
                        >
                        <div class="card-info">
                            <p class="product-id">
                                ${page.toUpperCase()}_${item.id || "00"}
                            </p>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;

            // ==============================
            // 🔍 IMAGE CLICK → MODAL
            // ==============================
            document.querySelectorAll(".card img").forEach(img => {
                img.addEventListener("click", () => {
                    modal.style.display = "block";
                    modalImg.src = img.dataset.img;
                });
            });
        })
        .catch(err => {
            console.error("API Error:", err);
            container.innerHTML = "<p style='color:red'>Failed to load data</p>";
        });
}

// ==============================
// 🔽 DROPDOWN NAVIGATION
// ==============================
if (dropdownMenu) {
    document.querySelectorAll("#dropdownMenu div").forEach(item => {
        item.addEventListener("click", () => {
            const targetPage = item.getAttribute("data-page");

            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });
}

// ==============================
// ❌ CLOSE MODAL
// ==============================
if (closeModal) {
    closeModal.onclick = () => modal.style.display = "none";
}

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};

// ==============================
// 📱 MOBILE MENU
// ==============================
if (menuIcon) {
    menuIcon.addEventListener("click", () => {
        navMenu.classList.add("active");
        overlay.classList.add("active");
    });
}

if (overlay) {
    overlay.addEventListener("click", () => {
        navMenu.classList.remove("active");
        overlay.classList.remove("active");
    });
}

// ==============================
// 🚀 INITIAL LOAD
// ==============================
loadData();