'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { lapanganAPI, bookingAPI } from '@/lib/api/client';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

// Interface untuk Lapangan detail
interface Lapangan {
  id: number;
  nama: string;
  deskripsi: string;
  harga_per_jam: number;
  fasilitas: string[];
  foto_url: string[];
  status: string;
}

// Page untuk detail lapangan & booking
export default function LapanganDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [lapangan, setLapangan] = useState<Lapangan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Form booking
  const [bookingData, setBookingData] = useState({
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    catatan: '',
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    loadLapangan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadLapangan = async () => {
    try {
      const response = await lapanganAPI.getById(parseInt(params.id));
      setLapangan(response.data);
    } catch (error) {
      console.error('Error loading lapangan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setBookingLoading(true);
    try {
      // Check availability dulu
      const availabilityResponse = await bookingAPI.checkAvailability({
        lapangan_id: parseInt(params.id),
        ...bookingData,
      });

      if (!availabilityResponse.data.available) {
        setBookingError('Jadwal tidak tersedia, pilih waktu lain');
        setBookingLoading(false);
        return;
      }

      // Buat booking
      await bookingAPI.create({
        lapangan_id: parseInt(params.id),
        ...bookingData,
      });

      alert('Booking berhasil dibuat!');
      router.push('/booking');
    } catch (error: any) {
      setBookingError(error.message || 'Booking gagal');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!lapangan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Lapangan tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Kembali
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detail Lapangan */}
          <div className="lg:col-span-2">
            <Card>
              <h1 className="text-3xl font-bold mb-4">{lapangan.nama}</h1>
              <p className="text-gray-600 mb-6">{lapangan.deskripsi}</p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Harga</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {formatRupiah(lapangan.harga_per_jam)}
                  <span className="text-lg text-gray-500">/jam</span>
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Fasilitas</h3>
                <div className="flex flex-wrap gap-2">
                  {lapangan.fasilitas.map((fasilitas, idx) => (
                    <span 
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg"
                    >
                      {fasilitas}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <h3 className="text-xl font-semibold mb-4">Booking Sekarang</h3>
              
              {user ? (
                <Button 
                  className="w-full"
                  onClick={() => setShowBookingModal(true)}
                >
                  Pilih Jadwal
                </Button>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Login untuk melakukan booking
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => router.push('/auth/login')}
                  >
                    Login
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Modal Booking */}
        <Modal 
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title="Form Booking"
        >
          {bookingError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {bookingError}
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-4">
            <Input
              label="Tanggal"
              type="date"
              value={bookingData.tanggal}
              onChange={(e) => setBookingData({ ...bookingData, tanggal: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            
            <Input
              label="Jam Mulai"
              type="time"
              value={bookingData.jam_mulai}
              onChange={(e) => setBookingData({ ...bookingData, jam_mulai: e.target.value })}
              required
            />
            
            <Input
              label="Jam Selesai"
              type="time"
              value={bookingData.jam_selesai}
              onChange={(e) => setBookingData({ ...bookingData, jam_selesai: e.target.value })}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan (Opsional)
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                rows={3}
                value={bookingData.catatan}
                onChange={(e) => setBookingData({ ...bookingData, catatan: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" isLoading={bookingLoading}>
              Buat Booking
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
