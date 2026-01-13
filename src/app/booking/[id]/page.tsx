'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bookingAPI } from '@/lib/api/client';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Interface untuk Booking Detail
interface Booking {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  total_harga: number;
  status: string;
  catatan?: string;
  createdAt: string;
  user: {
    id: number;
    nama: string;
    email: string;
    no_hp: string;
  };
  lapangan: {
    id: number;
    nama: string;
    harga_per_jam: number;
  };
}

// Page untuk detail booking
export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    loadBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params.id]);

  const loadBooking = async () => {
    try {
      const response = await bookingAPI.getById(parseInt(params.id));
      setBooking(response.data);
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Yakin ingin cancel booking ini?')) return;

    try {
      await bookingAPI.cancel(parseInt(params.id));
      alert('Booking berhasil dibatalkan');
      router.push('/booking');
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

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('id-ID');
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

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Booking tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Kembali
        </Button>

        <Card>
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">Detail Booking</h1>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusBadge(booking.status)}`}>
              {booking.status}
            </span>
          </div>

          {/* Info Lapangan */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="text-lg font-semibold mb-2">Informasi Lapangan</h3>
            <p className="text-xl text-gray-800">{booking.lapangan.nama}</p>
            <p className="text-gray-600">{formatRupiah(booking.lapangan.harga_per_jam)}/jam</p>
          </div>

          {/* Info Booking */}
          <div className="mb-6 pb-6 border-b space-y-3">
            <h3 className="text-lg font-semibold mb-2">Informasi Booking</h3>
            
            <div>
              <p className="text-sm text-gray-500">Tanggal</p>
              <p className="font-medium">{formatDate(booking.tanggal)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Jam Mulai</p>
                <p className="font-medium">{booking.jam_mulai}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jam Selesai</p>
                <p className="font-medium">{booking.jam_selesai}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Harga</p>
              <p className="text-2xl font-bold text-blue-600">{formatRupiah(booking.total_harga)}</p>
            </div>

            {booking.catatan && (
              <div>
                <p className="text-sm text-gray-500">Catatan</p>
                <p className="text-gray-700">{booking.catatan}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Dibuat pada</p>
              <p className="text-gray-700">{formatDateTime(booking.createdAt)}</p>
            </div>
          </div>

          {/* Info Pemesan */}
          <div className="mb-6 space-y-3">
            <h3 className="text-lg font-semibold mb-2">Informasi Pemesan</h3>
            
            <div>
              <p className="text-sm text-gray-500">Nama</p>
              <p className="font-medium">{booking.user.nama}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{booking.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">No. HP</p>
                <p className="font-medium">{booking.user.no_hp}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {booking.status === 'pending' && (
            <div className="flex gap-2">
              <Button variant="danger" onClick={handleCancel} className="w-full">
                Cancel Booking
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
