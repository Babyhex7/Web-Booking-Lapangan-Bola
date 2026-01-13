import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/authService';
import { registerSchema } from '@/lib/validators/schemas';
import { successResponse, errorResponse, handleError, validateData } from '@/lib/utils/apiResponse';

// POST /api/auth/register - Daftar user baru
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validasi input dengan Zod
    const validatedData = validateData(registerSchema, body);

    // Panggil service untuk register
    const result = await AuthService.register(validatedData);

    // Return response sukses
    return successResponse(
      result,
      'Registrasi berhasil',
      201
    );
  } catch (error: any) {
    return handleError(error);
  }
}
