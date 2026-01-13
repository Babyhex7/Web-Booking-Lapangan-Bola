import { z } from 'zod';

// Schema validasi untuk register
export const registerSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  no_hp: z.string().min(10, 'Nomor HP minimal 10 digit'),
  role: z.enum(['user', 'admin']).optional(),
});

// Schema validasi untuk login
export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
});

// Schema validasi untuk lapangan
export const lapanganSchema = z.object({
  nama: z.string().min(3, 'Nama lapangan minimal 3 karakter'),
  deskripsi: z.string().optional(),
  harga_per_jam: z.number().positive('Harga harus lebih dari 0'),
  foto_url: z.array(z.string().url('URL foto tidak valid')).optional(),
  fasilitas: z.array(z.string()).optional(),
  status: z.enum(['aktif', 'nonaktif']).optional(),
});

// Schema validasi untuk booking
export const bookingSchema = z.object({
  lapangan_id: z.number().positive('Lapangan ID harus valid'),
  tanggal: z.string().refine((date) => {
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  }, 'Tanggal booking tidak boleh di masa lalu'),
  jam_mulai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam tidak valid (HH:mm)'),
  jam_selesai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam tidak valid (HH:mm)'),
  catatan: z.string().optional(),
}).refine((data) => {
  // Validasi jam_selesai > jam_mulai
  const [startHour, startMin] = data.jam_mulai.split(':').map(Number);
  const [endHour, endMin] = data.jam_selesai.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes > startMinutes;
}, 'Jam selesai harus lebih besar dari jam mulai');

// Schema untuk update booking status
export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
});

// Schema untuk update profile
export const updateProfileSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').optional(),
  no_hp: z.string().min(10, 'Nomor HP minimal 10 digit').optional(),
});
