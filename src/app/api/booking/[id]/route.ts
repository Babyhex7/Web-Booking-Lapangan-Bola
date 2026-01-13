import { NextRequest } from 'next/server';
import { getUserFromRequest, requireAdmin } from '@/lib/middleware/auth';
import { BookingService } from '@/lib/services/bookingService';
import { updateBookingStatusSchema } from '@/lib/validators/schemas';
import { successResponse, handleError, validateData } from '@/lib/utils/apiResponse';

// GET /api/booking/[id] - Ambil detail booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek autentikasi
    const user = getUserFromRequest(request);

    const id = parseInt(params.id);
    const booking = await BookingService.getBookingById(id);

    // User hanya bisa lihat booking sendiri, admin bisa lihat semua
    if (user.role !== 'admin' && (booking as any).user_id !== user.userId) {
      throw { message: 'Anda tidak memiliki akses ke booking ini', status: 403 };
    }

    return successResponse(booking, 'Detail booking berhasil diambil');
  } catch (error: any) {
    return handleError(error);
  }
}

// PUT /api/booking/[id] - Update booking (Admin only untuk update status)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek autentikasi & role admin
    const user = getUserFromRequest(request);
    requireAdmin(user);

    const id = parseInt(params.id);
    const body = await request.json();
    
    // Validasi untuk update status
    const validatedData = validateData(updateBookingStatusSchema, body);

    // Update booking
    const booking = await BookingService.updateBooking(id, validatedData);

    return successResponse(booking, 'Booking berhasil diupdate');
  } catch (error: any) {
    return handleError(error);
  }
}

// DELETE /api/booking/[id] - Hapus booking (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek autentikasi & role admin
    const user = getUserFromRequest(request);
    requireAdmin(user);

    const id = parseInt(params.id);
    const result = await BookingService.deleteBooking(id);

    return successResponse(result, 'Booking berhasil dihapus');
  } catch (error: any) {
    return handleError(error);
  }
}
