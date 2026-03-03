import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET() {
    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;

    const at = new AccessToken(apiKey, apiSecret, {
        identity: "user-" + Math.floor(Math.random() * 100000), // Unique user identity
    });

    at.addGrant({
        roomJoin: true,
        room: "telugu-room",  // Room name (ensure this matches in the frontend)
        agent: true,  // Allow the agent to join
    });

    // Debug log to confirm token and URL
    console.log("Generated token and URL:", at.toJwt(), process.env.LIVEKIT_URL);

    return NextResponse.json({
        token: await at.toJwt(),
        url: process.env.LIVEKIT_URL,  // Make sure the URL is returned
    });
}