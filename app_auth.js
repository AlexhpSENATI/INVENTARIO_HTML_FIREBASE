
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

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Elementos del DOM
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showLogin = document.getElementById('showLogin');
    const showRegister = document.getElementById('showRegister');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');

    // Funciones para cambiar entre formularios
    loginToggle.addEventListener('click', () => {
      loginToggle.classList.add('active');
      registerToggle.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
      hideAlerts();
    });

    registerToggle.addEventListener('click', () => {
      registerToggle.classList.add('active');
      loginToggle.classList.remove('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
      hideAlerts();
    });

    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      loginToggle.click();
    });

    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      registerToggle.click();
    });

    // Funciones para mostrar alertas
    function showError(message) {
      errorAlert.textContent = message;
      errorAlert.style.display = 'block';
      successAlert.style.display = 'none';
    }

    function showSuccess(message) {
      successAlert.textContent = message;
      successAlert.style.display = 'block';
      errorAlert.style.display = 'none';
    }

    function hideAlerts() {
      errorAlert.style.display = 'none';
      successAlert.style.display = 'none';
    }

    // Función de registro
    function register() {
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const gender = document.getElementById('registerGender').value;
      const age = parseInt(document.getElementById('registerAge').value);

      if (!name || !email || !password || !gender || !age) {
        showError("Por favor, completa todos los campos");
        return;
      }

      auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          return db.collection('usuarios').doc(user.uid).set({
            name,
            email,
            gender,
            age,
            uid: user.uid
          });
        })
        .then(() => {
          showSuccess('¡Usuario registrado con éxito!');
          // Limpiar formulario
          document.getElementById('registerForm').reset();
          // Cambiar al formulario de login después de 2 segundos
          setTimeout(() => {
            loginToggle.click();
          }, 2000);
        })
        .catch(error => {
          let errorMessage = "Error al registrar usuario";
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Este correo electrónico ya está en uso";
          } else if (error.code === 'auth/weak-password') {
            errorMessage = "La contraseña debe tener al menos 6 caracteres";
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = "El correo electrónico no es válido";
          }
          showError(errorMessage);
        });
    }

    // Función de login
    function login() {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        showError("Por favor, ingresa tu correo y contraseña");
        return;
      }

      auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          showSuccess('Inicio de sesión exitoso. Redirigiendo...');
          // Redirigir después de 1 segundo
          setTimeout(() => {
            window.location.href = 'control.html';
          }, 1000);
        })
        .catch(error => {
          let errorMessage = "Error al iniciar sesión";
          if (error.code === 'auth/user-not-found') {
            errorMessage = "No existe una cuenta con este correo electrónico";
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = "Contraseña incorrecta";
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = "El correo electrónico no es válido";
          }
          showError(errorMessage);
        });
    }

    // Permitir enviar formularios con Enter
    document.getElementById('loginForm').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        login();
      }
    });

    document.getElementById('registerForm').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        register();
      }
    });
  