"use client";

import { useState, useCallback } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";

function AgentUI() {
  const { state: agentState, audioTrack } = useVoiceAssistant();
  const room = useRoomContext();

  const handleDisconnect = () => room.disconnect();

  const stateLabel: Record<string, string> = {
    disconnected: "Disconnected",
    connecting: "Connecting…",
    initializing: "Initializing…",
    listening: "🎤 Listening…",
    thinking: "🧠 Thinking…",
    speaking: "🔊 Speaking…",
  };

  return (
    <div className="agent-card">
      <h1 className="title">Telugu Bhavik 🎙️</h1>
      <p className="subtitle">Your AI Telugu Voice Assistant powered by LiveKit &amp; Sarvam</p>

      <div className="visualizer-wrap">
        <BarVisualizer
          state={agentState}
          trackRef={audioTrack}
          barCount={24}
          style={{ width: "100%", height: "64px" }}
        />
      </div>

      <div className="status-pill">
        <span className={`dot dot--${agentState}`} />
        {stateLabel[agentState] ?? agentState}
      </div>

      <button className="btn btn--red" onClick={handleDisconnect}>
        Disconnect
      </button>

      <RoomAudioRenderer />
    </div>
  );
}

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "fetching" | "connected" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const connect = useCallback(async () => {
    try {
      setStatus("fetching");
      setErrorMsg("");
      const res = await fetch("/api/livekit/token");
      if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
      const data = await res.json();
      if (!data.token || !data.url) throw new Error("Invalid token/URL from server");
      setToken(data.token);
      setWsUrl(data.url);
      setStatus("connected");
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }, []);

  const handleDisconnected = useCallback(() => {
    setToken(null);
    setWsUrl(null);
    setStatus("idle");
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Full-screen centered layout — applies always ── */
        html, body { height: 100%; }

        body {
          min-height: 100vh;
          background: radial-gradient(ellipse at 60% 0%, #1e0a3c 0%, #0d0d1a 60%);
          font-family: 'Segoe UI', system-ui, sans-serif;
          color: #f0e6ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* LiveKitRoom renders a div — make it fill and center too */
        [data-lk-theme] {
          width: 100% !important;
          min-height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: transparent !important;
        }

        .agent-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 28px;
          padding: 2.5rem 2rem;
          width: min(420px, 92vw);
          text-align: center;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .subtitle { color: #a78bbb; font-size: 0.9rem; line-height: 1.5; }

        .visualizer-wrap {
          background: rgba(0,0,0,0.25);
          border-radius: 16px;
          padding: 1rem;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 0.4rem 1rem;
          font-size: 0.82rem;
          font-weight: 500;
          align-self: center;
        }

        .dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #6b7280;
          flex-shrink: 0;
        }
        .dot--listening  { background: #22c55e; animation: pulse 1.2s infinite; }
        .dot--speaking   { background: #a855f7; animation: pulse 0.8s infinite; }
        .dot--thinking   { background: #f59e0b; animation: pulse 1s infinite; }
        .dot--connecting,
        .dot--initializing { background: #60a5fa; animation: pulse 1s infinite; }

        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.55; transform:scale(1.35); }
        }

        .btn {
          width: 100%;
          padding: 0.85rem 1.5rem;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.1s, filter 0.2s;
        }
        .btn:hover  { filter: brightness(1.15); }
        .btn:active { transform: scale(0.97); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn--purple { background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; }
        .btn--red    { background: linear-gradient(135deg, #dc2626, #ef4444); color: #fff; }

        .error-box {
          background: rgba(220,38,38,0.15);
          border: 1px solid rgba(220,38,38,0.4);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.82rem;
          color: #fca5a5;
        }

        .mic-ring {
          width: 72px; height: 72px;
          margin: 0.5rem auto;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed33, #a855f733);
          border: 2px solid rgba(168,85,247,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
        }
      `}</style>

      {status === "connected" && token && wsUrl ? (
        <LiveKitRoom
          token={token}
          serverUrl={wsUrl}
          connect={true}
          audio={true}
          video={false}
          onDisconnected={handleDisconnected}
        >
          <AgentUI />
        </LiveKitRoom>
      ) : (
        <div className="agent-card">
          <h1 className="title">Telugu Bhavik 🎙️</h1>
          <p className="subtitle">Your AI Telugu Voice Assistant powered by LiveKit &amp; Sarvam</p>

          <div className="mic-ring">🎤</div>

          {status === "error" && (
            <div className="error-box">⚠️ {errorMsg}</div>
          )}

          <button
            className="btn btn--purple"
            onClick={connect}
            disabled={status === "fetching"}
          >
            {status === "fetching" ? "Connecting…" : "Connect & Talk"}
          </button>
        </div>
      )}
    </>
  );
}