import axios, { AxiosError } from 'axios';

import {
  ContactFormData,
  QuoteFormData,
  ApiResponse,
} from '../types';

/**
 * OanK Cleaning API Client
 *
 * Production:
 *   VITE_API_BASE_URL=/api
 *
 * Requests:
 *   POST /api/contact
 *   POST /api/quote
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || '/api'
).replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

/**
 * Safely extract a server API response from an Axios error.
 */
const getApiErrorResponse = (
  error: unknown,
  fallbackMessage: string,
): ApiResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    if (axiosError.response?.data) {
      return axiosError.response.data;
    }

    if (axiosError.code === 'ECONNABORTED') {
      return {
        success: false,
        message:
          'The request timed out. Please try again or contact us directly.',
      };
    }

    if (!axiosError.response) {
      return {
        success: false,
        message:
          'Network error or server unreachable. Please check your internet connection or call us directly at +44 75 1091 1940.',
      };
    }
  }

  return {
    success: false,
    message: fallbackMessage,
  };
};

/**
 * Submit Contact Form
 */
export const submitContactForm = async (
  formData: ContactFormData,
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      '/contact',
      formData,
    );

    return response.data;
  } catch (error: unknown) {
    return getApiErrorResponse(
      error,
      'Unable to submit your enquiry right now. Please try again or contact us directly.',
    );
  }
};

/**
 * Submit Quote Request
 */
export const submitQuoteRequest = async (
  quoteData: QuoteFormData,
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      '/quote',
      quoteData,
    );

    return response.data;
  } catch (error: unknown) {
    return getApiErrorResponse(
      error,
      'Unable to process your quote request right now. Please try again or contact us directly.',
    );
  }
};

/**
 * Log Receptionist Chat Interaction to backend/chat_history.php
 */
export interface ChatLogPayload {
  sessionId: string;
  userMessage: string;
  botResponse: string;
  timestamp: string;
}

export const logChatInteraction = async (
  payload: ChatLogPayload,
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      '/chat-log',
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    // Non-blocking log failure
    return {
      success: false,
      message: 'Chat history could not be logged to server.',
    };
  }
};

export default apiClient;