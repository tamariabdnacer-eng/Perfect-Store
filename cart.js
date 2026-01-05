const cartDiv=document.getElementById("cart");
const cart=JSON.parse(localStorage.getItem("cart"))||[];
cart.forEach(id=>{
  db.ref("products/"+id).once("value").then(snap=>{
    const p=snap.val();
    cartDiv.innerHTML+=`<p>${p.name} - ${p.price} DA</p>`;
  });
});
