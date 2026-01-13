'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { lapanganAPI } from '@/lib/api/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Interface untuk Lapangan
interface Lapangan {
  id: number;
  nama: string;
  deskripsi: string;
  harga_per_jam: number;
  fasilitas: string[];
  status: string;
}

// Page untuk list lapangan
export default function LapanganPage() {
  const router = useRouter();
  const [lapangan, setLapangan] = useState<Lapangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchNama, setSearchNama] = useState('');

  useEffect(() => {
    loadLapangan();
  }, []);

  const loadLapangan = async () => {
    try {
      const response = await lapanganAPI.getAll({ status: 'aktif' });
      setLapangan(response.data);
    } catch (error) {
      console.error('Error loading lapangan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await lapanganAPI.getAll({ 
        status: 'aktif',
        nama: searchNama 
      });
      setLapangan(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Lapangan Tersedia</h1>

        {/* Search */}
        <div className="mb-6 flex gap-2">
          <Input
            placeholder="Cari lapangan..."
            value={searchNama}
            onChange={(e) => setSearchNama(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>Cari</Button>
        </div>

        {/* List Lapangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lapangan.map((item) => (
            <Card 
              key={item.id}
              onClick={() => router.push(`/lapangan/${item.id}`)}
            >
              <h3 className="text-xl font-semibold mb-2">{item.nama}</h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{item.deskripsi}</p>
              
              <div className="mb-3">
                <p className="text-2xl font-bold text-blue-600">
                  {formatRupiah(item.harga_per_jam)}
                  <span className="text-sm text-gray-500">/jam</span>
                </p>
              </div>

              {/* Fasilitas */}
              <div className="flex flex-wrap gap-2">
                {item.fasilitas.slice(0, 3).map((fasilitas, idx) => (
                  <span 
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {fasilitas}
                  </span>
                ))}
                {item.fasilitas.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{item.fasilitas.length - 3} lainnya
                  </span>
                )}
              </div>

              <Button className="w-full mt-4" size="sm">
                Lihat Detail & Booking
              </Button>
            </Card>
          ))}
        </div>

        {lapangan.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada lapangan tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}
