import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hmacSha256 } from '../index';
import app from '../index';
import { Hono } from 'hono';

// Mock getPrisma to prevent actual DB connections during unit tests
vi.mock('@repo/db/accelerate', () => ({
  getPrisma: vi.fn().mockReturnValue({
    $transaction: vi.fn().mockResolvedValue([]),
    balance: {
      update: vi.fn(),
    },
    onRampTransaction: {
      update: vi.fn(),
    }
  }),
}));

describe('Webhook Worker', () => {
  describe('hmacSha256', () => {
    it('should correctly hash data', async () => {
      const secret = 'nVTBPjxuiUL6loKUO0G3yLM9';
      const data = 'order_123|pay_123';
      const hash = await hmacSha256(secret, data);
      
      // Expected length of hex string for sha256 is 64
      expect(hash).toHaveLength(64);
      expect(typeof hash).toBe('string');
    });

    it('should throw error for empty key', async () => {
      await expect(hmacSha256('', 'data')).rejects.toThrow('HMAC key must not be empty');
    });
  });

  describe('POST /webhook', () => {
    const MOCK_ENV = {
      DATABASE_URL: 'mock-db-url',
      RAZORPAY_KEY_SECRET: 'test-secret',
    };

    it('should return 400 for invalid schema', async () => {
      const req = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' }),
      });
      
      const res = await app.fetch(req, MOCK_ENV);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Invalid data' });
    });

    it('should return 400 for invalid signature', async () => {
      const payload = {
        razorpay_order_id: 'order_123',
        razorpay_payment_id: 'pay_123',
        razorpay_signature: 'wrong-signature',
        user_identifier: '1',
        amount: '500'
      };

      const req = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await app.fetch(req, MOCK_ENV);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Transaction is not legit' });
    });

    it('should return 200 for valid signature', async () => {
      // First compute a valid signature
      const data = 'order_valid|pay_valid';
      const validSignature = await hmacSha256(MOCK_ENV.RAZORPAY_KEY_SECRET, data);

      const payload = {
        razorpay_order_id: 'order_valid',
        razorpay_payment_id: 'pay_valid',
        razorpay_signature: validSignature,
        user_identifier: '1',
        amount: '500'
      };

      const req = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await app.fetch(req, MOCK_ENV);
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ message: 'Captured' });
    });

    it('should return 500 on internal server error', async () => {
      // Temporarily override the mock to throw an error
      const { getPrisma } = await import('@repo/db/accelerate');
      (getPrisma as any).mockReturnValueOnce({
        $transaction: vi.fn().mockRejectedValue(new Error('DB Error')),
        balance: { update: vi.fn() },
        onRampTransaction: { update: vi.fn() }
      });

      const data = 'order_error|pay_error';
      const validSignature = await hmacSha256(MOCK_ENV.RAZORPAY_KEY_SECRET, data);

      const payload = {
        razorpay_order_id: 'order_error',
        razorpay_payment_id: 'pay_error',
        razorpay_signature: validSignature,
        user_identifier: '1',
        amount: '500'
      };

      const req = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await app.fetch(req, MOCK_ENV);
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'DB Error' });
    });
  });
});
