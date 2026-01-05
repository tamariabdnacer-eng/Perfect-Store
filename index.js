const db = firebase.database();
const productsDiv = document.getElementById("products");
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCount = document.getElementById("cartCount");

updateCartCount();

db.ref("products").on("value", snap => {
    allProducts = [];
    snap.forEach(p => {
        allProducts.push({id: p.key, ...p.val()});
    });
    render(allProducts);
});

function render(list) {
    productsDiv.innerHTML = "";
    list.forEach(p => {
        productsDiv.innerHTML += `
        <div class="product">
            <img src="${p.image}">
            <h4>${p.name}</h4>
            <div class="price">${p.price} DA</div>
            <div class="button-group">
                <button class="view-btn" onclick="openProduct('${p.id}')">عرض</button>
                <button class="cart-btn" onclick="addToCart('${p.id}')">🛒 أضف للسلة</button>
            </div>
        </div>`;
    });
}

function searchProduct() {
    const q = document.getElementById("search").value.toLowerCase();
    render(allProducts.filter(p => p.name.toLowerCase().includes(q)));
}

function openProduct(id) {
    window.location = "product.html?id=" + id;
}

function addToCart(id) {
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("تم إضافة المنتج إلى السلة!");
}

function updateCartCount() {
    cartCount.innerText = cart.length;
}

function openCart() {
    window.location = "cart.html";
}
