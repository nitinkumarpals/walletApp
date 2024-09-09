import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from "@repo/db/client";
import { signupSchema } from "@repo/schemas/signupSchema";
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsedBody = signupSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json(
                { success: false, message: parsedBody.error.errors.map(e => e.message).join(", ") },
                { status: 400 }
            );
        }
        const { name, email, password, number } = parsedBody.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUserByUsername = await db.user.findFirst({
            where: {
                name
            }
        });
        if (existingUserByUsername) {
            return NextResponse.json(
                { success: false, message: "Username already exists" },
                { status: 400 }
            );
        }

        const existingUserByEmail = await db.user.findUnique({
            where: {
                email
            }
        });
        if (existingUserByEmail && existingUserByEmail.googleId && existingUserByEmail.password == null) {

            const user =await db.user.update({
                where: { id: existingUserByEmail.id },
                data: {
                    password: hashedPassword,
                    number: number
                }
            })
            return NextResponse.json(
                { success: true, message: "User Updated successfully", id: user.id.toString(), name: user.name, email: user.email, number: user?.number , googleId: user?.googleId }, { status: 200 }

            )

        }
        else if (existingUserByEmail) {

            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 400 }
            );
        }
        else {
            const user = await db.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    number: number
                }
            });

            return NextResponse.json(
                { success: true, message: "User created successfully", id: user.id.toString(), name: user.name, email: user.email, number: user?.number }, { status: 200 }
            )
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create user" },
            { status: 500 }
        );
    }
    finally {
        await db.$disconnect();
    }
}