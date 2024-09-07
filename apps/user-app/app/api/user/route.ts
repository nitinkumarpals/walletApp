import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({
            error: "Unauthorized"
        }, {
            status: 403
        })
    }
    return NextResponse.json({
        user : session.user
    })
}