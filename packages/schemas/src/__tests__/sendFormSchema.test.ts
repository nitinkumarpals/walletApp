import { describe, it, expect } from 'vitest';
import { sendFormSchema } from '../sendFormSchema';

describe('sendFormSchema', () => {
  it('should validate correctly with valid email and positive amount', () => {
    const result = sendFormSchema.safeParse({ email: 'test@example.com', amount: '100' });
    expect(result.success).toBe(true);
  });

  it('should invalidate if email is incorrect', () => {
    const result = sendFormSchema.safeParse({ email: 'testexample.com', amount: '100' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Invalid email address');
    }
  });

  it('should invalidate if amount is 0', () => {
    const result = sendFormSchema.safeParse({ email: 'test@example.com', amount: '0' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Amount must be a positive number');
    }
  });

  it('should invalidate if amount is negative', () => {
    const result = sendFormSchema.safeParse({ email: 'test@example.com', amount: '-50' });
    expect(result.success).toBe(false);
  });

  it('should invalidate if amount is not a number string', () => {
    const result = sendFormSchema.safeParse({ email: 'test@example.com', amount: 'abc' });
    expect(result.success).toBe(false);
  });

  it('should invalidate if required fields are missing', () => {
    const result = sendFormSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
