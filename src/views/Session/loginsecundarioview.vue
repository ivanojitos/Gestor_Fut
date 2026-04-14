<template>
  <div class="container-login">
    <div class="card-login">
      <!-- Manual -->
      <div class="manual">
        <a href="/guia.pdf" target="_blank"> Manual de usuario 📄 </a>
      </div>

      <!-- Header -->
      <div class="header">
        <img src="" alt="logo" />
        <h1>Inicia sesión</h1>
        <p>para ingresar a la aplicación de Viáticos</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="login">
        <div class="input-group">
          <label>Correo electrónico</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div class="actions">
          <a href="/forgot-password">Recuperar contraseña</a>
          <button type="submit">Iniciar sesión</button>
        </div>
      </form>
      <p v-if="error" style="color: red; margin-top: 10px">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const error = ref("");

const login = () => {
  if (form.email === "jugador@test.com" && form.password === "1234") {
    localStorage.setItem("auth", "true");
    localStorage.setItem("role", "admin"); // 🔥 guardas rol
    router.push("/login-real");

  } else if (form.email === "arbitro@test.com" && form.password === "1234") {
    localStorage.setItem("auth", "true");
    localStorage.setItem("role", "arbitro"); // 🔥 guardas rol
    router.push("/dashboard/dashArbitro");

  } else if (form.email === "administrador@test.com" && form.password === "1234") {
    localStorage.setItem("auth", "true");
    localStorage.setItem("role", "administrador"); // 🔥 guardas rol
    router.push("/dashboard/dashAdministrador");

  } else {
    error.value = "Credenciales incorrectas";
  }
};
</script>

<style scoped>
.container-login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f5f9;
  padding: 20px;
}

.card-login {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 18px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Manual */
.manual {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 12px;
}

.manual a {
  text-decoration: none;
  color: #2563eb;
  font-weight: 600;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 30px;
}

.header img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.header p {
  font-size: 13px;
  color: #64748b;
}

/* Inputs */
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-group label {
  font-size: 13px;
  margin-bottom: 5px;
  color: #334155;
}

.input-group input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  outline: none;
}

/* Actions */
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.actions a {
  font-size: 12px;
  color: #2563eb;
  text-decoration: none;
}

.actions button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.actions button:hover {
  background: #1d4ed8;
}
</style>
