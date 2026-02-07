<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getProjects, createProject } from "@/api/project.api"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth.store"

const projects = ref([])
const name = ref("")
const router = useRouter()
const authStore = useAuthStore()
const loadProjects = async () => {
  const res = await getProjects()
  projects.value = res.data
}

const addProject = async () => {
  if (!name.value) return
  await createProject(name.value)
  name.value = ""
  loadProjects()
}
const logout = () => {
  authStore.logout()
  router.push("/login")
}
onMounted(loadProjects)
</script>

<template>
      <div class="header">
    <p>Home Mini SaaS</p>

      <button class="logout" @click="logout">
        Logout ⎋
      </button>
    </div>
  <div class="page">
    
    <h2>My Projects</h2>

    <div class="add-project">
      <input v-model="name" placeholder="New project name" />
      <button @click="addProject">Add</button>
    </div>

    <div class="grid">
      <div
        class="card"
        v-for="p in projects"
        :key="p.id"
        @click="router.push(`/projects/${p.id}`)"
      >
        <h3>{{ p.name }}</h3>
        <p>Click to view tasks</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 24px;
}

.add-project {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.card {
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,.1);
  cursor: pointer;
  transition: transform .15s;
}

.card:hover {
  transform: translateY(-3px);
}
</style>
