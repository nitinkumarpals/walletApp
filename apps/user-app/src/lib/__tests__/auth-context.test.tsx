import React, { useEffect } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../auth-context';

describe('AuthContext', () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('fetches user on mount and sets user state', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const TestComponent = () => {
      const { user, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return <div>{user ? user.name : 'No User'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/user/me', { credentials: 'include' });
  });

  it('handles error when fetching user', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const TestComponent = () => {
      const { user, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return <div>{user ? user.name : 'No User'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No User')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user session', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('allows manual login to update user state', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: null }),
    });

    const TestComponent = () => {
      const { user, login } = useAuth();
      return (
        <div>
          <div>{user ? user.name : 'No User'}</div>
          <button onClick={() => login({ id: '2', email: 'new@example.com', name: 'New User' })}>
            Login
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Login'));

    expect(screen.getByText('New User')).toBeInTheDocument();
  });

  it('logout function calls API, clears user and redirects', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    const TestComponent = () => {
      const { user, logout } = useAuth();
      return (
        <div>
          <div>{user ? user.name : 'No User'}</div>
          <button onClick={logout}>Logout</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/auth/logout', { method: 'POST', credentials: 'include' });
      expect(screen.getByText('No User')).toBeInTheDocument();
    });
  });

  it('handles logout error', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      })
      .mockRejectedValueOnce(new Error('Logout failed'));
      
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const TestComponent = () => {
      const { logout } = useAuth();
      return <button onClick={logout}>Logout</button>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Logout failed', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('throws error if useAuth is used outside AuthProvider', () => {
    // Suppress the expected error from React
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestComponent = () => {
      useAuth();
      return <div>test</div>;
    };

    expect(() => render(<TestComponent />)).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
