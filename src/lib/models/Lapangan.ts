import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/config';
import { LapanganAttributes } from '@/types';

// Model Lapangan dengan Sequelize
class Lapangan extends Model<LapanganAttributes> implements LapanganAttributes {
  public id!: number;
  public nama!: string;
  public deskripsi!: string;
  public harga_per_jam!: number;
  public foto_url!: string[];
  public fasilitas!: string[];
  public status!: 'aktif' | 'nonaktif';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definisi tabel Lapangan
Lapangan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    harga_per_jam: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, 
      },
    },
    foto_url: {
      type: DataTypes.JSON, 
      allowNull: true,
      defaultValue: [],
    },
    fasilitas: {
      type: DataTypes.JSON, 
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('aktif', 'nonaktif'),
      defaultValue: 'aktif',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'lapangan',
    timestamps: true,
    underscored: true,
  }
);

export default Lapangan;
