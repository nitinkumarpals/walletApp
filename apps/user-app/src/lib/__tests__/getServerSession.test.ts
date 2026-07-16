import { getServerSession } from '../getServerSession';
import { cookies } from 'next/headers';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('getServerSession', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns null if no Authentication cookie is found', async () => {
    const mockCookieStore = {
      get: jest.fn().mockReturnValue(undefined),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    const session = await getServerSession();

    expect(session).toBeNull();
    expect(mockCookieStore.get).toHaveBeenCalledWith('Authentication');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns user data if fetch is successful', async () => {
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'mock-jwt-token' }),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    const mockUser = { id: '1', email: 'test@example.com' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const session = await getServerSession();

    expect(session).toEqual({ user: mockUser });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/user/me', {
      headers: {
        Cookie: 'Authentication=mock-jwt-token',
      },
      cache: 'no-store',
    });
  });

  it('returns null if fetch response is not ok', async () => {
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'mock-jwt-token' }),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const session = await getServerSession();

    expect(session).toBeNull();
  });

  it('returns null and logs error if fetch throws', async () => {
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'mock-jwt-token' }),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const session = await getServerSession();

    expect(session).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch session', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});
