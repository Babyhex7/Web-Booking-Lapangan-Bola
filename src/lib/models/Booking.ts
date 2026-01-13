import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/config';
import { BookingAttributes } from '@/types';
import User from './User';
import Lapangan from './Lapangan';

// Model Booking dengan Sequelize
class Booking extends Model<BookingAttributes> implements BookingAttributes {
  public id!: number;
  public user_id!: number;
  public lapangan_id!: number;
  public tanggal!: Date;
  public jam_mulai!: string;
  public jam_selesai!: string;
  public total_harga!: number;
  public status!: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  public catatan?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definisi tabel Booking
Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE', // Hapus booking jika user dihapus
    },
    lapangan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lapangan',
        key: 'id',
      },
      onDelete: 'CASCADE', // Hapus booking jika lapangan dihapus
    },
    tanggal: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
    },
    jam_mulai: {
      type: DataTypes.TIME, 
      allowNull: false,
    },
    jam_selesai: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    total_harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending',
      allowNull: false,
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        // Index untuk query cepat berdasarkan tanggal & lapangan
        fields: ['lapangan_id', 'tanggal', 'status'],
      },
    ],
  }
);

// Definisi relasi antar model
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Booking.belongsTo(Lapangan, { foreignKey: 'lapangan_id', as: 'lapangan' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Lapangan.hasMany(Booking, { foreignKey: 'lapangan_id', as: 'bookings' });

export default Booking;
