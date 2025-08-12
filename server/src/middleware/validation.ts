import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { UserRole } from '../types/index.js';

export const validateRequest = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {};

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        error.details.forEach(detail => {
          errors[detail.path.join('.')] = detail.message;
        });
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        error.details.forEach(detail => {
          errors[`query.${detail.path.join('.')}`] = detail.message;
        });
      }
    }

    // Validate route parameters
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        error.details.forEach(detail => {
          errors[`params.${detail.path.join('.')}`] = detail.message;
        });
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    role: Joi.string().valid(...Object.values(UserRole)).required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    dateOfBirth: Joi.date().max('now').optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    address: Joi.string().max(255).optional(),
  }),

  // User schemas
  updateProfile: Joi.object({
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    dateOfBirth: Joi.date().max('now').optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    address: Joi.string().max(255).optional(),
  }),

  // Appointment schemas
  createAppointment: Joi.object({
    doctorId: Joi.string().uuid().required(),
    title: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional(),
    date: Joi.date().min('now').required(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    duration: Joi.number().min(15).max(480).required(),
    type: Joi.string().valid(
      'consultation',
      'follow_up',
      'emergency',
      'routine_checkup',
      'vaccination',
      'telehealth'
    ).required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  }),

  // Medical record schemas
  createMedicalRecord: Joi.object({
    patientId: Joi.string().uuid().required(),
    title: Joi.string().min(1).max(100).required(),
    description: Joi.string().min(1).required(),
    diagnosis: Joi.string().max(500).optional(),
    treatment: Joi.string().max(1000).optional(),
    medications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        frequency: Joi.string().required(),
        duration: Joi.string().required(),
        instructions: Joi.string().optional(),
      })
    ).optional(),
    vitals: Joi.object({
      temperature: Joi.number().min(30).max(45).optional(),
      bloodPressure: Joi.object({
        systolic: Joi.number().min(70).max(250).required(),
        diastolic: Joi.number().min(40).max(150).required(),
      }).optional(),
      heartRate: Joi.number().min(30).max(200).optional(),
      respiratoryRate: Joi.number().min(8).max(60).optional(),
      oxygenSaturation: Joi.number().min(70).max(100).optional(),
      weight: Joi.number().min(1).max(500).optional(),
      height: Joi.number().min(50).max(250).optional(),
    }).optional(),
  }),

  // Chat schemas
  sendMessage: Joi.object({
    message: Joi.string().min(1).max(1000).required(),
    conversationId: Joi.string().uuid().optional(),
  }),

  // Emergency request schemas
  createEmergencyRequest: Joi.object({
    location: Joi.object({
      address: Joi.string().required(),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
      }).required(),
    }).required(),
    description: Joi.string().min(1).max(1000).required(),
    symptoms: Joi.array().items(Joi.string()).optional(),
    urgencyLevel: Joi.string().valid('medium', 'high', 'critical').required(),
  }),

  // Query schemas
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().max(100).optional(),
  }),

  // ID parameter schema
  id: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};