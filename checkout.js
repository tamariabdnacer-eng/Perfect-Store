const db = firebase.database();

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;
let matchedUserKey = null;
let matchedUserData = null;

// حساب المجموع من السلة
Promise.all(
  cart.map(id => db.ref("products/" + id).once("value"))
).then(snaps => {
  snaps.forEach(s => total += Number(s.val().price));
});

// المرحلة 1: التحقق من البطاقة
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

  db.ref("users").once("value").then(snapshot=>{
    let found = false;

    snapshot.forEach(userSnap=>{
      const user = userSnap.val();

      if(user.cardNumber === card && user.cvv === cvv){
        found = true;

        if(user.balance < total){
          alert("❌ الرصيد غير كافٍ");
          return;
        }

        matchedUserKey = userSnap.key;
        matchedUserData = user;

        // إظهار واجهة PIN
        document.getElementById("pinBox").style.display = "block";
        alert("🔐 أدخل PIN لتأكيد العملية");
      }
    });

    if(!found){
      alert("❌ معلومات البطاقة غير صحيحة");
    }
  });
}

// المرحلة 2: التحقق من PIN
function verifyPin(){
  const pin = document.getElementById("pin").value.trim();

  if(!pin){
    alert("أدخل PIN");
    return;
  }

  if(pin != matchedUserData.pin){
    alert("❌ PIN غير صحيح");
    return;
  }

  // خصم الرصيد
  const newBalance = matchedUserData.balance - total;

  db.ref("users/" + matchedUserKey).update({
    balance: newBalance
  });

  // آخر 4 أرقام البطاقة
  const last4 = matchedUserData.cardNumber.slice(-4);

  // تسجيل الطلب بالكامل
  db.ref("orders").push({
    user: matchedUserKey,
    customer: {
      fname: fnameVal(),
      lname: lnameVal(),
      address: addressVal(),
      city: cityVal(),
      town: townVal()
    },
    total,
    cardUsed: last4,
    date: Date.now()
  });

  localStorage.removeItem("cart");
  alert("✅ تم الدفع بنجاح");
  window.location = "index.html";
}

/* helpers */
function fnameVal(){return document.getElementById("fname").value.trim()}
function lnameVal(){return document.getElementById("lname").value.trim()}
function addressVal(){return document.getElementById("address").value.trim()}
function cityVal(){return document.getElementById("city").value.trim()}
function townVal(){return document.getElementById("town").value.trim()}
