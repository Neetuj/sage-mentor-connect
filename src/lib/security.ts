import DOMPurify from 'dompurify';
import { z } from 'zod';

// Input sanitization utilities
export const sanitizeString = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

// Rate limiting for client-side (basic implementation)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export const checkRateLimit = (key: string, maxRequests: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const current = rateLimitMap.get(key);
  
  if (!current || now - current.lastReset > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
};

// Validation schemas
export const applicationFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters'),
  school: z.string()
    .min(2, 'School name must be at least 2 characters')
    .max(100, 'School name must be less than 100 characters'),
  gradeLevel: z.string()
    .min(1, 'Grade level is required')
    .max(20, 'Grade level must be less than 20 characters'),
  interests: z.string()
    .min(10, 'Please provide more details about your interests')
    .max(500, 'Interests must be less than 500 characters'),
  additionalInfo: z.string()
    .max(1000, 'Additional information must be less than 1000 characters')
    .optional(),
  parentEmail: z.string()
    .email('Invalid parent email format')
    .max(100, 'Parent email must be less than 100 characters')
    .optional()
});

export const searchSchema = z.object({
  query: z.string()
    .max(100, 'Search query too long')
    .regex(/^[a-zA-Z0-9\s\-_.,!?]*$/, 'Search contains invalid characters')
});

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
});

// Security error messages (non-revealing)
export const SECURITY_ERROR_MESSAGES = {
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  INVALID_INPUT: 'Invalid input provided. Please check your data.',
  SUBMISSION_FAILED: 'Submission failed. Please try again.',
  UNAUTHORIZED_ACCESS: 'Access denied.',
  GENERAL_ERROR: 'An error occurred. Please try again.'
} as const;