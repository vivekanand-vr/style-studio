/**
 * Base API client — thin wrapper around fetch.
 * All API modules import this to make requests.
 *
 * Base URL is set via the VITE_API_URL env variable (see frontend/.env).
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);

  // Parse body regardless — error responses also return JSON
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `HTTP ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data;
}

export const api = {
  get:    (path, options)       => request(path, { method: 'GET',    ...options }),
  post:   (path, body, options) => request(path, { method: 'POST',   body, ...options }),
  patch:  (path, body, options) => request(path, { method: 'PATCH',  body, ...options }),
  delete: (path, options)       => request(path, { method: 'DELETE', ...options }),
};

export { ApiError };
