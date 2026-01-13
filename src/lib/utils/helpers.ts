// Format tanggal ke YYYY-MM-DD
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format jam ke HH:mm
export function formatTime(time: string): string {
  // Jika sudah format HH:mm:ss, convert ke HH:mm
  if (time.length === 8) {
    return time.substring(0, 5);
  }
  return time;
}

// Hitung durasi dalam jam
export function calculateDuration(jamMulai: string, jamSelesai: string): number {
  const [startHour, startMin] = jamMulai.split(':').map(Number);
  const [endHour, endMin] = jamSelesai.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return (endMinutes - startMinutes) / 60;
}

// Format rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Generate random string untuk keperluan tertentu
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
