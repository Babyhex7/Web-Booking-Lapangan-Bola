import { NextRequest } from 'next/server';
import { BookingService } from '@/lib/services/bookingService';
import { successResponse, handleError } from '@/lib/utils/apiResponse';

// POST /api/booking/check-availability - Cek ketersediaan lapangan
export async function POST(request: NextRequest) {
  try {
    // Parse body
    const body = await request.json();
    const { lapangan_id, tanggal, jam_mulai, jam_selesai } = body;

    // Validasi input
    if (!lapangan_id || !tanggal || !jam_mulai || !jam_selesai) {
      throw {
        message: 'lapangan_id, tanggal, jam_mulai, dan jam_selesai harus diisi',
        status: 400,
      };
    }

    // Cek ketersediaan
    const availability = await BookingService.checkAvailability(
      parseInt(lapangan_id),
      tanggal,
      jam_mulai,
      jam_selesai
    );

    return successResponse(
      availability,
      availability.available
        ? 'Lapangan tersedia untuk waktu tersebut'
        : 'Lapangan tidak tersedia, sudah ada booking'
    );
  } catch (error: any) {
    return handleError(error);
  }
}
