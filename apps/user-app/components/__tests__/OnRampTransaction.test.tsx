import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecentTransactions from '../OnRampTransaction';
import axios from 'axios';

jest.mock('axios');

describe('RecentTransactions', () => {
  const mockTransactions = {
    onRampTransactions: [
      {
        startTime: '2023-10-01T10:00:00.000Z',
        amount: 50000,
        status: 'Success',
        provider: 'Razorpay',
      },
      {
        startTime: '2023-10-02T10:00:00.000Z',
        amount: 100000,
        status: 'Processing',
        provider: 'HDFC',
      },
      {
        startTime: '2023-10-03T10:00:00.000Z',
        amount: 20000,
        status: 'Failure',
        provider: 'Stripe',
      },
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (axios.get as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves to keep it loading
    render(<RecentTransactions reload={false} />);
    expect(screen.getByText('[03] recent')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders empty state if no transactions', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { onRampTransactions: [] } });
    render(<RecentTransactions reload={false} />);

    await waitFor(() => {
      expect(screen.getByText('no recent transactions.')).toBeInTheDocument();
    });
  });

  it('fetches and renders transactions successfully', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockTransactions });
    render(<RecentTransactions reload={false} />);

    await waitFor(() => {
      expect(screen.getByText('added via Razorpay')).toBeInTheDocument();
      expect(screen.getByText('added via HDFC')).toBeInTheDocument();
      expect(screen.getByText('added via Stripe')).toBeInTheDocument();
      
      // Amount formatted (divided by 100)
      expect(screen.getByText('+₹500.00')).toBeInTheDocument();
      expect(screen.getByText('+₹1,000.00')).toBeInTheDocument();
      expect(screen.getByText('+₹200.00')).toBeInTheDocument();
    });
  });

  it('properly sorts transactions by timestamp descending', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockTransactions });
    const { container } = render(<RecentTransactions reload={false} />);

    await waitFor(() => {
      const providers = Array.from(container.querySelectorAll('.mono.text-sm')).map(el => el.textContent);
      // Expected order: latest first
      // Oct 3 (Stripe), Oct 2 (HDFC), Oct 1 (Razorpay)
      expect(providers).toEqual([
        'added via Stripe',
        'added via HDFC',
        'added via Razorpay'
      ]);
    });
  });

  it('handles api error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));
    
    render(<RecentTransactions reload={false} />);

    await waitFor(() => {
      expect(screen.getByText('no recent transactions.')).toBeInTheDocument();
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch transactions:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('refetches when reload prop changes', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { onRampTransactions: [] } });
    const { rerender } = render(<RecentTransactions reload={false} />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    rerender(<RecentTransactions reload={true} />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });
});
