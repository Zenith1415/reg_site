import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateTeamId, verifyRecaptcha } from '../utils/helpers.js';
import { sendConfirmationEmail } from '../services/email.js';
import { TeamRegistration, TeamMember } from '../types/index.js';
import Team from '../models/Team.js';
import { isConnected } from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `id-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.'));
    }
  },
});

// In-memory fallback storage (used when MongoDB is not connected)
const inMemoryRegistrations: Map<string, TeamRegistration> = new Map();

// Register a new team
router.post('/register', upload.single('idCard'), async (req: Request, res: Response) => {
  try {
    const { teamName, teamLeaderName, teamLeaderEmail, teamMembers, recaptchaToken } = req.body;

    // Validate required fields
    if (!teamName || !teamLeaderName || !teamLeaderEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: teamName, teamLeaderName, teamLeaderEmail',
      });
    }

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({
        success: false,
        error: 'reCAPTCHA verification failed. Please try again.',
      });
    }

    // Parse team members
    let parsedMembers: TeamMember[] = [];
    try {
      parsedMembers = JSON.parse(teamMembers || '[]');
    } catch {
      parsedMembers = [];
    }

    // Generate unique team ID
    const teamId = generateTeamId();
    const createdAt = new Date();

    // Create registration data
    const registrationData = {
      teamId,
      teamName,
      teamLeaderName,
      teamLeaderEmail,
      teamMembers: parsedMembers,
      idCardPath: req.file?.filename || null,
      idCardVerified: !!req.file,
      recaptchaVerified: true,
      status: 'pending' as const,
    };

    let savedTeam;

    // Save to MongoDB if connected, otherwise use in-memory storage
    if (isConnected()) {
      const team = new Team(registrationData);
      savedTeam = await team.save();
      console.log(`✅ Team saved to MongoDB: ${teamId}`);
    } else {
      // Fallback to in-memory storage
      const registration: TeamRegistration = {
        ...registrationData,
        createdAt: createdAt.toISOString(),
      };
      inMemoryRegistrations.set(teamId, registration);
      savedTeam = registration;
      console.log(`⚠️ Team saved to memory (MongoDB not connected): ${teamId}`);
    }

    // Send confirmation email
    const emailData: TeamRegistration = {
      teamId,
      teamName,
      teamLeaderName,
      teamLeaderEmail,
      teamMembers: parsedMembers,
      idCardPath: req.file?.filename || null,
      idCardVerified: !!req.file,
      createdAt: createdAt.toISOString(),
    };

    try {
      await sendConfirmationEmail(emailData);
      console.log(`✅ Confirmation email sent to ${teamLeaderEmail}`);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        teamId,
        teamName,
        teamLeaderName,
        teamLeaderEmail,
        teamMembers: parsedMembers,
        createdAt: createdAt.toISOString(),
      },
      message: 'Team registered successfully! A confirmation email has been sent.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register team. Please try again.',
    });
  }
});

// Verify reCAPTCHA endpoint
router.post('/verify-recaptcha', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Missing reCAPTCHA token',
      });
    }

    const isValid = await verifyRecaptcha(token);
    
    res.json({
      success: true,
      data: { verified: isValid },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to verify reCAPTCHA',
    });
  }
});

// Get team by ID
router.get('/team/:teamId', async (req: Request, res: Response) => {
  const { teamId } = req.params;

  try {
    let registration;

    // Try MongoDB first if connected
    if (isConnected()) {
      registration = await Team.findOne({ teamId }).lean();
    }

    // Fallback to in-memory storage
    if (!registration) {
      registration = inMemoryRegistrations.get(teamId);
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    res.json({
      success: true,
      data: {
        teamId: registration.teamId,
        teamName: registration.teamName,
        teamLeaderName: registration.teamLeaderName,
        teamLeaderEmail: registration.teamLeaderEmail,
        teamMembers: registration.teamMembers,
        createdAt: registration.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch team data',
    });
  }
});

export default router;
