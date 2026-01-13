import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { User } from '@/lib/models';
import { updateProfileSchema } from '@/lib/validators/schemas';
import { successResponse, handleError, validateData } from '@/lib/utils/apiResponse';

// GET /api/user/profile - Ambil profile user yang login
export async function GET(request: NextRequest) {
  try {
    // Cek autentikasi
    const userData = getUserFromRequest(request);

    // Ambil data user lengkap (tanpa password)
    const user = await User.findByPk(userData.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw { message: 'User tidak ditemukan', status: 404 };
    }

    return successResponse(user, 'Data profile berhasil diambil');
  } catch (error: any) {
    return handleError(error);
  }
}

// PUT /api/user/profile - Update profile user
export async function PUT(request: NextRequest) {
  try {
    // Cek autentikasi
    const userData = getUserFromRequest(request);

    // Parse & validasi body
    const body = await request.json();
    const validatedData = validateData(updateProfileSchema, body);

    // Ambil user
    const user = await User.findByPk(userData.userId);

    if (!user) {
      throw { message: 'User tidak ditemukan', status: 404 };
    }

    // Update user
    await user.update(validatedData);

    // Return user tanpa password
    const updatedUser = await User.findByPk(userData.userId, {
      attributes: { exclude: ['password'] },
    });

    return successResponse(updatedUser, 'Profile berhasil diupdate');
  } catch (error: any) {
    return handleError(error);
  }
}
