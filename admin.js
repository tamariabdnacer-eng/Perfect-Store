const auth = firebase.auth();
const db = firebase.database();
const productsDiv = document.getElementById("products");

/* 🔐 حماية الصفحة */
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location = "auth.html";
    return;
  }

  db.ref("usrstr/" + user.uid).once("value").then(snap => {
    if (!snap.exists() || snap.val().role !== "admin") {
      alert("غير مصرح لك");
      window.location = "index.html";
    }
  });
});

/* 📦 عرض المنتجات */
db.ref("products").on("value", snap => {
  productsDiv.innerHTML = "<h3>المنتجات</h3>";
  snap.forEach(item => {
    const p = item.val();
    productsDiv.innerHTML += `
      <div class="product">
        <strong>${p.name}</strong><br>
        💰 ${p.price} DA
        <div class="actions">
          <button class="edit" onclick="editProduct('${item.key}','${p.name}','${p.price}','${p.image}','${p.description || ""}')">تعديل</button>
          <button class="del" onclick="deleteProduct('${item.key}')">حذف</button>
        </div>
      </div>
    `;
  });
});

/* ➕ حفظ (إضافة أو تعديل) */
function saveProduct(){
  const id = document.getElementById("editId").value;
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const image = document.getElementById("image").value.trim();
  const desc = document.getElementById("desc").value.trim();

  if(!name || !price || !image){
    alert("املأ الحقول الأساسية");
    return;
  }

  const data = {
    name,
    price: Number(price),
    image,
    description: desc
  };

  if(id){
    // ✏️ تعديل
    db.ref("products/" + id).update(data)
      .then(()=>alert("تم التعديل"));
  } else {
    // ➕ إضافة
    db.ref("products").push(data)
      .then(()=>alert("تمت الإضافة"));
  }

  clearForm();
}

/* ✏️ تحميل البيانات للتعديل */
function editProduct(id,name,price,image,desc){
  document.getElementById("editId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("price").value = price;
  document.getElementById("image").value = image;
  document.getElementById("desc").value = desc;
}

/* ❌ حذف */
function deleteProduct(id){
  if(confirm("هل أنت متأكد من الحذف؟")){
    db.ref("products/" + id).remove();
  }
}

/* 🧹 تنظيف الفورم */
function clearForm(){
  document.getElementById("editId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
  document.getElementById("desc").value = "";
}
