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

// Control de sesión
auth.onAuthStateChanged(user => {
  if (!user) window.location.href = 'login_register.html';
  else {
    loadTypes();
    loadUnits();
  }
});

// Cargar tipos de productos desde Firestore
function loadTypes() {
  db.collection('tipos_producto').get().then(snapshot => {
    const select = document.getElementById('itemType');
    select.innerHTML = '<option value="">Selecciona tipo</option>';
    snapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.data().name;
      option.text = doc.data().name;
      select.appendChild(option);
    });
  });
}

// Cargar unidades desde Firestore
function loadUnits() {
  db.collection('unidades').get().then(snapshot => {
    const select = document.getElementById('itemUnit');
    select.innerHTML = '<option value="">Selecciona unidad</option>';
    snapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.data().name;
      option.text = doc.data().name;
      select.appendChild(option);
    });
  });
}

// Agregar producto
function addItem() {
  const name = document.getElementById('itemName').value.trim();
  const type = document.getElementById('itemType').value;
  const price = parseFloat(document.getElementById('itemPrice').value);
  const quantity = parseFloat(document.getElementById('itemQuantity').value);
  const unit = document.getElementById('itemUnit').value;
  const imageFile = document.getElementById('itemImage').files[0];

  if (!name || !type || !unit || isNaN(price) || isNaN(quantity)) {
    return alert("Completa todos los campos correctamente");
  }

  if (!imageFile) {
    return alert("Selecciona una imagen del producto");
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageBase64 = e.target.result;

    db.collection('inventario').add({
      name: name,
      type: type,
      price: price,
      quantity: quantity,
      unit: unit,
      image: imageBase64,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      alert("Producto agregado con éxito");
      document.getElementById('itemName').value = '';
      document.getElementById('itemPrice').value = '';
      document.getElementById('itemQuantity').value = '';
      document.getElementById('itemType').value = '';
      document.getElementById('itemUnit').value = '';
      document.getElementById('itemImage').value = '';
    }).catch(err => {
      console.error(err);
      alert("Error al agregar producto");
    });
  };
  reader.readAsDataURL(imageFile);
}

// Cerrar sesión
function logout() {
  auth.signOut().then(() => window.location.href = 'index.html');
}
