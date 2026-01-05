const auth = firebase.auth();
const db = firebase.database();

function register(){
  auth.createUserWithEmailAndPassword(email.value, password.value)
  .then(res=>{
    db.ref("usrstr/" + res.user.uid).set({
      email: email.value,
      role: "user"
    });
    alert("تم إنشاء الحساب");
  })
  .catch(e=>alert(e.message));
}

function login(){
  auth.signInWithEmailAndPassword(email.value, password.value)
  .then(res=>{
    db.ref("usrstr/" + res.user.uid).once("value", snap=>{
      const role = snap.val().role;
      window.location = role === "admin" ? "admin.html" : "index.html";
    });
  })
  .catch(e=>alert(e.message));
}

function resetPassword(){
  auth.sendPasswordResetEmail(email.value)
  .then(()=>alert("تم إرسال رابط الاسترجاع"))
  .catch(e=>alert(e.message));
}
