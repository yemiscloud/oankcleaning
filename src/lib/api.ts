import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { telemetry } from './telemetry';

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

// Network Data Capture Interceptor (Performance, Latency & Error Tracking)
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _startTime?: number;
}

apiClient.interceptors.request.use((config: CustomRequestConfig) => {
  config._startTime = performance.now();
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const config = response.config as CustomRequestConfig;
    const durationMs = config._startTime
      ? Math.round(performance.now() - config._startTime)
      : 0;

    telemetry.recordNetworkRequest({
      url: response.config.url || '',
      method: (response.config.method || 'GET').toUpperCase(),
      status: response.status,
      durationMs,
      success: true,
      sizeBytes: JSON.stringify(response.data || '').length,
    });

    return response;
  },
  (error) => {
    const config = (error.config || {}) as CustomRequestConfig;
    const durationMs = config._startTime
      ? Math.round(performance.now() - config._startTime)
      : 0;

    telemetry.recordNetworkRequest({
      url: config.url || '',
      method: (config.method || 'GET').toUpperCase(),
      status: error.response?.status || null,
      durationMs,
      success: false,
      errorMessage: error.message || 'Network Error',
    });

    return Promise.reject(error);
  }
);

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
 * Submit Contact Form via Axios API
 * ONLY resolves with success=true if the backend confirms both:
 * 1. Form data was successfully stored in the MySQL enquiries database table.
 * 2. Notification email was successfully dispatched to the preferred company email.
 */
export const submitContactForm = async (
  formData: ContactFormData,
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      '/contact',
      formData,
    );

    const payload = response.data;
    const isDbSaved = payload?.data?.database?.saved === true;
    const isEmailSent = payload?.data?.mail?.adminSent === true;

    // Strict validation: Only show success when BOTH database and preferred email succeeded
    if (payload && payload.success && isDbSaved && isEmailSent) {
      return {
        success: true,
        message: payload.message || 'Your enquiry has been successfully recorded in our database and delivered to our team.',
        referenceNo: payload.data?.referenceNo || payload.referenceNo,
        databaseDelivered: true,
        emailDelivered: true,
        data: payload.data,
      };
    }

    // Identify specific failure reason if partial
    const reasons: string[] = [];
    if (!isDbSaved) reasons.push('1 failed');
    if (!isEmailSent) reasons.push('2 failed');

    return {
      success: false,
      message: reasons.length > 0
        ? `Delivery incomplete: ${reasons.join(' and ')}. Please contact us directly at +44 75 1091 1940.`
        : (payload?.message || 'Submission could not be completed.'),
      databaseDelivered: isDbSaved,
      emailDelivered: isEmailSent,
    };
  } catch (error: unknown) {
    return getApiErrorResponse(
      error,
      'Unable to submit your enquiry right now. Please ensure the backend database and email services are reachable or call our team directly at +44 75 1091 1940.',
    );
  }
};

/**
 * Submit Quote Request via Axios API
 * ONLY resolves with success=true if the backend confirms both:
 * 1. Quote data was successfully stored in the MySQL enquiries database table.
 * 2. Notification email was successfully dispatched to the preferred company email.
 */
export const submitQuoteRequest = async (
  quoteData: QuoteFormData,
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      '/quote',
      quoteData,
    );

    const payload = response.data;
    const isDbSaved = payload?.data?.submission?.databaseSaved === true;
    const isEmailSent = payload?.data?.submission?.mail?.adminSent === true;
    const finalEstimate = payload?.data?.breakdown?.finalEstimate || payload?.estimatedPrice;
    const refNo = payload?.data?.referenceNo || payload?.referenceNo;

    // Strict validation: Only show success when BOTH database and preferred email succeeded
    if (payload && payload.success && isDbSaved && isEmailSent) {
      return {
        success: true,
        message: payload.message || 'Your quote request has been recorded in our database and delivered to our team.',
        referenceNo: refNo,
        quoteId: refNo,
        estimatedPrice: finalEstimate,
        breakdown: payload?.data?.breakdown,
        databaseDelivered: true,
        emailDelivered: true,
        data: payload.data,
      };
    }

    const reasons: string[] = [];
    if (!isDbSaved) reasons.push('1 failed');
    if (!isEmailSent) reasons.push('2 failed');

    return {
      success: false,
      message: reasons.length > 0
        ? `Delivery incomplete: ${reasons.join(' and ')}. Please contact us directly at +44 75 1091 1940.`
        : (payload?.message || 'Quote request could not be completed.'),
      databaseDelivered: isDbSaved,
      emailDelivered: isEmailSent,
    };
  } catch (error: unknown) {
    return getApiErrorResponse(
      error,
      'Unable to process your quote request right now. Please ensure the backend database and email services are reachable or call our team directly at +44 75 1091 1940.',
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