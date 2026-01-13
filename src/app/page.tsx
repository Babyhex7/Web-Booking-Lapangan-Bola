'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// Homepage dengan hero section & features
export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Booking Lapangan Bola
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistem pemesanan lapangan bola online yang mudah dan cepat
        </p>
        
        <div className="flex justify-center gap-4">
          <Link href="/lapangan">
            <Button size="lg">Lihat Lapangan</Button>
          </Link>
          {!user && (
            <Link href="/auth/register">
              <Button variant="outline" size="lg">Daftar Sekarang</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Kenapa Pilih Kami?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Booking Cepat</h3>
            <p className="text-gray-600">
              Proses booking mudah dan cepat hanya dalam beberapa klik
            </p>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Harga Transparan</h3>
            <p className="text-gray-600">
              Harga yang jelas tanpa biaya tersembunyi
            </p>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Kelola Booking</h3>
            <p className="text-gray-600">
              Kelola dan lihat riwayat booking dengan mudah
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap untuk Booking Lapangan?
          </h2>
          <p className="text-xl mb-8">
            Daftar sekarang dan mulai booking lapangan favoritmu
          </p>
          <Link href={user ? '/lapangan' : '/auth/register'}>
            <Button size="lg" variant="secondary">
              {user ? 'Lihat Lapangan' : 'Daftar Gratis'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
