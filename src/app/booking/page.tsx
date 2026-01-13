'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bookingAPI } from '@/lib/api/client';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Interface untuk Booking
interface Booking {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  total_harga: number;
  status: string;
  catatan?: string;
  lapangan: {
    id: number;
    nama: string;
    harga_per_jam: number;
  };
}

// Page untuk list booking user
export default function BookingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filter]);

  const loadBookings = async () => {
    try {
      const filters = filter !== 'all' ? { status: filter } : undefined;
      const response = await bookingAPI.getAll(filters);
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Yakin ingin cancel booking ini?')) return;

    try {
      await bookingAPI.cancel(id);
      alert('Booking berhasil dibatalkan');
      loadBookings();
    } catch (error: any) {
      alert(error.message || 'Cancel booking gagal');
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Booking Saya</h1>
          <Button onClick={() => router.push('/lapangan')}>
            Booking Baru
          </Button>
        </div>

        {/* Filter Status */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* List Booking */}
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{booking.lapangan.nama}</h3>
                  <p className="text-gray-600">{formatDate(booking.tanggal)}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusBadge(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Waktu</p>
                  <p className="font-medium">{booking.jam_mulai} - {booking.jam_selesai}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Harga</p>
                  <p className="font-medium text-blue-600">{formatRupiah(booking.total_harga)}</p>
                </div>
              </div>

              {booking.catatan && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Catatan</p>
                  <p className="text-gray-700">{booking.catatan}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/booking/${booking.id}`)}
                >
                  Detail
                </Button>
                {booking.status === 'pending' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada booking</p>
            <Button onClick={() => router.push('/lapangan')}>
              Lihat Lapangan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
