import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SQLite database connection
const dbPath = path.join(__dirname, '../../database.sqlite');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
export const initializeDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'nurse', 'admin')),
          phone TEXT,
          date_of_birth TEXT,
          gender TEXT CHECK (gender IN ('male', 'female', 'other')),
          address TEXT,
          profile_image TEXT,
          is_active BOOLEAN DEFAULT 1,
          is_email_verified BOOLEAN DEFAULT 0,
          email_verification_token TEXT,
          password_reset_token TEXT,
          password_reset_expires TEXT,
          last_login TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert demo users
      const demoUsers = [
        ['550e8400-e29b-41d4-a716-446655440001', 'admin@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYhf0zKlQC2OfzO', 'Admin', 'User', 'admin', '+1-555-0101', '1980-01-01', 'other', 1, 1],
        ['550e8400-e29b-41d4-a716-446655440002', 'doctor@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYhf0zKlQC2OfzO', 'Dr. Sarah', 'Johnson', 'doctor', '+1-555-0102', '1975-05-15', 'female', 1, 1],
        ['550e8400-e29b-41d4-a716-446655440003', 'nurse@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYhf0zKlQC2OfzO', 'Nurse', 'Mary', 'nurse', '+1-555-0103', '1985-08-22', 'female', 1, 1],
        ['550e8400-e29b-41d4-a716-446655440004', 'patient@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYhf0zKlQC2OfzO', 'John', 'Doe', 'patient', '+1-555-0104', '1990-12-10', 'male', 1, 1]
      ];

      const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users (id, email, password, first_name, last_name, role, phone, date_of_birth, gender, is_active, is_email_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      demoUsers.forEach(user => {
        insertUser.run(user);
      });

      insertUser.finalize();

      console.log('Database initialized with demo data');
      resolve();
    });
  });
};

// Query helper function
export const query = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve({ rows });
      }
    });
  });
};

export default db;