import { Lapangan } from '../models';
import { LapanganAttributes } from '@/types';
import { Op } from 'sequelize';

export class LapanganService {
  // Ambil semua lapangan dengan filter
  static async getAllLapangan(filters?: {
    status?: 'aktif' | 'nonaktif';
    nama?: string;
  }) {
    try {
      const where: any = {};

      // Filter berdasarkan status
      if (filters?.status) {
        where.status = filters.status;
      }

      // Filter berdasarkan nama (search)
      if (filters?.nama) {
        where.nama = {
          [Op.like]: `%${filters.nama}%`, // Case-insensitive search
        };
      }

      const lapangan = await Lapangan.findAll({
        where,
        order: [['createdAt', 'DESC']], // Urutkan dari yang terbaru
      });

      return lapangan;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal mengambil data lapangan');
    }
  }

  // Ambil detail lapangan by ID
  static async getLapanganById(id: number) {
    try {
      const lapangan = await Lapangan.findByPk(id);

      if (!lapangan) {
        throw new Error('Lapangan tidak ditemukan');
      }

      return lapangan;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal mengambil detail lapangan');
    }
  }

  // Buat lapangan baru (Admin only)
  static async createLapangan(data: Omit<LapanganAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const lapangan = await Lapangan.create(data);
      return lapangan;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal membuat lapangan');
    }
  }

  // Update lapangan (Admin only)
  static async updateLapangan(id: number, data: Partial<LapanganAttributes>) {
    try {
      const lapangan = await Lapangan.findByPk(id);

      if (!lapangan) {
        throw new Error('Lapangan tidak ditemukan');
      }

      await lapangan.update(data);
      return lapangan;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal mengupdate lapangan');
    }
  }

  // Hapus lapangan (Admin only)
  static async deleteLapangan(id: number) {
    try {
      const lapangan = await Lapangan.findByPk(id);

      if (!lapangan) {
        throw new Error('Lapangan tidak ditemukan');
      }

      await lapangan.destroy();
      return { message: 'Lapangan berhasil dihapus' };
    } catch (error: any) {
      throw new Error(error.message || 'Gagal menghapus lapangan');
    }
  }

  // Toggle status lapangan (aktif/nonaktif)
  static async toggleStatus(id: number) {
    try {
      const lapangan = await Lapangan.findByPk(id);

      if (!lapangan) {
        throw new Error('Lapangan tidak ditemukan');
      }

      const newStatus = lapangan.status === 'aktif' ? 'nonaktif' : 'aktif';
      await lapangan.update({ status: newStatus });

      return lapangan;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal mengubah status lapangan');
    }
  }
}
