import { NextRequest } from 'next/server';
import { getUserFromRequest, requireAdmin } from '@/lib/middleware/auth';
import { LapanganService } from '@/lib/services/lapanganService';
import { lapanganSchema } from '@/lib/validators/schemas';
import { successResponse, handleError, validateData } from '@/lib/utils/apiResponse';

// GET /api/lapangan/[id] - Ambil detail lapangan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const lapangan = await LapanganService.getLapanganById(id);

    return successResponse(lapangan, 'Detail lapangan berhasil diambil');
  } catch (error: any) {
    return handleError(error);
  }
}

// PUT /api/lapangan/[id] - Update lapangan (Admin only)
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
    
    // Validasi partial (tidak semua field wajib)
    const validatedData = validateData(lapanganSchema.partial(), body);

    // Update lapangan
    const lapangan = await LapanganService.updateLapangan(id, validatedData);

    return successResponse(lapangan, 'Lapangan berhasil diupdate');
  } catch (error: any) {
    return handleError(error);
  }
}

// DELETE /api/lapangan/[id] - Hapus lapangan (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek autentikasi & role admin
    const user = getUserFromRequest(request);
    requireAdmin(user);

    const id = parseInt(params.id);
    const result = await LapanganService.deleteLapangan(id);

    return successResponse(result, 'Lapangan berhasil dihapus');
  } catch (error: any) {
    return handleError(error);
  }
}
