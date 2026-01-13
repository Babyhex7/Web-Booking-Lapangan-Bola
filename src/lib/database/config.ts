import { Sequelize } from 'sequelize';

// Konfigurasi database dari environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME || 'booking_lapangan_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+07:00', // Zona waktu Indonesia (WIB)
  }
);

// Test koneksi database
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil!');
    return true;
  } catch (error) {
    console.error('Koneksi database gagal:', error);
    return false;
  }
};

// Sync semua models ke database
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force }); // force: true akan drop table dan buat ulang
    console.log('Sinkronisasi database berhasil!');
  } catch (error) {
    console.error('Sinkronisasi database gagal:', error);
    throw error;
  }
};

export default sequelize;
