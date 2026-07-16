import { describe, it, expect } from 'vitest';
import { webHookSchema } from '../hdfcWebHookSchema';

describe('webHookSchema', () => {
  it('should validate correctly formatted data', () => {
    const validData = {
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_123',
      razorpay_signature: 'signature_123',
      user_identifier: '1',
      amount: '50000'
    };

    const result = webHookSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
        expect(result.data).toEqual(validData);
    }
  });

  it('should reject data missing required fields', () => {
    const invalidData = {
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_123',
      // Missing razorpay_signature, user_identifier, amount
    };

    const result = webHookSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject data with incorrect types', () => {
    const invalidData = {
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_123',
      razorpay_signature: 'signature_123',
      user_identifier: 1, // should be string
      amount: 50000 // should be string
    };

    const result = webHookSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
