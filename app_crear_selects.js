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
  if (!user) window.location.href = 'login_register.html';
  else {
    loadProductTypes();
    loadUnits();
  }
});

// Agregar nuevo tipo de producto
function addProductType() {
  const type = document.getElementById('newProductType').value.trim();
  if (!type) return alert("Escribe un tipo válido");

  db.collection('tipos_producto').add({ name: type })
    .then(() => {
      document.getElementById('newProductType').value = '';
      loadProductTypes();
    });
}

// Listar tipos de producto
function loadProductTypes() {
  db.collection('tipos_producto').get().then(snapshot => {
    const ul = document.getElementById('productTypesList');
    ul.innerHTML = '';
    snapshot.forEach(doc => {
      const li = document.createElement('li');
      li.innerText = doc.data().name;
      ul.appendChild(li);
    });
  });
}

// Agregar nueva unidad
function addUnit() {
  const unit = document.getElementById('newUnit').value.trim();
  if (!unit) return alert("Escribe una unidad válida");

  db.collection('unidades').add({ name: unit })
    .then(() => {
      document.getElementById('newUnit').value = '';
      loadUnits();
    });
}

// Listar unidades
function loadUnits() {
  db.collection('unidades').get().then(snapshot => {
    const ul = document.getElementById('unitsList');
    ul.innerHTML = '';
    snapshot.forEach(doc => {
      const li = document.createElement('li');
      li.innerText = doc.data().name;
      ul.appendChild(li);
    });
  });
}

function logout() {
  auth.signOut().then(() => window.location.href = 'index.html');
}
