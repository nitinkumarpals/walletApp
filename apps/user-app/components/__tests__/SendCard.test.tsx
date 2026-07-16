import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SendCard } from '../SendCard';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('axios');

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('SendCard', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('renders the form correctly', () => {
    render(<SendCard />);
    expect(screen.getByText('Send Money')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('shows success toast on successful transfer', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { message: 'Transfer successful' } });

    render(<SendCard />);
    
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '500' } });
    
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/transfer/p2p', {
        email: 'test@example.com',
        amount: 50000,
      }, expect.any(Object));
      
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Transfer successful',
      });
    });
  });

  it('shows error toast on server known error', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { message: 'Error: Insufficient balance' } });

    render(<SendCard />);
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Error: Insufficient balance',
        variant: 'destructive',
      });
    });
  });

  it('shows error toast on unexpected server response', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { message: 'Something went wrong on server' } });

    render(<SendCard />);
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Unexpected Error',
        description: 'Something went wrong on server',
        variant: 'destructive',
      });
    });
  });

  it('shows error toast on catch block error with response data', async () => {
    (axios.post as jest.Mock).mockRejectedValue({ response: { data: { message: 'User not found' } } });

    render(<SendCard />);
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'User not found',
        variant: 'destructive',
      });
    });
  });

  it('shows generic error toast on catch block error without response', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<SendCard />);
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to send money. Please try again.',
        variant: 'destructive',
      });
    });
  });

  it('resets form when cancel button is clicked', async () => {
    render(<SendCard />);
    
    const emailInput = screen.getByPlaceholderText('name@example.com') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    await waitFor(() => {
      expect(emailInput.value).toBe('');
    });
  });
});
