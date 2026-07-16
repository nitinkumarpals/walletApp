import { describe, it, expect } from 'vitest';
import { signupSchema } from '../signUpSchema';

describe('signupSchema', () => {
  it('should validate correct signup data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      number: '1234567890'
    };
    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should require minimum password length', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'short',
      number: '1234567890'
    };
    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject missing name or email', () => {
    const invalidData = {
      password: 'password123',
    };
    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
  
  it('should accept missing number since it is optional', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
