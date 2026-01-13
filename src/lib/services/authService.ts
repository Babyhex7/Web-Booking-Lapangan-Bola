import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { UserAttributes, JWTPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthService {
  // Register user baru
  static async register(data: {
    email: string;
    nama: string;
    password: string;
    no_hp: string;
    role?: 'user' | 'admin';
  }) {
    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('Email sudah terdaftar');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Buat user baru
      const user = await User.create({
        ...data,
        password: hashedPassword,
        role: data.role || 'user',
      });

      // Generate JWT token
      const token = this.generateToken({
        userId: user.id!,
        email: user.email,
        role: user.role,
      });

      // Return user tanpa password
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        nama: user.nama,
        no_hp: user.no_hp,
        role: user.role,
        createdAt: user.createdAt,
      };

      return { user: userWithoutPassword, token };
    } catch (error: any) {
      throw new Error(error.message || 'Gagal melakukan registrasi');
    }
  }

  // Login user
  static async login(email: string, password: string) {
    try {
      // Cari user berdasarkan email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Email atau password salah');
      }

      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email atau password salah');
      }

      // Generate JWT token
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Return user tanpa password
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        nama: user.nama,
        no_hp: user.no_hp,
        role: user.role,
        createdAt: user.createdAt,
      };

      return { user: userWithoutPassword, token };
    } catch (error: any) {
      throw new Error(error.message || 'Gagal melakukan login');
    }
  }

  // Generate JWT token
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  // Verify JWT token
  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Token tidak valid atau sudah expired');
    }
  }

  // Get user by ID (tanpa password)
  static async getUserById(userId: number) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }, // Exclude password dari result
      });

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Gagal mengambil data user');
    }
  }
}
