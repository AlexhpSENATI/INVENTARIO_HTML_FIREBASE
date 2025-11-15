const firebaseConfig = {
  apiKey: "AIzaSyANUG7gwdHeBPuRLdQpTwpKgJDu8CxVVeI",
  authDomain: "inventario-ae0b0.firebaseapp.com",
  projectId: "inventario-ae0b0",
  storageBucket: "inventario-ae0b0.firebasestorage.app",
  messagingSenderId: "80164789281",
  appId: "1:80164789281:web:19be60fed3503af7945760",
  measurementId: "G-C30E9Z8BXN"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(user => {
  if (user) {
    db.collection('usuarios').doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          document.getElementById('userInfo').innerText = `
Nombre: ${data.name}
Email: ${data.email}
Género: ${data.gender}
Edad: ${data.age}
          `;
        }
      });
  } else {
    window.location.href = 'login_register.html';
  }
});

function logout() {
  auth.signOut().then(() => window.location.href = 'login_register.html');
}
