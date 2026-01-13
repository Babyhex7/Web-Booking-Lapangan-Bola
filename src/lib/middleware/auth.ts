import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/authService';

// Middleware untuk validasi JWT token
export async function authMiddleware(request: NextRequest) {
  try {
   
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }


    const token = authHeader.substring(7);

    const decoded = AuthService.verifyToken(token);

   
    return { userId: decoded.userId, email: decoded.email, role: decoded.role };
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Unauthorized' },
      { status: 401 }
    );
  }
}

// Helper untuk extract user dari token
export function getUserFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token tidak ditemukan');
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);

    return decoded;
  } catch (error) {
    throw new Error('Token tidak valid');
  }
}

// Middleware untuk cek role admin
export function requireAdmin(user: { role: string }) {
  if (user.role !== 'admin') {
    throw new Error('Akses ditolak. Hanya admin yang dapat mengakses');
  }
}
