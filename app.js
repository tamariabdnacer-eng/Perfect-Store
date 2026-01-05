const firebaseConfig = {
  apiKey: "AIzaSyAM7gLKuLRfhFdWyakFS1jU4c8xU1fg-FU",
  authDomain: "family-bank-966ae.firebaseapp.com",
  databaseURL: "https://family-bank-966ae-default-rtdb.firebaseio.com",
  projectId: "family-bank-966ae",
  storageBucket: "family-bank-966ae.firebasestorage.app",
  messagingSenderId: "479496038450",
  appId: "1:479496038450:web:49ee61a36a621abd3c742b",
  measurementId: "G-Y8G1DHYCYL"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const productsDiv = document.getElementById("products");
let cart = 0;

db.ref("products").on("value", snapshot => {
  productsDiv.innerHTML = "";
  snapshot.forEach(item => {
    const p = item.val();
    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <div class="price">${p.price} DA</div>
        <button onclick="addToCart()">أضف للسلة</button>
      </div>
    `;
  });
});

function addToCart(){
  cart++;
  document.getElementById("cartCount").innerText = cart;
}
