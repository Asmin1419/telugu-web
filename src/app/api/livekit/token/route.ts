import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
        console.error("Missing env vars:", { apiKey: !!apiKey, apiSecret: !!apiSecret, wsUrl: !!wsUrl });
        return NextResponse.json(
            { error: "Server misconfigured - missing env vars" },
            { status: 500 }
        );
    }

    const identity = `user-${Math.random().toString(36).slice(2, 9)}`;

    const token = new AccessToken(apiKey, apiSecret, {
        identity,
        ttl: "1h",
    });

    token.addGrant({
        roomJoin: true,
        room: "telugu-room",   // ← must match what agent.py uses
        canPublish: true,       // user can send mic audio
        canSubscribe: true,     // user can HEAR the agent ← critical
        canPublishData: true,
    });

    const jwt = await token.toJwt();

    console.log("Generated token for:", identity, "room: telugu-room");

    return NextResponse.json({
        token: jwt,
        url: wsUrl,
    });
}