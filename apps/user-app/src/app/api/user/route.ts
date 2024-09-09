import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
export const GET = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('Not logged in');
        }
        return NextResponse.json({
            user : session.user
        })
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 401 }
        );
    }
}
