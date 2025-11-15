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

// Control de sesión
auth.onAuthStateChanged(user => {
  if (!user) window.location.href = 'login_register.html';
  else loadInventory();
});

// Cargar inventario
function loadInventory() {
  db.collection('inventario').orderBy('createdAt', 'desc').get().then(snapshot => {
    const tbody = document.getElementById('inventoryTable');
    tbody.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement('tr');

      const imgTd = document.createElement('td');
      const img = document.createElement('img');
      img.src = data.image;
      imgTd.appendChild(img);

      const nameTd = document.createElement('td');
      nameTd.innerText = data.name;

      const typeTd = document.createElement('td');
      typeTd.innerText = data.type;

      const priceTd = document.createElement('td');
      priceTd.innerText = data.price;

      const quantityTd = document.createElement('td');
      quantityTd.innerText = data.quantity;

      const unitTd = document.createElement('td');
      unitTd.innerText = data.unit;

      tr.appendChild(imgTd);
      tr.appendChild(nameTd);
      tr.appendChild(typeTd);
      tr.appendChild(priceTd);
      tr.appendChild(quantityTd);
      tr.appendChild(unitTd);

      tbody.appendChild(tr);
    });
  });
}

// Cerrar sesión
function logout() {
  auth.signOut().then(() => window.location.href = 'login_register.html');
}
