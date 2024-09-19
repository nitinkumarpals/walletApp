import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import db from "@repo/db/client";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
const token = (Math.random() * 1000).toString();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "emailaddress@email.com",
          required: true,
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
          required: true,
        },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const user = await db.user.findFirst({
            where: {
              email: credentials.email as string,
            },
          });
          if (!user) {
            throw new Error("No user found with this email");
          } else if (user) {
            if (user.password === null) {
              throw new Error("User password is null");
            }
            const isValid = await bcryptjs.compare(
              credentials.password as string,
              user.password
            );
            if (!isValid) {
              throw new Error("Incorrect password");
            } else {
              return {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                number: user?.number,
              };
            }
          }
          return null;
        } catch (error) {
          if (error instanceof Error) {
            console.error("Authorization error:", error.message);
            throw new Error(error.message || "Authorization failed");
          } else {
            console.error("Unexpected error during authorization:", error);
            throw new Error("Authorization failed");
          }
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile): Promise<any> {
        try {
          const user = await db.user.findFirst({
            where: { email: profile.email },
          });

          if (user) {
            if (!user.googleId || !user.authType) {
              await db.user.update({
                where: { id: user.id },
                data: {
                  googleId: profile.sub,
                  authType: "Google",
                },
              });
            }
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              number: user?.number,
            };
          } else {
            const newUser = await db.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                googleId: profile.sub,
                authType: "Google",
                balance: {
                  create: {
                    amount: 0,
                    locked: 0,
                  },
                },
                onRampTransactions: {
                  create: {
                    startTime: new Date(),
                    status: "Success",
                    amount: 0,
                    token,
                    provider: "HDFC Bank",
                  },
                },
              },
            });
            return {
              id: newUser.id.toString(),
              name: newUser.name,
              email: newUser.email,
            };
          }
        } catch (error) {
          console.error("Error during Google login:", error);
          throw new Error("Failed to login with Google");
        }
      },
    }),
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
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        if (token.number) {
          session.user.number = token.number;
        }
      }

      return session;
    },
  },
};
