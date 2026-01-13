import { NextResponse } from 'next/server';

// Helper untuk response sukses
export function successResponse(data: any, message: string = 'Success', status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

// Helper untuk response error
export function errorResponse(message: string, status: number = 400, errors?: any) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  );
}

// Helper untuk handle error dari try-catch
export function handleError(error: any) {
  console.error('Error:', error);
  
  const message = error.message || 'Terjadi kesalahan pada server';
  const status = error.status || 500;
  
  return errorResponse(message, status);
}

// Helper untuk validasi dengan Zod
export function validateData(schema: any, data: any) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    throw {
      message: 'Validasi gagal',
      status: 400,
      errors,
    };
  }
  
  return result.data;
}
