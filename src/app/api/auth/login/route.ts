import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/authService';
import { loginSchema } from '@/lib/validators/schemas';
import { successResponse, handleError, validateData } from '@/lib/utils/apiResponse';

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validasi input
    const validatedData = validateData(loginSchema, body);

    // Panggil service untuk login
    const result = await AuthService.login(validatedData.email, validatedData.password);

    // Return response sukses
    return successResponse(
      result,
      'Login berhasil'
    );
  } catch (error: any) {
    return handleError(error);
  }
}
