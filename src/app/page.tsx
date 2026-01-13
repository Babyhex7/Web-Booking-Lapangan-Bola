export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏟️ Sistem Booking Lapangan Bola
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Backend API sudah siap digunakan!
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">API Endpoints:</h2>
          <div className="text-left space-y-2 text-sm">
            <p><strong>Auth:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>POST /api/auth/register - Daftar user baru</li>
              <li>POST /api/auth/login - Login user</li>
              <li>POST /api/auth/logout - Logout user</li>
              <li>GET /api/auth/me - Get user profile</li>
            </ul>
            <p><strong>Lapangan:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>GET /api/lapangan - List semua lapangan</li>
              <li>POST /api/lapangan - Buat lapangan (Admin)</li>
              <li>GET /api/lapangan/[id] - Detail lapangan</li>
              <li>PUT /api/lapangan/[id] - Update lapangan (Admin)</li>
              <li>DELETE /api/lapangan/[id] - Hapus lapangan (Admin)</li>
            </ul>
            <p><strong>Booking:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>GET /api/booking - List booking</li>
              <li>POST /api/booking - Buat booking</li>
              <li>GET /api/booking/[id] - Detail booking</li>
              <li>PUT /api/booking/[id] - Update booking (Admin)</li>
              <li>DELETE /api/booking/[id] - Hapus booking (Admin)</li>
              <li>POST /api/booking/cancel - Cancel booking</li>
              <li>POST /api/booking/check-availability - Cek ketersediaan</li>
            </ul>
            <p><strong>User:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>GET /api/user/profile - Get profile</li>
              <li>PUT /api/user/profile - Update profile</li>
              <li>GET /api/user/history - Riwayat booking</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>Dokumentasi lengkap ada di README.md</p>
        </div>
      </div>
    </div>
  )
}
