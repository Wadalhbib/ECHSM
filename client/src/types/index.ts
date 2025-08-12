export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  ADMIN = 'admin'
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  type: AppointmentType;
  aiRecommendation?: AIRecommendation;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: User;
  doctor?: User;
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum AppointmentPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  ROUTINE_CHECKUP = 'routine_checkup',
  VACCINATION = 'vaccination',
  TELEHEALTH = 'telehealth'
}

export interface AIRecommendation {
  confidence: number;
  reasoning: string;
  suggestedTime: string;
  urgencyScore: number;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  medications?: Medication[];
  vitals?: VitalSigns;
  attachments?: string[];
  isEncrypted: boolean;
  createdAt: string;
  updatedAt: string;
  doctor?: User;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface VitalSigns {
  temperature?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    symptoms?: string[];
    assessment?: SymptomAssessment;
  };
}

export interface SymptomAssessment {
  possibleConditions: Array<{
    condition: string;
    confidence: number;
    description: string;
  }>;
  recommendedActions: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  disclaimer: string;
}

export interface MobileClinic {
  id: string;
  name: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  schedule: ClinicSchedule[];
  services: string[];
  capacity: number;
  currentLoad: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicSchedule {
  date: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
  bookedSlots: number;
}

export interface EmergencyRequest {
  id: string;
  patientId: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  description: string;
  urgencyLevel: 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'en_route' | 'on_scene' | 'completed' | 'cancelled';
  assignedUnit?: string;
  estimatedArrival?: string;
  createdAt: string;
  updatedAt: string;
  patient?: User;
}

export interface Analytics {
  totalPatients: number;
  totalAppointments: number;
  totalDoctors: number;
  appointmentTrends: {
    date: string;
    count: number;
  }[];
  patientDemographics: {
    ageGroup: string;
    count: number;
  }[];
  diseaseOutbreakAlerts: {
    condition: string;
    cases: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    riskLevel: 'low' | 'medium' | 'high';
  }[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}