const db = firebase.database();

// حساب المجموع من السلة
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

Promise.all(
  cart.map(id => db.ref("products/" + id).once("value"))
).then(snaps => {
  snaps.forEach(s => total += Number(s.val().price));
});

function confirmPayment(){
  const fname = fnameVal();
  const lname = lnameVal();
  const address = addressVal();
  const city = cityVal();
  const town = townVal();
  const card = document.getElementById("cardNumber").value.trim();
  const cvv = Number(document.getElementById("cvv").value);

  if(!fname||!lname||!address||!city||!town||!card||!cvv){
    alert("يرجى ملء جميع الحقول");
    return;
  }

  // البحث في جميع users
  db.ref("users").once("value").then(snapshot=>{
    let found = false;

    snapshot.forEach(userSnap=>{
      const userKey = userSnap.key;
      const user = userSnap.val();

      if(user.cardNumber === card && user.cvv === cvv){
        found = true;

        if(user.balance < total){
          alert("❌ الرصيد غير كافٍ");
          return;
        }

        const newBalance = user.balance - total;

        // خصم الرصيد
        db.ref("users/" + userKey).update({
          balance: newBalance
        });

        // تسجيل الطلب
        db.ref("orders").push({
          user: userKey,
          customer: { fname, lname, address, city, town },
          total,
          date: Date.now()
        });

        localStorage.removeItem("cart");
        alert("✅ تم الدفع بنجاح");
        window.location = "index.html";
      }
    });

    if(!found){
      alert("❌ معلومات البطاقة غير صحيحة");
    }
  });
}

/* helpers */
function fnameVal(){return document.getElementById("fname").value.trim()}
function lnameVal(){return document.getElementById("lname").value.trim()}
function addressVal(){return document.getElementById("address").value.trim()}
function cityVal(){return document.getElementById("city").value.trim()}
function townVal(){return document.getElementById("town").value.trim()}
