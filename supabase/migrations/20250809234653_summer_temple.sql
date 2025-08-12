-- AI-Enabled Community Health Services Management System Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_type AS ENUM ('consultation', 'follow_up', 'emergency', 'routine_checkup', 'vaccination', 'telehealth');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE emergency_urgency AS ENUM ('medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE emergency_status AS ENUM ('pending', 'assigned', 'en_route', 'on_scene', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL DEFAULT 30, -- in minutes
    status appointment_status DEFAULT 'scheduled',
    priority appointment_priority DEFAULT 'medium',
    type appointment_type NOT NULL,
    ai_recommendation JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    medications JSONB,
    vitals JSONB,
    attachments TEXT[],
    is_encrypted BOOLEAN DEFAULT false,
    encryption_key VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) DEFAULT 'Health Consultation',
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Mobile clinics table
CREATE TABLE IF NOT EXISTS mobile_clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location JSONB NOT NULL, -- {address, coordinates: {lat, lng}}
    schedule JSONB, -- Array of schedule objects
    services TEXT[] NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 20,
    current_load INTEGER DEFAULT 0,
    staff UUID[], -- Array of user IDs
    equipment TEXT[],
    is_active BOOLEAN DEFAULT true,
    contact_info JSONB, -- {phone, email}
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Emergency requests table
CREATE TABLE IF NOT EXISTS emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location JSONB NOT NULL, -- {address, coordinates: {lat, lng}}
    description TEXT NOT NULL,
    symptoms TEXT[],
    urgency_level emergency_urgency NOT NULL,
    status emergency_status DEFAULT 'pending',
    assigned_unit VARCHAR(100),
    assigned_personnel UUID[], -- Array of user IDs
    estimated_arrival TIMESTAMP,
    actual_arrival TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- System audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor ON medical_records(doctor_id);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_emergency_requests_patient ON emergency_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_status ON emergency_requests(status);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_urgency ON emergency_requests(urgency_level);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON chat_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mobile_clinics_updated_at BEFORE UPDATE ON mobile_clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_requests_updated_at BEFORE UPDATE ON emergency_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo users (passwords are hashed for 'demo123')
INSERT INTO users (id, email, password, first_name, last_name, role, phone, date_of_birth, gender, is_active, is_email_verified) 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'admin@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYhf0zKlQC2OfzO', 'Admin', 'User', 'admin', '+1-555-0101', '1980-01-01', 'other', true, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'doctor@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYhf0zKlQC2OfzO', 'Dr. Sarah', 'Johnson', 'doctor', '+1-555-0102', '1975-05-15', 'female', true, true),
    ('550e8400-e29b-41d4-a716-446655440003', 'nurse@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYhf0zKlQC2OfzO', 'Nurse', 'Mary', 'nurse', '+1-555-0103', '1985-08-22', 'female', true, true),
    ('550e8400-e29b-41d4-a716-446655440004', 'patient@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYhf0zKlQC2OfzO', 'John', 'Doe', 'patient', '+1-555-0104', '1990-12-10', 'male', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert demo appointments
INSERT INTO appointments (patient_id, doctor_id, title, description, appointment_date, start_time, end_time, duration, status, priority, type)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Annual Checkup', 'Routine annual health examination', CURRENT_DATE + INTERVAL '7 days', '09:00', '09:30', 30, 'scheduled', 'medium', 'routine_checkup'),
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Follow-up Visit', 'Follow-up for previous consultation', CURRENT_DATE + INTERVAL '14 days', '14:00', '14:30', 30, 'confirmed', 'medium', 'follow_up')
ON CONFLICT DO NOTHING;

-- Insert demo mobile clinic
INSERT INTO mobile_clinics (name, description, location, services, capacity, is_active, contact_info)
VALUES (
    'Downtown Mobile Health Unit',
    'Comprehensive healthcare services for urban communities',
    '{"address": "Downtown Community Center, Main St", "coordinates": {"lat": 40.7128, "lng": -74.0060}}',
    ARRAY['General Consultation', 'Vaccinations', 'Health Screening', 'Basic Diagnostics'],
    25,
    true,
    '{"phone": "+1-555-0200", "email": "downtown@mobileclinic.com"}'
) ON CONFLICT DO NOTHING;

-- Create a function to seed more demo data
CREATE OR REPLACE FUNCTION seed_demo_data()
RETURNS void AS $$
BEGIN
    -- Add more demo users if needed
    INSERT INTO users (email, password, first_name, last_name, role, phone, is_active, is_email_verified)
    SELECT 
        'patient' || i || '@demo.com',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYhf0zKlQC2OfzO',
        'Patient',
        'User' || i,
        'patient',
        '+1-555-01' || LPAD(i::text, 2, '0'),
        true,
        true
    FROM generate_series(10, 20) AS i
    ON CONFLICT (email) DO NOTHING;
    
    RAISE NOTICE 'Demo data seeded successfully';
END;
$$ LANGUAGE plpgsql;

-- Uncomment the following line to add more demo users
-- SELECT seed_demo_data();

COMMIT;