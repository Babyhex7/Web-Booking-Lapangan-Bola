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

// Script untuk migrate (sync) database
async function migrate() {
  try {
    console.log("Memulai migrasi database...");

    // Test koneksi terlebih dahulu
    await sequelize.authenticate();
    console.log("Koneksi database berhasil!");

    // Definisi model User
    const User = sequelize.define(
      "User",
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
          type: DataTypes.ENUM("user", "admin"),
          defaultValue: "user",
          allowNull: false,
        },
      },
      {
        tableName: "users",
        timestamps: true,
        underscored: true,
      }
    );

    // Definisi model Lapangan
    const Lapangan = sequelize.define(
      "Lapangan",
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
          type: DataTypes.ENUM("aktif", "nonaktif"),
          defaultValue: "aktif",
          allowNull: false,
        },
      },
      {
        tableName: "lapangan",
        timestamps: true,
        underscored: true,
      }
    );

    // Definisi model Booking
    const Booking = sequelize.define(
      "Booking",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        lapangan_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        },
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
        catatan: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        tableName: "bookings",
        timestamps: true,
        underscored: true,
      }
    );

    // Definisi relasi
    Booking.belongsTo(User, { foreignKey: "user_id" });
    Booking.belongsTo(Lapangan, { foreignKey: "lapangan_id" });
    User.hasMany(Booking, { foreignKey: "user_id" });
    Lapangan.hasMany(Booking, { foreignKey: "lapangan_id" });

    // Sync database (force: false agar tidak drop table existing)
    await sequelize.sync({ force: false });

    console.log("Migrasi database berhasil!");
    console.log("\nTabel yang dibuat:");
    console.log("- users");
    console.log("- lapangan");
    console.log("- bookings");

    process.exit(0);
  } catch (error) {
    console.error("Migrasi gagal:", error);
    process.exit(1);
  }
}

// Jalankan migrasi
migrate();
