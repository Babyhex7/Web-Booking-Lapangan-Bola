// Type definitions untuk models

export interface UserAttributes {
  id?: number;
  email: string;
  nama: string;
  password: string;
  no_hp: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LapanganAttributes {
  id?: number;
  nama: string;
  deskripsi: string;
  harga_per_jam: number;
  foto_url: string[];
  fasilitas: string[];
  status: 'aktif' | 'nonaktif';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingAttributes {
  id?: number;
  user_id: number;
  lapangan_id: number;
  tanggal: Date;
  jam_mulai: string;
  jam_selesai: string;
  total_harga: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  catatan?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin';
}
