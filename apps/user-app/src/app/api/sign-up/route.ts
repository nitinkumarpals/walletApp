import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from "@repo/db/client";
export async function POST(request: Request) {
    try {
        const { name, email, password, number } = await request.json();
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