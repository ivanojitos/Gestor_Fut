<template>
  <div class="container">

```
<!-- 🔐 VALIDACIÓN DE CÓDIGO -->
<div v-if="!authorized" class="card">
  <h2>🧤 Acceso árbitros</h2>
  <p>Ingresa el código de autorización</p>

  <input
    v-model="codigo"
    type="password"
    placeholder="Código de acceso"
    @keyup.enter="validarCodigo"
  />

  <button @click="validarCodigo">Ingresar</button>

  <p v-if="error" class="error">{{ error }}</p>
</div>

<!-- 📝 FORMULARIO -->
<div v-else class="card">
  <h2>Registro de Árbitro</h2>

  <form @submit.prevent="crearArbitro">

    <input v-model="form.Nombre" placeholder="Nombre completo" required />
    <input v-model="form.Correo" type="email" placeholder="Correo" required />
    <input v-model="form.Password" type="password" placeholder="Contraseña" required />
    <input v-model="form.Edad" type="number" placeholder="Edad" />
    <input v-model="form.Celular" placeholder="Celular" />
    <input v-model="form.Direccion" placeholder="Dirección" />
    <input v-model="form.CP" placeholder="Código Postal" />
    <input v-model="form.Estudios" placeholder="Estudios" />

    <button type="submit">Registrar Árbitro</button>

    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error" class="error">{{ error }}</p>

  </form>
</div>
```

  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const codigo = ref("");
const authorized = ref(false);
const error = ref("");
const success = ref("");

const form = ref({
  Nombre: "",
  Correo: "",
  Password: "",
  Edad: "",
  Celular: "",
  Direccion: "",
  CP: "",
  Estudios: ""
});

// 🔐 VALIDAR CÓDIGO
const validarCodigo = () => {
  if (codigo.value === "12345678") {
    authorized.value = true;
    error.value = "";
  } else {
    error.value = "No eres árbitro";
  }
};

// 🚀 CREAR ÁRBITRO
const crearArbitro = async () => {
  try {
    const res = await axios.post(
      "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/createArbitro",
      form.value
    );

    success.value = "Árbitro registrado correctamente";
    error.value = "";

  } catch (err) {
    error.value = "Error al registrar";
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b, #0f172a);
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

h2 {
  margin-bottom: 10px;
  text-align: center;
}

input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  margin-top: 10px;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

.error {
  color: red;
  text-align: center;
}

.success {
  color: green;
  text-align: center;
}

/* 📱 RESPONSIVE */
@media (max-width: 500px) {
  .card {
    margin: 10px;
    padding: 1.5rem;
  }
}
</style>
