import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/config';
import { UserAttributes } from '@/types';

// Model User dengan Sequelize
class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public nama!: string;
  public password!: string;
  public no_hp!: string;
  public role!: 'user' | 'admin';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definisi tabel User
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validasi format email
      },
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    no_hp: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true, // Otomatis tambah createdAt & updatedAt
    underscored: true, // Gunakan snake_case untuk nama kolom
  }
);

export default User;
