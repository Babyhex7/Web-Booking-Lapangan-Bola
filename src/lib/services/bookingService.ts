import { Booking, User, Lapangan } from '../models';
import { BookingAttributes } from '@/types';
import { Op } from 'sequelize';
import { format, parseISO } from 'date-fns';

export class BookingService {
  // Cek ketersediaan lapangan pada tanggal & jam tertentu
  static async checkAvailability(
    lapanganId: number,
    tanggal: string,
    jamMulai: string,
    jamSelesai: string,
    excludeBookingId?: number
  ) {
    try {
      // Cari booking yang overlap dengan waktu yang diminta
      const where: any = {
        lapangan_id: lapanganId,
        tanggal: tanggal,
        status: {
          [Op.in]: ['pending', 'confirmed'], 
        },
        [Op.or]: [
          // Case 1: Booking baru mulai di tengah booking existing
          {
            jam_mulai: { [Op.lte]: jamMulai },
            jam_selesai: { [Op.gt]: jamMulai },
          },
          // Case 2: Booking baru selesai di tengah booking existing
          {
            jam_mulai: { [Op.lt]: jamSelesai },
            jam_selesai: { [Op.gte]: jamSelesai },
          },
          // Case 3: Booking baru cover seluruh booking existing
          {
            jam_mulai: { [Op.gte]: jamMulai },
            jam_selesai: { [Op.lte]: jamSelesai },
          },
        ],
      };

      // Exclude booking tertentu (untuk update)
      if (excludeBookingId) {
        where.id = { [Op.ne]: excludeBookingId };
      }

      const conflictingBookings = await Booking.findAll({ where });

      return {
        available: conflictingBookings.length === 0,
        conflictingBookings: conflictingBookings.map(b => ({
          id: b.id,
          jam_mulai: b.jam_mulai,
          jam_selesai: b.jam_selesai,
        })),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Gagal cek ketersediaan');
    }
  }

  // Buat booking baru
  static async createBooking(data: Omit<BookingAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Validasi lapangan exists dan aktif
      const lapangan = await Lapangan.findByPk(data.lapangan_id);
      if (!lapangan) {
        throw new Error('Lapangan tidak ditemukan');
      }
      if (lapangan.status !== 'aktif') {
        throw new Error('Lapangan sedang tidak aktif');
      }

      // Cek ketersediaan
      const availability = await this.checkAvailability(
        data.lapangan_id,
        format(new Date(data.tanggal), 'yyyy-MM-dd'),
        data.jam_mulai,
        data.jam_selesai
      );

      if (!availability.available) {
        throw new Error('Jadwal sudah dibooking, silakan pilih waktu lain');
      }

      // Hitung total harga berdasarkan durasi
      const jamMulaiParts = data.jam_mulai.split(':');
      const jamSelesaiParts = data.jam_selesai.split(':');
      const durasiJam =
        parseInt(jamSelesaiParts[0]) * 60 +
        parseInt(jamSelesaiParts[1]) -
        (parseInt(jamMulaiParts[0]) * 60 + parseInt(jamMulaiParts[1]));
      const totalHarga = (durasiJam / 60) * parseFloat(lapangan.harga_per_jam.toString());

      // Buat booking
      const booking = await Booking.create({
        ...data,
        total_harga: totalHarga,
        status: 'pending',
      });

      // Return booking dengan relasi
      const bookingWithRelations = await Booking.findByPk(booking.id, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'nama', 'email', 'no_hp'] },
          { model: Lapangan, as: 'lapangan', attributes: ['id', 'nama', 'harga_per_jam'] },
        ],
      });

      return bookingWithRelations;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal membuat booking');
    }
  }

  // Ambil semua booking dengan filter
  static async getAllBookings(filters?: {
    userId?: number;
    lapanganId?: number;
    status?: string;
    tanggal?: string;
  }) {
    try {
      const where: any = {};

      if (filters?.userId) where.user_id = filters.userId;
      if (filters?.lapanganId) where.lapangan_id = filters.lapanganId;
      if (filters?.status) where.status = filters.status;
      if (filters?.tanggal) where.tanggal = filters.tanggal;

      const bookings = await Booking.findAll({
        where,
        include: [
          { model: User, as: 'user', attributes: ['id', 'nama', 'email', 'no_hp'] },
          { model: Lapangan, as: 'lapangan', attributes: ['id', 'nama', 'harga_per_jam'] },
        ],
        order: [['tanggal', 'DESC'], ['jam_mulai', 'DESC']],
      });

      return bookings;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal mengambil data booking');
    }
  }

  // Ambil detail booking by ID
  static async getBookingById(id: number) {
    try {
      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'nama', 'email', 'no_hp'] },
          { model: Lapangan, as: 'lapangan' },
        ],
      });

      if (!booking) {
        throw new Error('Booking tidak ditemukan');
      }

      return booking;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal mengambil detail booking');
    }
  }

  // Update booking
  static async updateBooking(id: number, data: Partial<BookingAttributes>) {
    try {
      const booking = await Booking.findByPk(id);

      if (!booking) {
        throw new Error('Booking tidak ditemukan');
      }

      await booking.update(data);

      // Return dengan relasi
      const updatedBooking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'nama', 'email', 'no_hp'] },
          { model: Lapangan, as: 'lapangan' },
        ],
      });

      return updatedBooking;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal mengupdate booking');
    }
  }

  // Cancel booking
  static async cancelBooking(id: number, userId: number, isAdmin: boolean = false) {
    try {
      const booking = await Booking.findByPk(id);

      if (!booking) {
        throw new Error('Booking tidak ditemukan');
      }

      // User hanya bisa cancel booking sendiri, admin bisa cancel semua
      if (!isAdmin && booking.user_id !== userId) {
        throw new Error('Anda tidak memiliki akses untuk membatalkan booking ini');
      }

      // Cek status, hanya bisa cancel jika pending atau confirmed
      if (!['pending', 'confirmed'].includes(booking.status)) {
        throw new Error('Booking tidak dapat dibatalkan');
      }

      await booking.update({ status: 'cancelled' });

      return booking;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal membatalkan booking');
    }
  }

  // Hapus booking (Admin only)
  static async deleteBooking(id: number) {
    try {
      const booking = await Booking.findByPk(id);

      if (!booking) {
        throw new Error('Booking tidak ditemukan');
      }

      await booking.destroy();
      return { message: 'Booking berhasil dihapus' };
    } catch (error: any) {
      throw new Error(error.message || 'Gagal menghapus booking');
    }
  }
}
