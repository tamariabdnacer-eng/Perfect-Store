const auth = firebase.auth();
const db = firebase.database();

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// تسجيل حساب جديد
function register() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) { alert("يرجى إدخال البريد وكلمة السر"); return; }

    auth.createUserWithEmailAndPassword(email, password)
    .then(res => {
        db.ref("usrstr/" + res.user.uid).set({
            email: email,
            role: "user"
        });
        alert("✅ تم إنشاء الحساب بنجاح");
    })
    .catch(e => alert(e.message));
}

// تسجيل الدخول
function login() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) { alert("يرجى إدخال البريد وكلمة السر"); return; }

    auth.signInWithEmailAndPassword(email, password)
    .then(res => {
        db.ref("usrstr/" + res.user.uid).once("value", snap => {
            const role = snap.val().role;
            window.location = role === "admin" ? "admin.html" : "index.html";
        });
    })
    .catch(e => alert(e.message));
}

// إعادة تعيين كلمة السر
function resetPassword() {
    const email = emailInput.value.trim();
    if (!email) { alert("يرجى إدخال البريد لإرسال رابط الاسترجاع"); return; }

    auth.sendPasswordResetEmail(email)
    .then(() => alert(`✅ تم إرسال رابط استرجاع كلمة السر إلى ${email}`))
    .catch(e => alert("❌ " + e.message));
}
