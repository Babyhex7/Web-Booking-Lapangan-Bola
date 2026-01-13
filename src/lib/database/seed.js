const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ path: ".env.local" });

// Konfigurasi database
const sequelize = new Sequelize(
  process.env.DB_NAME || "booking_lapangan_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: "mysql",
    logging: false,
  }
);

// Script untuk seed data awal ke database
async function seed() {
  try {
    console.log("Memulai seeding data...");

    // Test koneksi
    await sequelize.authenticate();
    console.log("Koneksi database berhasil!");

    // Definisi model User (harus sama dengan migrate.js)
    const User = sequelize.define(
      "User",
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        nama: { type: DataTypes.STRING(100), allowNull: false },
        password: { type: DataTypes.STRING(255), allowNull: false },
        no_hp: { type: DataTypes.STRING(20), allowNull: false },
        role: {
          type: DataTypes.ENUM("user", "admin"),
          defaultValue: "user",
          allowNull: false,
        },
      },
      { tableName: "users", timestamps: true, underscored: true }
    );

    // Definisi model Lapangan
    const Lapangan = sequelize.define(
      "Lapangan",
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nama: { type: DataTypes.STRING(100), allowNull: false },
        deskripsi: { type: DataTypes.TEXT, allowNull: true },
        harga_per_jam: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        foto_url: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
        fasilitas: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
        status: {
          type: DataTypes.ENUM("aktif", "nonaktif"),
          defaultValue: "aktif",
          allowNull: false,
        },
      },
      { tableName: "lapangan", timestamps: true, underscored: true }
    );

    // Definisi model Booking
    const Booking = sequelize.define(
      "Booking",
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        lapangan_id: { type: DataTypes.INTEGER, allowNull: false },
        tanggal: { type: DataTypes.DATEONLY, allowNull: false },
        jam_mulai: { type: DataTypes.TIME, allowNull: false },
        jam_selesai: { type: DataTypes.TIME, allowNull: false },
        total_harga: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: {
          type: DataTypes.ENUM(
            "pending",
            "confirmed",
            "cancelled",
            "completed"
          ),
          defaultValue: "pending",
          allowNull: false,
        },
        catatan: { type: DataTypes.TEXT, allowNull: true },
      },
      { tableName: "bookings", timestamps: true, underscored: true }
    );

    // Seed Users
    console.log("\nMembuat users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await User.create({
      email: "admin@lapangan.com",
      nama: "Admin Lapangan",
      password: hashedPassword,
      no_hp: "081234567890",
      role: "admin",
    });

    const user1 = await User.create({
      email: "user@example.com",
      nama: "John Doe",
      password: hashedPassword,
      no_hp: "081234567891",
      role: "user",
    });

    console.log("Users berhasil dibuat!");

    // Seed Lapangan
    console.log("\nMembuat lapangan...");

    const lapangan1 = await Lapangan.create({
      nama: "Lapangan Futsal A",
      deskripsi:
        "Lapangan futsal standar FIFA dengan rumput sintetis berkualitas",
      harga_per_jam: 150000,
      foto_url: [
        "https://example.com/lapangan-a-1.jpg",
        "https://example.com/lapangan-a-2.jpg",
      ],
      fasilitas: [
        "Rumput Sintetis",
        "Lampu Standar FIFA",
        "Toilet",
        "Parkir Luas",
        "Kantin",
      ],
      status: "aktif",
    });

    const lapangan2 = await Lapangan.create({
      nama: "Lapangan Futsal B",
      deskripsi: "Lapangan futsal indoor dengan AC",
      harga_per_jam: 200000,
      foto_url: ["https://example.com/lapangan-b-1.jpg"],
      fasilitas: ["Indoor", "AC", "Toilet", "Parkir", "Sound System"],
      status: "aktif",
    });

    const lapangan3 = await Lapangan.create({
      nama: "Lapangan Mini Soccer",
      deskripsi: "Lapangan mini soccer outdoor 7 vs 7",
      harga_per_jam: 100000,
      foto_url: [],
      fasilitas: ["Outdoor", "Rumput Alami", "Toilet", "Parkir"],
      status: "aktif",
    });

    console.log("Lapangan berhasil dibuat!");

    // Seed Bookings (contoh)
    console.log("\nMembuat booking sample...");

    const booking1 = await Booking.create({
      user_id: user1.id,
      lapangan_id: lapangan1.id,
      tanggal: new Date("2026-01-20"),
      jam_mulai: "09:00",
      jam_selesai: "11:00",
      total_harga: 300000,
      status: "confirmed",
      catatan: "Booking untuk latihan tim",
    });

    const booking2 = await Booking.create({
      user_id: user1.id,
      lapangan_id: lapangan2.id,
      tanggal: new Date("2026-01-25"),
      jam_mulai: "14:00",
      jam_selesai: "16:00",
      total_harga: 400000,
      status: "pending",
    });

    console.log("Booking berhasil dibuat!");

    console.log("\nSeeding selesai!");
    console.log("\nSummary:");
    console.log(`- ${2} users dibuat (1 admin, 1 user)`);
    console.log(`- ${3} lapangan dibuat`);
    console.log(`- ${2} booking sample dibuat`);
    console.log("\nLogin credentials:");
    console.log("Admin: admin@lapangan.com / password123");
    console.log("User: user@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding gagal:", error);
    process.exit(1);
  }
}

// Jalankan seeding
seed();
