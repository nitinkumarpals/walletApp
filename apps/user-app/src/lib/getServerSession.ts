import { cookies } from 'next/headers';

export const getServerSession = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('Authentication')?.value;

    if (!token) return null;

    const res = await fetch('http://localhost:3001/user/me', {
      headers: {
        Cookie: `Authentication=${token}`,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return { user: data.user };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch session', error);
    return null;
  }
};
