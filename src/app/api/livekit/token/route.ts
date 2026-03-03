import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function GET() {
    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        { identity: `user-${Math.random().toString(36).slice(2)}` }
    );

    token.addGrant({
        roomJoin: true,
        room: "telugu-room",   // ← must match what agent expects
        canPublish: true,
        canSubscribe: true,
    });

    return NextResponse.json({
        token: await token.toJwt(),
        url: process.env.LIVEKIT_URL,   // e.g. wss://asmin-9tp0nwl3.livekit.cloud
    });
}