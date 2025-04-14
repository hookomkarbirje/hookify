
/**
 * Utility functions for handling cookies
 */

// Set a cookie with the given name, value, and expiration days
export const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

// Get a cookie value by name
export const getCookie = (name: string): string | null => {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  
  return null;
};

// Delete a cookie by name
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// Set a JSON object as a cookie
export const setJsonCookie = (name: string, value: any, days: number = 7) => {
  const jsonValue = JSON.stringify(value);
  setCookie(name, jsonValue, days);
};

// Get a JSON object from a cookie
export const getJsonCookie = <T>(name: string): T | null => {
  const cookieValue = getCookie(name);
  if (!cookieValue) return null;
  
  try {
    return JSON.parse(cookieValue) as T;
  } catch (error) {
    console.error(`Error parsing cookie ${name}:`, error);
    return null;
  }
};
