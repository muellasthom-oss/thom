import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as loginApi } from '../api/auth.js'

const useAuthStore = create(persist((set) => ({
  token: null,
  user: null,
  loading: false,
  error: null,
  async login (email, password) {
    set({ loading: true, error: null })
    try {
      const response = await loginApi(email, password)
      set({ token: response.token, user: response.user, loading: false, error: null })
      return response
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },
  logout () {
    set({ token: null, user: null })
  }
}), {
  name: 'howstore-auth'
}))

export default useAuthStore
