import { NextRequest } from 'next/server';
import { getUserFromRequest, requireAdmin } from '@/lib/middleware/auth';
import { BookingService } from '@/lib/services/bookingService';
import { bookingSchema } from '@/lib/validators/schemas';
import { successResponse, handleError, validateData } from '@/lib/utils/apiResponse';

// GET /api/booking - Ambil semua booking
export async function GET(request: NextRequest) {
  try {
    // Cek autentikasi
    const user = getUserFromRequest(request);

    // Ambil query params untuk filter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tanggal = searchParams.get('tanggal');
    const lapanganId = searchParams.get('lapangan_id');

    const filters: any = {};
    if (status) filters.status = status;
    if (tanggal) filters.tanggal = tanggal;
    if (lapanganId) filters.lapanganId = parseInt(lapanganId);

    // Jika bukan admin, hanya bisa lihat booking sendiri
    if (user.role !== 'admin') {
      filters.userId = user.userId;
    }

    // Ambil data booking
    const bookings = await BookingService.getAllBookings(filters);

    return successResponse(bookings, 'Data booking berhasil diambil');
  } catch (error: any) {
    return handleError(error);
  }
}

// POST /api/booking - Buat booking baru
export async function POST(request: NextRequest) {
  try {
    // Cek autentikasi
    const user = getUserFromRequest(request);

    // Parse & validasi body
    const body = await request.json();
    const validatedData = validateData(bookingSchema, body);

    // Buat booking dengan user_id dari token
    const booking = await BookingService.createBooking({
      ...validatedData,
      user_id: user.userId,
      tanggal: new Date(validatedData.tanggal),
      total_harga: 0, // Akan dihitung otomatis di service
    });

    return successResponse(booking, 'Booking berhasil dibuat', 201);
  } catch (error: any) {
    return handleError(error);
  }
}
