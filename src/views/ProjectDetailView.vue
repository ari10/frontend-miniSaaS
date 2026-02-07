<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  getTasksByProject,
  updateTaskStatus,
  createTask,
  deleteTask
} from "@/api/task.api"
import { useAuthStore } from "@/stores/auth.store"

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const projectId = Number(route.params.id)

const tasks = ref<any[]>([])
const newTask = ref("")
const loading = ref(false)

/* ======================
   API
====================== */
const loadTasks = async () => {
  try {
    const res = await getTasksByProject(projectId)
    tasks.value = res.data
  } catch (e) {
    console.error("Load tasks failed", e)
  }
}

const addTask = async () => {
  if (!newTask.value.trim()) return

  loading.value = true
  try {
    await createTask(projectId, { title: newTask.value })
    newTask.value = ""
    await loadTasks()
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (task: any) => {
  loading.value = true
  try {
    const next = task.status === "DONE" ? "TODO" : "DONE"
    await updateTaskStatus(task.id, next)
    await loadTasks()
  } finally {
    loading.value = false
  }
}

const removeTask = async (taskId: number) => {
  if (!confirm("Delete this task?")) return

  loading.value = true
  try {
    await deleteTask(taskId)
    await loadTasks()
  } catch (e) {
    console.error("Delete failed", e)
  } finally {
    loading.value = false
  }
}

/* ======================
   UI helpers
====================== */
const progress = computed(() => {
  if (!tasks.value.length) return 0
  const done = tasks.value.filter(t => t.status === "DONE").length
  return Math.round((done / tasks.value.length) * 100)
})

const logout = () => {
  authStore.logout()
  router.replace("/login")
}

/* ======================
   LIFECYCLE (INI KUNCI!)
====================== */
onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="page">
    <!-- HEADER -->
    <header class="header">
      <button class="link" @click="router.push('/projects')">
        ← Back to Projects
      </button>

      <button class="logout" @click="logout">
        Logout
      </button>
    </header>

    <h1>Tasks</h1>

    <!-- PROGRESS -->
    <div class="progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }" />
      </div>
      <span>{{ progress }}%</span>
    </div>

    <!-- ADD TASK -->
    <div class="add-task">
      <input
        v-model="newTask"
        placeholder="New task..."
        :disabled="loading"
      />
      <button @click="addTask" :disabled="loading">
        Add Task
      </button>
    </div>

    <!-- LIST -->
    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <span class="badge" :class="task.status">
          {{ task.status }}
        </span>

        <span class="title">
          {{ task.title }}
        </span>

        <button
          class="action"
          :disabled="loading"
          @click="toggleStatus(task)"
        >
          {{ task.status === "DONE" ? "Undo" : "Done" }}
        </button>
        <button @click="removeTask(task.id)" class="btn-danger">
        Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* ======================
   PAGE
====================== */
.page {
  max-width: 720px;
  margin: 40px auto;
  padding: 0 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

h1 {
  margin: 16px 0;
}

/* ======================
   HEADER
====================== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 14px;
}

.logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

/* ======================
   PROGRESS
====================== */
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #22c55e;
  transition: width 0.3s ease;
}

/* ======================
   ADD TASK
====================== */
.add-task {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.add-task input {
  flex: 1;
  padding: 8px;
}

.add-task button {
  padding: 8px 12px;
}

/* ======================
   TASK LIST
====================== */
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;

  /* ⚠️ penting: mencegah bug animasi */
  position: relative;
  overflow: hidden;

  animation: fadeIn 0.25s ease;
}

.title {
  flex: 1;
}

/* ======================
   BADGE
====================== */
.badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}

.badge.TODO {
  background: #fef3c7;
  color: #92400e;
}

.badge.DONE {
  background: #dcfce7;
  color: #166534;
}

/* ======================
   ACTION BUTTON
====================== */
.action {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
}

/* ======================
   ANIMATION SAFE
====================== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
