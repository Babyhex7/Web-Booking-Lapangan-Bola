import { NextRequest } from 'next/server';
import { getUserFromRequest, requireAdmin } from '@/lib/middleware/auth';
import { LapanganService } from '@/lib/services/lapanganService';
import { lapanganSchema } from '@/lib/validators/schemas';
import { successResponse, handleError, validateData } from '@/lib/utils/apiResponse';

// GET /api/lapangan - Ambil semua lapangan
export async function GET(request: NextRequest) {
  try {
    // Ambil query params untuk filter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'aktif' | 'nonaktif' | null;
    const nama = searchParams.get('nama');

    const filters: any = {};
    if (status) filters.status = status;
    if (nama) filters.nama = nama;

    // Ambil data lapangan
    const lapangan = await LapanganService.getAllLapangan(filters);

    return successResponse(lapangan, 'Data lapangan berhasil diambil');
  } catch (error: any) {
    return handleError(error);
  }
}

// POST /api/lapangan - Buat lapangan baru (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Cek autentikasi & role admin
    const user = getUserFromRequest(request);
    requireAdmin(user);

    // Parse & validasi body
    const body = await request.json();
    const validatedData = validateData(lapanganSchema, body);

    // Buat lapangan
    const lapangan = await LapanganService.createLapangan(validatedData);

    return successResponse(lapangan, 'Lapangan berhasil dibuat', 201);
  } catch (error: any) {
    return handleError(error);
  }
}
