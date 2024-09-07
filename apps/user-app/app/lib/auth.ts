import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from "bcryptjs";
import db from "@repo/db/client";
import { NextAuthOptions } from 'next-auth';
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email", placeholder: "emailaddress@email.com" },
                password: { label: "password", type: "password", placeholder: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                try {
                    const user = await db.user.findFirst({
                        where: {
                            email: credentials.email as string
                        }
                    });
                    if (!user) {
                        throw new Error('No user found with this email');
                    }
                    else if (user) {
                        const isValid = await bcryptjs.compare(credentials.password as string, user.password);
                        if (!isValid) {
                            throw new Error('Incorrect password');
                        }
                        return {
                            id: user.id.toString(),
                            name: user.name,
                            email: user.email
                        }
                    }
                    return null;
                } catch (error) {
                    if (error instanceof Error) {
                        console.error('Authorization error:', error.message);
                        throw new Error(error.message || 'Authorization failed');
                    } else {
                        console.error('Unexpected error during authorization:', error);
                        throw new Error('Authorization failed');
                    }
                }
            },
        })
    ],
    secret: process.env.AUTH_SECRET || "secret",
    // pages: {
    //     signIn: '/sign-in'
    // },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }: any) {
            session.user.id = token.id as string
            return session
        },
    },

}
