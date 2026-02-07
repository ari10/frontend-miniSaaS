import api from "./axios"

export const getTasksByProject = (projectId: number) => {
  return api.get(`/projects/${projectId}/tasks`)
}


export const createTask = (
  projectId: number,
  payload: { title: string }
) => {
  return api.post(`/projects/${projectId}/tasks`, payload)
}

export const updateTaskStatus = async (taskId: number, status: string) => {
  await api.patch(`/tasks/${taskId}/status`, { status })
}

export const deleteTask = (taskId: number) => {
  return api.delete(`/tasks/${taskId}`)
}

