import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { config } from '../config/env.js';
import { UserRole, AuthTokens, JWTPayload } from '../types/index.js';

const generateTokens = (payload: JWTPayload): AuthTokens => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      dateOfBirth,
      gender,
      address,
    } = req.body;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    // Create user
    await query(
      `INSERT INTO users (
        id, email, password, first_name, last_name, role, phone,
        date_of_birth, gender, address, is_active, is_email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        email.toLowerCase(),
        hashedPassword,
        firstName,
        lastName,
        role,
        phone,
        dateOfBirth,
        gender,
        address,
        1,
        1, // For demo purposes, skip email verification
      ]
    );

    // Get the created user
    const userResult = await query(
      'SELECT id, email, first_name, last_name, role, phone, date_of_birth, gender, address, is_active, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = userResult.rows[0];

    // Generate tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Log successful registration
    console.log(`New user registered: ${user.email} as ${user.role}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          phone: user.phone,
          dateOfBirth: user.date_of_birth,
          gender: user.gender,
          address: user.address,
          isActive: user.is_active,
          createdAt: user.created_at,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userResult = await query(
      `SELECT id, email, password, first_name, last_name, role, phone,
              date_of_birth, gender, address, is_active, is_email_verified, created_at
       FROM users WHERE email = ?`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Update last login
    await query(
      'UPDATE users SET last_login = datetime("now") WHERE id = ?',
      [user.id]
    );

    // Log successful login
    console.log(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          phone: user.phone,
          dateOfBirth: user.date_of_birth,
          gender: user.gender,
          address: user.address,
          isActive: user.is_active,
          createdAt: user.created_at,
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;
      
      // Verify user still exists and is active
      const userResult = await query(
        'SELECT id, email, role, is_active FROM users WHERE id = ?',
        [decoded.id]
      );

      if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        });
      }

      const user = userResult.rows[0];

      // Generate new tokens
      const tokens = generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just return success
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const userResult = await query(
      'SELECT id FROM users WHERE email = ? AND is_active = 1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    }

    // Generate reset token (in real app, send email)
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    await query(
      'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
      [resetToken, resetExpires, userResult.rows[0].id]
    );

    // In a real application, send email here
    console.log(`Password reset requested for: ${email}`);
    console.log(`Reset token: ${resetToken}`);

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const userResult = await query(
      'SELECT id FROM users WHERE email_verification_token = ?',
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token',
      });
    }

    await query(
      'UPDATE users SET is_email_verified = 1, email_verification_token = NULL WHERE id = ?',
      [userResult.rows[0].id]
    );

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
    });
  }
};