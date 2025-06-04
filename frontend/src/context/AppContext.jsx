'use client'
import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      // You can decode the token to get user info if needed
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser(payload)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password
      })

      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('token', token)
        setIsAuthenticated(true)
        setUser(user)
        return { success: true }
      }
      return { success: false, message: response.data.message }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, userData)

      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('token', token)
        setIsAuthenticated(true)
        setUser(user)
        return { success: true }
      }
      return { success: false, message: response.data.message }
    } catch (error) {
      console.error('Signup failed:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed. Please try again.'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
} 