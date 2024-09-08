import 'next-auth';

declare module 'next-auth' {
    interface User {
        number?: string;
        id: string;
        name: string;
        email: string;
    }
    interface Session {
        user: User;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        number?: string;
    }
}