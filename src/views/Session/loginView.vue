<template>
  <div class="container">
    <div class="overlay"></div>

    <div class="login-card">
      <h1>⚽ Gestor Fut</h1>
      <p class="subtitle">Sistema de Torneos</p>

      <form @submit.prevent="login">
        <div class="input-group">
          <input v-model="email" type="email" required />
          <label>Correo</label>
        </div>

        <div class="input-group">
          <input v-model="password" type="password" required />
          <label>Contraseña</label>
        </div>

        <button type="submit">Ingresar</button>
        <button type="button" class="btn-crear" @click="mostrarCodigo = true">
          Registrar Árbitro
        </button>
        <p class="crear-link" @click="irCrearUsuario">
          ¿No tienes cuenta? Crear usuario
        </p>
      </form>

      <p class="error" v-if="error">{{ error }}</p>
    </div>

    <!-- MODAL CODIGO -->
    <div v-if="mostrarCodigo" class="modal">
      <div class="modal-content">
        <h2>🔐 Código de Árbitro</h2>
        <input v-model="codigo" placeholder="Ingresa el código" />
        <p class="error" v-if="errorCodigo">{{ errorCodigo }}</p>

        <button @click="validarCodigo">Validar</button>
        <button class="btn-cancelar" @click="mostrarCodigo = false">
          Cancelar
        </button>
      </div>
    </div>

    <!-- FORMULARIO ARBITRO -->
    <div v-if="mostrarFormulario" class="modal">
      <div class="modal-content grande">
        <h2>🧤 Registro de Árbitro</h2>

        <input v-model="arbitro.nombre" placeholder="Nombre" />
        <input v-model="arbitro.edad" type="number" placeholder="Edad" />
        <input v-model="arbitro.estudios" placeholder="Estudios" />
        <input v-model="arbitro.direccion" placeholder="Dirección" />
        <input v-model="arbitro.cp" placeholder="Código Postal" />
        <input v-model="arbitro.celular" placeholder="Celular" />
        <input v-model="arbitro.correo" placeholder="Correo" />
        <input
          v-model="arbitro.password"
          type="password"
          placeholder="Contraseña"
        />

        <p class="error" v-if="errorArbitro">{{ errorArbitro }}</p>

        <button @click="crearArbitro">Crear Árbitro</button>
        <button class="btn-cancelar" @click="mostrarFormulario = false">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = "";

  try {
    const response = await axios.post(
      "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/login",
      {
        correo: email.value,
        password: password.value,
      },
    );

    if (response.data.ok) {
      const user = response.data.user;
      const rol = response.data.rol;

      localStorage.setItem("auth", "true");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", rol);

      if (rol === "administrador") {
        router.push("/dashboard/dashAdministrador");
      } else if (rol === "arbitro") {
        router.push("/dashboard/dashArbitro");
      } else {
        router.push("/dashboard"); // jugador
      }
    }
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = "Contraseña incorrecta";
    } else if (err.response?.status === 404) {
      error.value = "Usuario no existe 21";
    } else if (err.response?.status === 422) {
      error.value = "Datos inválidos";
    } else {
      error.value = "Error del servidor 2";
    }
  }
};

const irCrearUsuario = () => {
  router.push("/crearUsuario");
};

const mostrarCodigo = ref(false);
const mostrarFormulario = ref(false);

const codigo = ref("");
const errorCodigo = ref("");

const arbitro = ref({
  nombre: "",
  edad: "",
  estudios: "",
  direccion: "",
  cp: "",
  celular: "",
  correo: "",
  password: "",
});

const errorArbitro = ref("");

const validarCodigo = () => {
  if (codigo.value === "12345678") {
    mostrarCodigo.value = false;
    mostrarFormulario.value = true;
    errorCodigo.value = "";
  } else {
    errorCodigo.value = "❌ No eres árbitro";
  }
};

const crearArbitro = async () => {
  try {
    const response = await axios.post(
      "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/createArbitro",
      arbitro.value,
    );

    if (response.data.ok) {
      const user = response.data.user;
      const rol = response.data.rol;

      localStorage.setItem("auth", "true");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", rol);

      router.push("/dashboard/dashArbitro");

      mostrarFormulario.value = false;
    }
  } catch (err) {
    console.log(err);

    if (err.response) {
      errorArbitro.value = err.response.data.message || err.response.data.error;
    } else {
      errorArbitro.value = "Error de conexión";
    }
  }
};
</script>

<style scoped>
/* MODAL */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: rgba(15, 23, 42, 0.95);
  padding: 30px;
  border-radius: 15px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
}

.modal-content.grande {
  width: 400px;
}

.modal-content input {
  padding: 10px;
  border-radius: 8px;
  border: none;
}

.btn-cancelar {
  background: #ef4444;
}

/* RESPONSIVE */
@media (max-width: 500px) {
  .login-card {
    width: 90%;
    padding: 25px;
  }

  .modal-content {
    width: 90%;
  }
}
.crear-link {
  margin-top: 15px;
  font-size: 13px;
  color: #c7d2fe;
  cursor: pointer;
  transition: 0.3s;
}

.crear-link:hover {
  color: #818cf8;
}
.btn-crear {
  margin-top: 10px;
  background: transparent;
  border: 1px solid #818cf8;
  color: #a5b4fc;
}

.btn-crear:hover {
  background: #6366f1;
  color: white;
}
/* FONDO */
.container {
  height: 100vh;
  background: url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2")
    no-repeat center center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* OVERLAY MÁS SUAVE Y MODERNO */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.8),
    rgba(99, 102, 241, 0.6)
  );
}

/* TARJETA LOGIN */
.login-card {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  padding: 45px;
  border-radius: 20px;
  width: 340px;
  text-align: center;
  color: #f1f5f9;
  backdrop-filter: blur(15px);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* TITULO */
.login-card h1 {
  margin-bottom: 5px;
  color: #818cf8;
  font-size: 28px;
}

.subtitle {
  margin-bottom: 25px;
  font-size: 14px;
  color: #cbd5f5;
}

/* INPUTS */
.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: none;
  border-bottom: 2px solid #818cf8;
  background: transparent;
  color: white;
  outline: none;
  font-size: 14px;
}

.input-group label {
  position: absolute;
  top: 12px;
  left: 0;
  color: #a5b4fc;
  font-size: 14px;
  transition: 0.3s;
}

/* ANIMACIÓN */
.input-group input:focus + label,
.input-group input:valid + label {
  top: -10px;
  font-size: 12px;
  color: #6366f1;
}

/* BOTÓN */
button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
}

/* ERROR */
.error {
  margin-top: 12px;
  color: #f87171;
  font-size: 14px;
}
</style>
