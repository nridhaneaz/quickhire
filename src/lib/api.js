const BASE_URL = import.meta.env.VITE_API_URL || 'https://quick-hire-backend-zzw6.onrender.com/api/v1';

// ─── Token helpers ─────────────────────────────────────────────────
const getToken             = () => sessionStorage.getItem('accessToken');
const getRefreshToken      = () => sessionStorage.getItem('refreshToken');
const getAdminToken        = () => sessionStorage.getItem('adminAccessToken');
const getAdminRefreshToken = () => sessionStorage.getItem('adminRefreshToken');

// ─── Internal: call refresh endpoint and rotate stored tokens ──────
// Backend returns { accessToken, refreshToken } — both are updated (rotation).
const _doRefresh = async (refreshToken, accessKey, refreshKey) => {
  const res = await fetch(`${BASE_URL}/auth/refresh-access-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Refresh failed');
  
  // Use sessionStorage for both user and admin tokens
  sessionStorage.setItem(accessKey,  data.data.accessToken);
  sessionStorage.setItem(refreshKey, data.data.refreshToken);
  return data.data.accessToken;
};

// ─── Internal: build request headers ───────────────────────────────
const _buildHeaders = (token, isFormData, extra = {}) => ({
  ...(!isFormData && { 'Content-Type': 'application/json' }),
  ...(token && { Authorization: `Bearer ${token}` }),
  ...extra,
});

// ─── Base fetch wrapper (user token) ─────────────────────────────
// On 401: silently refreshes the access token and retries once.
// On refresh failure: clears session and redirects to /login.
export const api = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const { headers: optHeaders, ...restOptions } = options;

  const doFetch = (token) =>
    fetch(`${BASE_URL}${endpoint}`, {
      ...restOptions,
      headers: _buildHeaders(token, isFormData, optHeaders),
    });

  let res = await doFetch(getToken());

  if (res.status === 401) {
    try {
      const newToken = await _doRefresh(getRefreshToken(), 'accessToken', 'refreshToken');
      res = await doFetch(newToken);
    } catch (_) {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userLastActivity');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  } else {
    const text = await res.text();
    if (!res.ok) throw new Error(text || 'Server error');
    throw new Error('Invalid response format');
  }
};

// ─── Base fetch wrapper (admin token) ────────────────────────────
// On 401: silently refreshes the admin access token and retries once.
// On refresh failure: clears admin session and redirects to /admin/login.
export const adminApi = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const { headers: optHeaders, ...restOptions } = options;

  const doFetch = (token) =>
    fetch(`${BASE_URL}${endpoint}`, {
      ...restOptions,
      headers: _buildHeaders(token, isFormData, optHeaders),
    });

  let res = await doFetch(getAdminToken());

  if (res.status === 401) {
    try {
      const newToken = await _doRefresh(getAdminRefreshToken(), 'adminAccessToken', 'adminRefreshToken');
      res = await doFetch(newToken);
    } catch (_) {
      sessionStorage.removeItem('adminAccessToken');
      sessionStorage.removeItem('adminRefreshToken');
      sessionStorage.removeItem('adminUser');
      sessionStorage.removeItem('adminLastActivity');
      window.location.href = '/admin/login';
      throw new Error('Admin session expired. Please log in again.');
    }
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  } else {
    const text = await res.text();
    if (!res.ok) throw new Error(text || 'Server error');
    throw new Error('Invalid response format');
  }
};

// ─── Auth APIs ────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () =>
    api('/auth/logout', { method: 'POST' }),

  // Logout with an explicit token (used by admin context)
  logoutWithToken: (token) => {
    if (!token) return Promise.resolve();
    return fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  },

  refreshToken: (refreshToken) =>
    api('/auth/refresh-access-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  forgetPassword: (email) =>
    api('/auth/forget-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyCode: (email, otp) =>
    api('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  resetPassword: (email, newPassword) =>
    api('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    }),

  changePassword: (oldPassword, newPassword) =>
    api('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

// ─── Jobs APIs ────────────────────────────────────────────────────
export const jobsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api(`/jobs${query ? '?' + query : ''}`);
  },

  getById: (id) => api(`/jobs/${id}`),

  create: (formData) =>
    api('/jobs', {
      method: 'POST',
      body: formData,
    }),

  update: (id, formData) =>
    api(`/jobs/${id}`, {
      method: 'PUT',
      body: formData,
    }),

  delete: (id) =>
    api(`/jobs/${id}`, { method: 'DELETE' }),
};

// ─── Categories APIs ──────────────────────────────────────────────
export const categoriesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api(`/categories${query ? '?' + query : ''}`);
  },

  create: (formData) =>
    api('/categories', {
      method: 'POST',
      body: formData,
    }),

  delete: (id) =>
    api(`/categories/${id}`, { method: 'DELETE' }),
};

// ─── Applications APIs ────────────────────────────────────────────
export const applicationsAPI = {
  apply: (data) =>
    api('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // User: get their own applications
  getMyApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api(`/applications/my-applications${query ? '?' + query : ''}`);
  },
};

// ─── Broadcast APIs ───────────────────────────────────────────────
export const broadcastAPI = {
  subscribe: (email) =>
    api('/broadcast/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ─── Admin Broadcast APIs (use adminApi / adminAccessToken) ───────
export const adminBroadcastAPI = {
  getAllSubscribers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return adminApi(`/broadcast/subscribe${query ? '?' + query : ''}`);
  },
  getSubscriberById: (id) => adminApi(`/broadcast/subscribe/${id}`),
  deleteSubscriber: (id) =>
    adminApi(`/broadcast/subscribe/${id}`, { method: 'DELETE' }),
  sendToAll: (data) =>
    adminApi('/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendToSpecific: (data) =>
    adminApi('/broadcast/specific', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAllBroadcasts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return adminApi(`/broadcast${query ? '?' + query : ''}`);
  },
  getBroadcastById: (id) => adminApi(`/broadcast/${id}`),
  deleteBroadcast: (id) =>
    adminApi(`/broadcast/${id}`, { method: 'DELETE' }),
};

// ─── Users APIs (authenticated) ──────────────────────────────────
export const usersAPI = {
  getProfile: () => api('/user/me'),

  updateProfile: (data) =>
    api('/user/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteAccount: () =>
    api('/user/me', { method: 'DELETE' }),

  uploadAvatar: (formData) =>
    api('/user/upload-avatar', {
      method: 'POST',
      body: formData,
    }),

  updateAvatar: (formData) =>
    api('/user/upload-avatar', {
      method: 'PUT',
      body: formData,
    }),

  deleteAvatar: () =>
    api('/user/upload-avatar', { method: 'DELETE' }),

  // Admin
  getAllUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api(`/user/all-users${query ? '?' + query : ''}`);
  },

  getUserById: (id) => api(`/user/${id}`),

  updateUser: (id, data) =>
    api(`/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUser: (id) =>
    api(`/user/${id}`, { method: 'DELETE' }),
};

// ─── Admin Jobs APIs (use adminApi / adminAccessToken) ────────────
export const adminJobsAPI = {
  create: (formData) =>
    adminApi('/jobs', { method: 'POST', body: formData }),
  update: (id, formData) =>
    adminApi(`/jobs/${id}`, { method: 'PUT', body: formData }),
  delete: (id) =>
    adminApi(`/jobs/${id}`, { method: 'DELETE' }),
};

// ─── Admin Categories APIs (use adminApi / adminAccessToken) ──────
export const adminCategoriesAPI = {
  create: (formData) =>
    adminApi('/categories', { method: 'POST', body: formData }),
  update: (id, formData) =>
    adminApi(`/categories/${id}`, { method: 'PUT', body: formData }),
  delete: (id) =>
    adminApi(`/categories/${id}`, { method: 'DELETE' }),
};

// ─── Admin Applications APIs (use adminApi / adminAccessToken) ────
export const adminApplicationsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return adminApi(`/applications${query ? '?' + query : ''}`);
  },
  getById: (id) => adminApi(`/applications/${id}`),
  updateStatus: (id, data) =>
    adminApi(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    adminApi(`/applications/${id}`, { method: 'DELETE' }),
};

// ─── Admin Users APIs (use adminApi / adminAccessToken) ───────────────
export const adminUsersAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return adminApi(`/user/all-users${query ? '?' + query : ''}`);
  },
  getById: (id) => adminApi(`/user/${id}`),
};
