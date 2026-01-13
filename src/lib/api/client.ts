// API client untuk call backend endpoints
const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Helper untuk fetch dengan token
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
}

// Auth API
export const authAPI = {
  // Register user baru
  register: async (data: { email: string; nama: string; password: string; no_hp: string }) => {
    return fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Login user
  login: async (email: string, password: string) => {
    return fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Get current user
  me: async () => {
    return fetchAPI('/api/auth/me');
  },
  
  // Logout user
  logout: async () => {
    return fetchAPI('/api/auth/logout', { method: 'POST' });
  },
};

// Lapangan API
export const lapanganAPI = {
  // List semua lapangan
  getAll: async (filters?: { status?: string; nama?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.nama) params.append('nama', filters.nama);
    
    return fetchAPI(`/api/lapangan?${params.toString()}`);
  },
  
  // Detail lapangan
  getById: async (id: number) => {
    return fetchAPI(`/api/lapangan/${id}`);
  },
  
  // Create lapangan (Admin only)
  create: async (data: any) => {
    return fetchAPI('/api/lapangan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Update lapangan (Admin only)
  update: async (id: number, data: any) => {
    return fetchAPI(`/api/lapangan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Delete lapangan 
  delete: async (id: number) => {
    return fetchAPI(`/api/lapangan/${id}`, { method: 'DELETE' });
  },
};

// Booking API
export const bookingAPI = {
  // Check availability
  checkAvailability: async (data: {
    lapangan_id: number;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
  }) => {
    return fetchAPI('/api/booking/check-availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // List booking
  getAll: async (filters?: { status?: string; tanggal?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tanggal) params.append('tanggal', filters.tanggal);
    
    return fetchAPI(`/api/booking?${params.toString()}`);
  },
  
  // Detail booking
  getById: async (id: number) => {
    return fetchAPI(`/api/booking/${id}`);
  },
  
  // Create booking
  create: async (data: {
    lapangan_id: number;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    catatan?: string;
  }) => {
    return fetchAPI('/api/booking', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Cancel booking
  cancel: async (id: number) => {
    return fetchAPI('/api/booking/cancel', {
      method: 'POST',
      body: JSON.stringify({ booking_id: id }),
    });
  },
};

// User API
export const userAPI = {
  // Get profile
  getProfile: async () => {
    return fetchAPI('/api/user/profile');
  },
  
  // Update profile
  updateProfile: async (data: { nama?: string; no_hp?: string }) => {
    return fetchAPI('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Get booking history
  getHistory: async () => {
    return fetchAPI('/api/user/history');
  },
};
