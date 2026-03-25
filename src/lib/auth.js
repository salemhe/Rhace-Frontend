/**
 * Authentication utilities for token management and validation
 * Handles localStorage token operations, refresh logic, and validation
 * Usage: import { ensureValidToken } from '@/lib/auth';
 */

import { toast } from 'react-toastify';

// Get current auth token from storage
export const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('vendor_token');
};

// Check if valid token exists
export const hasValidToken = () => {
  const token = getAuthToken();
  return !!token && !isTokenExpired(token);
};

// Simple JWT expiry check (decode payload)
export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // Invalid token treated as expired
  }
};

// Save token to storage
export const saveAuthToken = (token, isVendor = false) => {
  const key = isVendor ? 'vendor_token' : 'token';
  localStorage.setItem(key, token);
};

// Clear all auth tokens and redirect  
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('vendor_token');
  localStorage.removeItem('persist:root');
  toast.error('Session expired. Please log in again.');
};

// Ensure token is valid before API call
export const ensureValidToken = async () => {
  const token = getAuthToken();
  
  if (!token) {
    clearAuth();
    return null;
  }
  
  if (isTokenExpired(token)) {
    // Token expired - attempt refresh (future: implement refresh endpoint)
    toast.warning('Session expired. Redirecting to login...');
    clearAuth();
    return null;
  }
  
  return token;
};

// Pre-flight token check for payment/reservation callbacks
export const validateCallbackToken = () => {
  if (hasValidToken()) {
    return true;
  }
  
  toast.info('Please wait while we validate your session...');
  return false;
};

// Export types for type safety
export const AuthStatus = {
  VALID: 'valid',
  EXPIRED: 'expired',
  MISSING: 'missing'
};

export const getAuthStatus = () => {
  const token = getAuthToken();
  if (!token) return AuthStatus.MISSING;
  if (isTokenExpired(token)) return AuthStatus.EXPIRED;
  return AuthStatus.VALID;
};

