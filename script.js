const API_URL = "https://69dce09c84f912a26404571d.mockapi.io/Tv_Unit";

const container = document.getElementById("products");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");

// Fetch Data
fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        let html = "";

        data.forEach(item => {
            html += `
                <div class="card">
                    <img src="${item.tv_img}" onclick="openModal('${item.tv_img}')"/>
                    <div class="card-body">
                        <h3>TV Unit ${item.id}</h3>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    })
    .catch(err => console.log(err));

// Open Modal
function openModal(src) {
    modal.style.display = "block";
    modalImg.src = src;
}

// Close Modal
closeBtn.onclick = () => modal.style.display = "none";

// Close on outside click
window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};