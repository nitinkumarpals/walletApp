import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddMoney from '../AddMoneyCard';
import { useAuth } from '@/src/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

jest.mock('@/src/lib/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  ArrowRight: () => <div data-testid="arrow-right" />,
  Loader2: () => <div data-testid="loader-2" />
}));

jest.mock('axios');

describe('AddMoneyCard', () => {
  const mockToast = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 1 } });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (axios.post as jest.Mock).mockResolvedValue({ data: { order: { id: 'order_123' } }, status: 200 });

    // Razorpay script load will be triggered manually in the test where needed

    // Mock window.Razorpay
    (window as any).Razorpay = jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      open: jest.fn(),
    }));
  });

  it('renders correctly and loads chips', () => {
    render(<AddMoney refresh={mockRefresh} />);
    expect(screen.getAllByText(/add money/i).length).toBeGreaterThan(0);
    
    // Check chips
    expect(screen.getByText('₹500')).toBeInTheDocument();
    expect(screen.getByText('₹1,000')).toBeInTheDocument();
  });

  it('sets amount when a chip is clicked', () => {
    render(<AddMoney refresh={mockRefresh} />);
    
    const chip = screen.getByText('₹1,000');
    fireEvent.click(chip);
    
    const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;
    expect(input.value).toBe('1000');
  });

  it('shows error if amount is invalid', async () => {
    render(<AddMoney refresh={mockRefresh} />);
    
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '0' } });

    const submitButton = screen.getByRole('button', { name: /add money/i });
    fireEvent.click(submitButton); // Invalid amount (0)
    
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Invalid Amount',
      variant: 'destructive',
    }));
  });

  it('calls Razorpay flow on valid submit', async () => {
    render(<AddMoney refresh={mockRefresh} />);
    
    // Wait for razorpay script to be appended
    let script: HTMLElement | null = null;
    await waitFor(() => {
      script = document.getElementById('razorpay-script');
      expect(script).toBeInTheDocument();
    });

    // Manually trigger the onload event
    if (script) {
      fireEvent.load(script);
    }

    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '500' } });
    
    const submitButton = screen.getByRole('button', { name: /add money/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/onramp/razorpay', { amount: 50000 }, expect.any(Object));
      expect((window as any).Razorpay).toHaveBeenCalled();
    });
  });
  it('shows error if Razorpay script is not loaded', async () => {
    // Override the script onload so it's not loaded
    const script = document.getElementById('razorpay-script');
    if (script) document.body.removeChild(script);

    render(<AddMoney refresh={mockRefresh} />);

    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '500' } });
    
    const submitButton = screen.getByRole('button', { name: /add money/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Razorpay Not Loaded",
        variant: "destructive",
      }));
    });
  });

  it('handles Razorpay payment success handler', async () => {
    // Setup loaded state
    render(<AddMoney refresh={mockRefresh} />);
    const script = document.getElementById('razorpay-script');
    if (script) fireEvent.load(script);

    const mockRazorpayOpen = jest.fn();
    let handler: any;
    
    (window as any).Razorpay = jest.fn().mockImplementation((options) => {
      handler = options.handler;
      return { on: jest.fn(), open: mockRazorpayOpen };
    });

    // Mock webhook success
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { order: { id: 'order_123' } }, status: 200 })
                             .mockResolvedValueOnce({ status: 200 }); // Webhook call

    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '500' } });
    
    const submitButton = screen.getByRole('button', { name: /add money/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRazorpayOpen).toHaveBeenCalled();
    });

    // Trigger the handler
    await waitFor(async () => {
      await handler({
        razorpay_order_id: 'order_123',
        razorpay_payment_id: 'pay_123',
        razorpay_signature: 'sign_123',
      });
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8787/webhook', expect.any(Object));
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Payment Successful",
      }));
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles Razorpay payment failure and records failed transaction', async () => {
    render(<AddMoney refresh={mockRefresh} />);
    const script = document.getElementById('razorpay-script');
    if (script) fireEvent.load(script);

    let failHandler: any;
    const mockRazorpayOpen = jest.fn();
    
    (window as any).Razorpay = jest.fn().mockImplementation((options) => {
      return { 
        on: (event: string, cb: any) => {
          if (event === 'payment.failed') failHandler = cb;
        },
        open: mockRazorpayOpen 
      };
    });

    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '500' } });
    
    const submitButton = screen.getByRole('button', { name: /add money/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRazorpayOpen).toHaveBeenCalled();
    });

    // Trigger fail handler
    failHandler({
      error: { 
        description: 'Payment declined',
        metadata: { payment_id: 'pay_fail_123' }
      }
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Payment Failed",
        description: 'Payment declined',
      }));
      // Should call onramp create to record failure
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/onramp/create', expect.objectContaining({
        amount: 50000,
        provider: 'Razorpay',
        status: 'Failure'
      }), expect.any(Object));
    });
  });
});
