'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Page untuk edit profile user
export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    // Set initial form data dari user context
    setFormData({
      nama: user.nama,
      no_hp: user.no_hp,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userAPI.updateProfile(formData);
      setSuccess('Profile berhasil diupdate!');
      // Reload user data
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Update profile gagal');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Kembali
        </Button>

        <Card>
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Info Tidak Bisa Diubah */}
          <div className="mb-6 pb-6 border-b space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-700">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-700 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Form Edit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              required
            />

            <Input
              label="Nomor HP"
              type="tel"
              value={formData.no_hp}
              onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
              required
            />

            <div className="flex gap-2">
              <Button type="submit" isLoading={loading}>
                Simpan Perubahan
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
