// Configuración Firebase
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

// -------- Detectar usuario --------
auth.onAuthStateChanged(user => {
  console.log("Usuario detectado:", user);
  if (user) {
    showTab('control');
    loadUserInfo();
    loadInventory();
  } else {
    window.location.href = 'login_register.html';
  }
});

// -------- Mostrar pestaña --------
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// -------- Cargar info de usuario --------
function loadUserInfo() {
  const user = auth.currentUser;
  if (!user) return;

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
}

// -------- Agregar ítem --------
function addItem() {
  const user = auth.currentUser;
  if (!user) return;

  const name = document.getElementById('itemName').value;
  const quantity = parseInt(document.getElementById('itemQuantity').value);

  if (!name || !quantity) {
    alert('Completa los campos del ítem');
    return;
  }

  db.collection('inventario').add({
    uid: user.uid,
    name: name,
    quantity: quantity
  }).then(() => {
    document.getElementById('itemName').value = '';
    document.getElementById('itemQuantity').value = '';
    loadInventory();
    showTab('lista');
  });
}

// -------- Cargar inventario --------
function loadInventory() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection('inventario').where('uid', '==', user.uid).get()
    .then(snapshot => {
      const list = document.getElementById('inventoryList');
      list.innerHTML = '';
      snapshot.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = `${doc.data().name} - ${doc.data().quantity}`;
        list.appendChild(li);
      });
    });
}

// -------- Logout --------
function logout() {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
}
