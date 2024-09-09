import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from "@repo/db/client";
import { z } from 'zod';
const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    number: z.string().optional()
});
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

        const existingUserByEmail = await db.user.findFirst({
            where: {
                email
            }
        });

        if (existingUserByEmail) {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
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