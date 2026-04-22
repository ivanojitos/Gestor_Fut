<template>
  <div class="page">
    <div class="card">

      <!-- HEADER -->
      <div class="header">
        <h2>
          {{ route.query.edit ? "Editar Jugador" : "Crear Perfil" }}
        </h2>
        <p>Completa la información del jugador</p>
      </div>

      <form @submit.prevent="submitForm" class="form">

        <!-- FOTO -->
        <div class="avatar-section">
          <label class="avatar">
            <img v-if="preview" :src="preview" />
            <span v-else>📸</span>
            <input type="file" @change="handleImage" hidden />
          </label>
          <p>Subir foto</p>
        </div>

        <!-- INPUTS -->
        <div class="grid">

          <div class="input-group">
            <span>👤</span>
            <input v-model="form.nombre" placeholder="Nombre completo" required />
          </div>

          <div class="input-group">
            <span>⚽</span>
            <input v-model="form.posicion" placeholder="Posición" required />
          </div>

          <div class="input-group">
            <span>#️⃣</span>
            <input type="number" v-model="form.numero" placeholder="Número" required />
          </div>

          <div class="input-group">
            <span>🎂</span>
            <input type="number" v-model="form.edad" placeholder="Edad" required />
          </div>

          <div class="input-group">
            <span>📏</span>
            <input v-model="form.estatura" placeholder="Estatura (1.80m)" required />
          </div>

          <div class="input-group">
            <span>📱</span>
            <input v-model="form.telefono" placeholder="Celular" required />
          </div>

          <div class="input-group full">
            <span>📧</span>
            <input type="email" v-model="form.correo" placeholder="Correo electrónico" required />
          </div>

        </div>

        <!-- BOTÓN -->
        <button class="btn-save">
          💾 Guardar Perfil
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const form = ref({
  nombre: "",
  posicion: "",
  numero: "",
  edad: "",
  estatura: "",
  telefono: "",
  correo: ""
});

const preview = ref(null);

const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) preview.value = URL.createObjectURL(file);
};

const submitForm = () => {
  console.log("Jugador:", form.value);
};

onMounted(() => {
  if (route.query.edit) {
    form.value = {
      nombre: route.query.name || "",
      posicion: route.query.position || "",
      numero: route.query.number || "",
      edad: route.query.age || "",
      estatura: "",
      telefono: "",
      correo: ""
    };
  }
});
</script>

<style scoped>

/* 🔥 FONDO */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8e9ec, #1e293b);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* 🔥 CARD */
.card {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

/* 🔥 HEADER */
.header {
  background: linear-gradient(135deg, #22c55e, #4ade80);
  color: white;
  text-align: center;
  padding: 25px;
}

.header h2 {
  font-size: 24px;
  font-weight: bold;
}

.header p {
  font-size: 14px;
  opacity: 0.9;
}

/* 🔥 FORM */
.form {
  padding: 25px;
}

/* 🔥 AVATAR */
.avatar-section {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 🔥 GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

/* 🔥 INPUT GROUP */
.input-group {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 10px;
  transition: 0.2s;
}

.input-group span {
  margin-right: 10px;
}

.input-group input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
}

/* FULL WIDTH */
.full {
  grid-column: span 2;
}

/* 🔥 BOTÓN */
.btn-save {
  margin-top: 20px;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(34,197,94,0.4);
}

/* 📱 RESPONSIVE */
@media(max-width:768px){
  .grid {
    grid-template-columns: 1fr;
  }

  .full {
    grid-column: span 1;
  }
}

</style>