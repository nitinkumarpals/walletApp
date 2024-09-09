import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from "bcryptjs";
import db from "@repo/db/client";
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email", placeholder: "emailaddress@email.com", required: true },
                password: { label: "password", type: "password", placeholder: "password", required: true },
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
                        else {
                            return {
                                id: user.id.toString(),
                                name: user.name,
                                email: user.email,
                                number: user?.number
                            }
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
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret: process.env.AUTH_SECRET || "secret",
    // pages: {
    //     signIn: '/auth/sign-in'
    // },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;

                if (user.number) {
                    token.number = user.number;
                }
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                if (token.number) {
                    session.user.number = token.number
                }
            }

            return session
        },
    },

}
