import api from "./axios"

export const getProjects = () =>
  api.get("/projects")

export const createProject = (name: string) =>
  api.post("/projects", null, {
    params: { name },
  })
