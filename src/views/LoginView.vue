<script setup lang="ts">
import { ref } from "vue"
import { loginApi } from "@/api/auth.api"
import { useAuthStore } from "@/stores/auth.store"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const loading = ref(false)
const error = ref("")

const authStore = useAuthStore()
const router = useRouter()

const submit = async () => {
  error.value = ""
  loading.value = true
  try {
    const res = await loginApi({
      email: email.value,
      password: password.value,
    })
    authStore.login(res.data.accessToken)
    router.push("/projects")
  } catch (e) {
    error.value = "Email atau password salah"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Login</h2>

      <p class="subtitle">Mini SaaS Project Manager</p>

      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <button @click="submit" :disabled="loading">
        {{ loading ? "Loading..." : "Login" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #6366f1, #22c55e);
}

.auth-card {
  background: white;
  padding: 32px;
  width: 320px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,.15);
  text-align: center;
}

.auth-card h2 {
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 10px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.error {
  margin-top: 10px;
  color: red;
  font-size: 13px;
}
</style>
