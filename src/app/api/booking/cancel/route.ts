import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { BookingService } from '@/lib/services/bookingService';
import { successResponse, handleError } from '@/lib/utils/apiResponse';

// POST /api/booking/cancel - Cancel booking
export async function POST(request: NextRequest) {
  try {
    // Cek autentikasi
    const user = getUserFromRequest(request);

    // Parse body untuk ambil booking ID
    const body = await request.json();
    const { booking_id } = body;

    if (!booking_id) {
      throw { message: 'booking_id harus diisi', status: 400 };
    }

    // Cancel booking
    const isAdmin = user.role === 'admin';
    const booking = await BookingService.cancelBooking(
      parseInt(booking_id),
      user.userId,
      isAdmin
    );

    return successResponse(booking, 'Booking berhasil dibatalkan');
  } catch (error: any) {
    return handleError(error);
  }
}
