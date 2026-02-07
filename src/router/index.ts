import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import LoginView from "@/views/LoginView.vue"
import ProjectsView from "@/views/ProjectsView.vue"
import ProjectDetailView from "@/views/ProjectDetailView.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/projects",
    component: ProjectsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects/:id",
    component: ProjectDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem("token")

  if (to.meta.requiresAuth && !token) {
    return "/login"
  }
})

export default router
