export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  ADMIN = 'admin'
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  type: AppointmentType;
  aiRecommendation?: AIRecommendation;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
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
  factors: string[];
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  title: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  medications?: Medication[];
  vitals?: VitalSigns;
  attachments?: string[];
  isEncrypted: boolean;
  encryptionKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  prescribedBy: string;
  prescribedAt: Date;
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
  bmi?: number;
  recordedAt: Date;
  recordedBy: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  isActive: boolean;
  metadata?: {
    symptoms?: string[];
    assessment?: SymptomAssessment;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    symptoms?: string[];
    assessment?: SymptomAssessment;
    confidence?: number;
  };
  createdAt: Date;
}

export interface SymptomAssessment {
  possibleConditions: Array<{
    condition: string;
    confidence: number;
    description: string;
    icd10Code?: string;
  }>;
  recommendedActions: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  disclaimer: string;
  shouldSeekCare: boolean;
  timeframe?: string;
}

export interface MobileClinic {
  id: string;
  name: string;
  description?: string;
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
  staff: string[];
  equipment: string[];
  isActive: boolean;
  contactInfo: {
    phone?: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicSchedule {
  date: Date;
  startTime: string;
  endTime: string;
  availableSlots: number;
  bookedSlots: number;
  services: string[];
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
  symptoms?: string[];
  urgencyLevel: 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'en_route' | 'on_scene' | 'completed' | 'cancelled';
  assignedUnit?: string;
  assignedPersonnel?: string[];
  estimatedArrival?: Date;
  actualArrival?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemAuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}