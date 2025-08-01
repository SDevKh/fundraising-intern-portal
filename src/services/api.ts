const API_BASE_URL = 'http://localhost:5000/api'

export const authAPI = {
  signup: async (userData: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    return response.json()
  }
}

export const userAPI = {
  getProfile: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`)
    return response.json()
  },

  updateName: async (userId: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    return response.json()
  }
}
