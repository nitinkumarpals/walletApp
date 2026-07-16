import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientForm from '../ClientForm';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('axios');

describe('ClientForm', () => {
  const mockToast = jest.fn();
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, refresh: mockRefresh });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders login form by default', () => {
    render(<ClientForm />);
    expect(screen.getByText('welcome back.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText('no account yet?')).toBeInTheDocument();
  });

  it('toggles to sign up form', () => {
    render(<ClientForm />);
    const toggleButton = screen.getByRole('button', { name: /sign up →/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText("let's get you set up.")).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone \(optional\)/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    render(<ClientForm />);
    
    // Fill the email and password
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/auth/login', {
        email: 'test@example.com',
        password: 'pw'
      }, { withCredentials: true });
      expect(mockToast).toHaveBeenCalledWith({ title: 'Success', description: 'Login Successful' });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles failed login', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Login failed'));

    render(<ClientForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login Failed',
        description: 'Incorrect email or password',
        variant: 'destructive',
      });
    });
  });

  it('handles successful signup', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    render(<ClientForm />);
    
    // Toggle to signup
    fireEvent.click(screen.getByRole('button', { name: /sign up →/i }));

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/auth/sign-up', {
        name: 'John',
        email: 'test@example.com',
        password: 'pw',
        number: undefined
      }, { withCredentials: true });
      expect(mockToast).toHaveBeenCalledWith({ title: 'Success', description: 'Signup successful' });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles failed signup', async () => {
    (axios.isAxiosError as unknown as jest.Mock) = jest.fn().mockReturnValue(true);
    (axios.post as jest.Mock).mockRejectedValue({ response: { data: { message: 'Email already exists' } } });

    render(<ClientForm />);
    
    // Toggle to signup
    fireEvent.click(screen.getByRole('button', { name: /sign up →/i }));

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Email already exists',
        variant: 'destructive',
      });
    });
  });
});
