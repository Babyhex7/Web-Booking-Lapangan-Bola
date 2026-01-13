import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/utils/apiResponse';

// POST /api/auth/logout - Logout user
// Note: Karena menggunakan JWT stateless, logout dilakukan di client side
// dengan menghapus token. Endpoint ini hanya untuk konfirmasi.
export async function POST(request: NextRequest) {
  return successResponse(
    null,
    'Logout berhasil'
  );
}
