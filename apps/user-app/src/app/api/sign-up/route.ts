import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@repo/db/client";
import { signupSchema } from "@repo/schemas/signupSchema";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = signupSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsedBody.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { name, email, password, number } = parsedBody.data;
    const token = crypto.randomBytes(16).toString("hex"); // Secure token

    const hashedPassword = await bcrypt.hash(password, 10);

    // Combined validation query for name, email, and number
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ name }, { email }, { number }],
      },
    });

    if (existingUser) {
      if (existingUser.name === name) {
        return NextResponse.json(
          { success: false, message: "Username already exists" },
          { status: 400 }
        );
      }
      if (existingUser.email === email) {
        if (existingUser.googleId && !existingUser.password) {
          const user = await db.user.update({
            where: { id: existingUser.id },
            data: {
              password: hashedPassword,
              number: number,
            },
          });
          return NextResponse.json(
            {
              success: true,
              message: "User updated successfully",
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              number: user?.number,
              googleId: user?.googleId,
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { success: false, message: "Email already exists" },
            { status: 400 }
          );
        }
      }
      if (existingUser.number === number) {
        return NextResponse.json(
          { success: false, message: "Number already exists" },
          { status: 400 }
        );
      }
    }

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        number: number,
        balance: {
          create: {
            amount: 5999900,
            locked: 0,
          },
        },
        onRampTransactions: {
          create: {
            startTime: new Date(),
            status: "Success",
            amount: 5999900,
            token,
            provider: "HDFC Bank",
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        number: user?.number,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 }
    );
  }
}
