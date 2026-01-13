import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { AuthService } from '@/lib/services/authService';
import { successResponse, errorResponse, handleError } from '@/lib/utils/apiResponse';

// GET /api/auth/me - Ambil data user yang sedang login
export async function GET(request: NextRequest) {
  try {
    // Extract user dari token
    const userData = getUserFromRequest(request);

    // Ambil data user lengkap
    const user = await AuthService.getUserById(userData.userId);

    return successResponse(user, 'Data user berhasil diambil');
  } catch (error: any) {
    return handleError(error);
  }
}
