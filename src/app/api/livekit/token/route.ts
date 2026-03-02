import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET() {
    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;

    const at = new AccessToken(apiKey, apiSecret, {
        identity: "user-" + Math.floor(Math.random() * 100000),
    });

    at.addGrant({
        roomJoin: true,
        room: "telugu-room",
        agent: true, // 🔥 THIS IS THE IMPORTANT LINE
    });

    return NextResponse.json({
        token: await at.toJwt(),
    });
}