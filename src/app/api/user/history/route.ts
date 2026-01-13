import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { BookingService } from '@/lib/services/bookingService';
import { successResponse, handleError } from '@/lib/utils/apiResponse';

// GET /api/user/history - Ambil riwayat booking user
export async function GET(request: NextRequest) {
  try {
    // Cek autentikasi
    const user = getUserFromRequest(request);

    // Ambil query params untuk filter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tanggal = searchParams.get('tanggal');

    const filters: any = {
      userId: user.userId, // Hanya ambil booking user yang login
    };

    if (status) filters.status = status;
    if (tanggal) filters.tanggal = tanggal;

    // Ambil riwayat booking
    const bookings = await BookingService.getAllBookings(filters);

    return successResponse(bookings, 'Riwayat booking berhasil diambil');
  } catch (error: any) {
    return handleError(error);
  }
}
