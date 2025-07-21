// Utility function for authenticated API requests
// Usage: import authFetch from './utils/authFetch';
//        const response = await authFetch(url, options);

export default async function authFetch(url, options = {}) {
  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // Clone and augment the options object
  const opts = {
    ...options,
    headers: {
      ...(options.headers || {}),
      // Add Authorization header if token exists
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  // Make the fetch request
  const response = await fetch(url, opts);

  // If unauthorized or forbidden, clear auth and redirect to login
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    // Optionally, you can show a message or notification here
    window.location.href = '/login';
    // Return a rejected promise so calling code doesn't continue
    throw new Error('Unauthorized. Redirecting to login.');
  }

  // Otherwise, return the response as normal
  return response;
} 