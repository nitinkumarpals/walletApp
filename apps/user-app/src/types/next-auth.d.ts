import "next-auth";

declare module "next-auth" {
  interface User {
    number?: string;
    id: string;
    name: string;
    email: string;
    googleId?: string;
  }
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  // eslint-disable-next-line no-unused-vars
  interface JWT {
    number?: string;
    googleId?: string;
  }
}

