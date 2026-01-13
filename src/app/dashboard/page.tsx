'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Interface untuk Booking
interface Booking {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  status: string;
  lapangan: {
    nama: string;
  };
}

// Dashboard user - ringkasan & quick actions
export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadData = async () => {
    try {
      const response = await userAPI.getHistory();
      setBookingHistory(response.data.slice(0, 5)); // Ambil 5 terakhir
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Selamat datang, {user.nama}!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <h3 className="font-semibold mb-2">Booking Baru</h3>
            <p className="text-gray-600 text-sm mb-4">Booking lapangan sekarang</p>
            <Link href="/lapangan">
              <Button className="w-full" size="sm">Lihat Lapangan</Button>
            </Link>
          </Card>

          <Card className="text-center">
            <h3 className="font-semibold mb-2">Booking Saya</h3>
            <p className="text-gray-600 text-sm mb-4">Lihat & kelola booking</p>
            <Link href="/booking">
              <Button variant="outline" className="w-full" size="sm">Lihat Booking</Button>
            </Link>
          </Card>

          <Card className="text-center">
            <h3 className="font-semibold mb-2">Profile</h3>
            <p className="text-gray-600 text-sm mb-4">Edit informasi akun</p>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full" size="sm">Edit Profile</Button>
            </Link>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Riwayat Booking</h2>
            <Link href="/booking" className="text-blue-600 hover:underline text-sm">
              Lihat Semua
            </Link>
          </div>

          {bookingHistory.length > 0 ? (
            <div className="space-y-3">
              {bookingHistory.map((booking) => (
                <div 
                  key={booking.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/booking/${booking.id}`)}
                >
                  <div>
                    <p className="font-medium">{booking.lapangan.nama}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.tanggal)} • {booking.jam_mulai} - {booking.jam_selesai}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada riwayat booking</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
