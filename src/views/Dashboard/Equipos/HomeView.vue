<template>
  <div class="container">
    <h1>⚽ Torneos</h1>

    <!-- TORNEOS -->
    <div class="torneos" v-if="!torneoSeleccionado">
      <div
        v-for="torneo in torneos"
        :key="torneo.id"
        class="card"
        @click="seleccionarTorneo(torneo)"
      >
        <h2>{{ torneo.nombre }}</h2>
        <span class="tipo">{{ torneo.tipo }}</span>
      </div>
    </div>

    <!-- CLASIFICACIONES -->
    <div v-if="torneoSeleccionado && !clasificacionSeleccionada">
      <button class="back" @click="torneoSeleccionado = null">← Volver</button>

      <h2>🏆 {{ torneoSeleccionado.nombre }}</h2>

      <div class="torneos">
        <div
          v-for="clasificacion in torneoSeleccionado.clasificaciones"
          :key="clasificacion.nombre"
          class="card"
          @click="seleccionarClasificacion(clasificacion)"
        >
          <h3>{{ clasificacion.nombre }}</h3>
        </div>
      </div>
    </div>

    <!-- TABLA -->
    <div v-if="clasificacionSeleccionada" class="tabla">
      <button class="back" @click="clasificacionSeleccionada = null">
        ← Volver
      </button>

      <h2>
        {{ torneoSeleccionado.nombre }} - {{ clasificacionSeleccionada.nombre }}
      </h2>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(equipo, index) in clasificacionSeleccionada.tabla"
            :key="index"
          >
            <td class="pos">{{ index + 1 }}</td>
            <td class="equipo">{{ equipo.nombre }}</td>
            <td>{{ equipo.pj }}</td>
            <td class="pts">{{ equipo.puntos }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const torneoSeleccionado = ref(null);
const clasificacionSeleccionada = ref(null);

const torneos = ref([
  {
    id: 1,
    nombre: "Torneo Sabatino",
    tipo: "Liga",
    clasificaciones: [
      {
        nombre: "2da A",
        tabla: [
          { nombre: "Tigres", pj: 5, puntos: 12 },
          { nombre: "Leones", pj: 5, puntos: 10 },
          { nombre: "America", pj: 5, puntos: 12 },
          { nombre: "Chivas", pj: 5, puntos: 10 },
          { nombre: "Puebla", pj: 5, puntos: 12 },
          { nombre: "Monterrey", pj: 5, puntos: 10 },
          { nombre: "Atlas", pj: 5, puntos: 12 },
          { nombre: "San luis", pj: 5, puntos: 10 },
          { nombre: "Chiapas", pj: 5, puntos: 12 },
          { nombre: "panchos", pj: 5, puntos: 10 },

        ],
      },
      {
        nombre: "2da B",
        tabla: [
          { nombre: "Águilas", pj: 5, puntos: 8 },
          { nombre: "Pumas", pj: 5, puntos: 7 },
        ],
      },
    ],
  },
  {
    id: 2,
    nombre: "Torneo Dominical",
    tipo: "Liga",
    clasificaciones: [
      {
        nombre: "2da A",
        tabla: [
          { nombre: "Tigres", pj: 5, puntos: 12 },
          { nombre: "Leones", pj: 5, puntos: 10 },
        ],
      },
      {
        nombre: "2da B",
        tabla: [
          { nombre: "Águilas", pj: 5, puntos: 8 },
          { nombre: "Pumas", pj: 5, puntos: 7 },
        ],
      },
    ],
  },
  {
    id: 3,
    nombre: "Torneo Entre Semana",
    tipo: "Liga",
    clasificaciones: [
      {
        nombre: "2da A",
        tabla: [
          { nombre: "Tigres", pj: 5, puntos: 12 },
          { nombre: "Leones", pj: 5, puntos: 10 },
        ],
      },
      {
        nombre: "2da B",
        tabla: [
          { nombre: "Águilas", pj: 5, puntos: 8 },
          { nombre: "Pumas", pj: 5, puntos: 7 },
        ],
      },
    ],
  },
  {
    id: 4,
    nombre: "Torneo Mixto",
    tipo: "Liga",
    clasificaciones: [
      {
        nombre: "2da A",
        tabla: [
          { nombre: "Tigres", pj: 5, puntos: 12 },
          { nombre: "Leones", pj: 5, puntos: 10 },
        ],
      },
      {
        nombre: "2da B",
        tabla: [
          { nombre: "Águilas", pj: 5, puntos: 8 },
          { nombre: "Pumas", pj: 5, puntos: 7 },
        ],
      },
    ],
  },
]);

const seleccionarTorneo = (torneo) => {
  torneoSeleccionado.value = torneo;
};

const seleccionarClasificacion = (clasificacion) => {
  clasificacionSeleccionada.value = clasificacion;
};
</script>

<style scoped>
/* BOTÓN BACK */
.back {
  margin-bottom: 15px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: 0.3s;
}

.back:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
}

/* CONTENEDOR */
.container {
  padding: 10px;
  color: #e5e7eb;
}

/* TITULO */
h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #818cf8;
  font-size: 30px;
  font-weight: bold;
}

/* TORNEOS */
.torneos {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* CARD */
.card {
  background: rgba(30, 41, 59, 0.9);
  padding: 25px;
  border-radius: 18px;
  width: 220px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.card h2 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #f1f5f9;
}

.tipo {
  font-size: 13px;
  color: #9ca3af;
}

/* HOVER CARD */
.card:hover {
  transform: translateY(-8px) scale(1.03);
  background: rgba(99, 102, 241, 0.15);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

/* TABLA */
.tabla {
  margin-top: 50px;
  background: rgba(15, 23, 42, 0.9);
  padding: 25px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.tabla h2 {
  margin-bottom: 20px;
  color: #818cf8;
}

/* TABLA */
table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 10px;
}

/* HEADER */
th {
  background: linear-gradient(90deg, #3b82f6, #6366f1);
  color: white;
  padding: 12px;
  font-size: 14px;
}

/* FILAS */
td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* EQUIPO */
.equipo {
  font-weight: bold;
  color: #f9fafb;
}

/* POSICIÓN */
.pos {
  font-weight: bold;
  color: #60a5fa;
}

/* PUNTOS */
.pts {
  font-weight: bold;
  color: #a5b4fc;
}

/* HOVER FILA */
tr:hover {
  background: rgba(99, 102, 241, 0.1);
}
</style>
