import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Methods
export const clipboardAPI = {
  // Create a new clipboard
  createClipboard: async () => {
    try {
      const response = await api.post("/clipboard/new");
      return response.data;
    } catch (error) {
      console.error("Error creating clipboard:", error);
      throw error;
    }
  },

  // Get clipboard with all cards by ID
  getClipboard: async (clipboardId) => {
    try {
      const response = await api.get(`/clipboard/${clipboardId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching clipboard:", error);
      throw error;
    }
  },

  // Create a new card in clipboard
  createCard: async (clipboardId, content, userName = null) => {
    try {
      const response = await api.post(`/clipboard/${clipboardId}/cards`, {
        content,
        user_name: userName,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating card:", error);
      throw error;
    }
  },

  // Update a card's content
  updateCard: async (cardId, content) => {
    try {
      const response = await api.put(`/cards/${cardId}`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating card:", error);
      throw error;
    }
  },

  // Delete a card
  deleteCard: async (cardId) => {
    try {
      await api.delete(`/cards/${cardId}`);
      return true;
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  },

  // Delete entire clipboard
  deleteClipboard: async (clipboardId) => {
    try {
      await api.delete(`/clipboard/${clipboardId}`);
      return true;
    } catch (error) {
      console.error("Error deleting clipboard:", error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Error checking health:", error);
      throw error;
    }
  },
};

export default api;
