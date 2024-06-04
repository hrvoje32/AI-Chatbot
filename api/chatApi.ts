// chatApi.ts
import axios from 'axios';
import {Platform} from 'react-native';

// Base URL for API calls, differs based on whether the app is running on Android or another platform
const baseURL =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://127.0.0.1:5000';

const chatApi = {
  // Registers a new user with username and password
  register: async (username: string, password: string) => {
    return axios.post(`${baseURL}/sign-in`, {username, password});
  },

  // Logs in a user with username and password
  login: async (username: string, password: string) => {
    return axios.post(`${baseURL}/login`, {username, password});
  },

  // Retrieves a user ID for a given username and password
  getUserId: async (username: string, password: string) => {
    return axios.post(`${baseURL}/get-user-id`, {username, password});
  },

  // Sends a message to the server and receives a response
  sendMessage: async (message: string) => {
    return axios.post(`${baseURL}/get-response`, {message});
  },

  // Saves messages that the system could not handle to the server
  saveUnhandledMessage: async (message: string, userId: number) => {
    return axios.post(`${baseURL}/save-unhandled-message`, {
      message: message,
      user_id: userId,
    });
  },

  // Submits user feedback to the server
  submitFeedback: async ({
    feedback,
    stars,
    userId,
  }: {
    feedback: string;
    stars: number;
    userId: number;
  }) => {
    return axios.post(`${baseURL}/submit-feedback`, {
      feedback,
      stars,
      user_id: userId,
    });
  },

  // Saves a chat session with a user ID, session name, and messages
  saveSession: async (
    userId: number,
    sessionName: string,
    messages: Message[],
  ) => {
    return axios.post(`${baseURL}/save-conversation`, {
      user_id: userId,
      session_name: sessionName,
      messages: messages.map(msg => ({
        text: msg.text,
        is_bot: msg.type === 'bot',
      })),
    });
  },

  // Renames an existing chat session
  renameSession: async (
    userId: number,
    oldSessionName: string,
    newSessionName: string,
  ) => {
    try {
      const response = await axios.put(`${baseURL}/rename-session`, {
        userId,
        oldSessionName,
        newSessionName,
      });
      return response.data;
    } catch (error) {
      console.error('Error renaming session:', error);
      throw error;
    }
  },

  // Retrieves the conversation history for a user
  getConversationHistory: async (userId: number) => {
    return axios.get(`${baseURL}/get-conversation-history`, {
      params: {user_id: userId},
    });
  },

  // Deletes chat session
  deleteSession: async (userId: number, sessionName: string) => {
    const encodedSessionName = encodeURIComponent(sessionName);
    return axios.delete(
      `${baseURL}/delete-session?userId=${userId}&sessionName=${encodedSessionName}`,
    );
  },
};

// Interfaces for handling messages and sessions
export interface Message {
  message: string;
  is_bot: boolean;
  type: 'user' | 'bot';
  text: string;
}
export interface ChatSession {
  name: string;
  messages: Message[];
}

export default chatApi; // Exports the API functions for use elsewhere in the app
