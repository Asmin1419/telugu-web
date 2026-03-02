"use client"

import { useState } from "react"
import { Room } from "livekit-client"

export default function Home() {
  const [room, setRoom] = useState<Room | null>(null)
  const [connected, setConnected] = useState(false)
  const [status, setStatus] = useState("Disconnected")

  const connect = async () => {
    try {
      setStatus("Fetching token...")

      const res = await fetch("/api/livekit/token")

      if (!res.ok) {
        throw new Error("Token fetch failed")
      }

      const { token, url } = await res.json()

      setStatus("Connecting to LiveKit...")

      const newRoom = new Room()

      await newRoom.connect(url, token)

      await newRoom.localParticipant.enableCameraAndMicrophone()

      setRoom(newRoom)
      setConnected(true)
      setStatus("Connected 🎤 Talk now")

      console.log("✅ Connected successfully")
    } catch (err) {
      console.error(err)
      setStatus("Connection Failed ❌")
    }
  }

  const disconnect = async () => {
    if (room) {
      await room.disconnect()
      setRoom(null)
      setConnected(false)
      setStatus("Disconnected")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/20">

        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Telugu Bhavik 🎙️
        </h1>

        <p className="mb-6 text-gray-300">
          Your AI Telugu Voice Assistant powered by LiveKit & Sarvam
        </p>

        <div className="mb-6">
          <div className={`h-4 w-4 rounded-full mx-auto mb-2 ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <p className="text-sm">{status}</p>
        </div>

        {!connected ? (
          <button
            onClick={connect}
            className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded-xl font-semibold"
          >
            Connect & Talk
          </button>
        ) : (
          <button
            onClick={disconnect}
            className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded-xl font-semibold"
          >
            Disconnect
          </button>
        )}

      </div>
    </div>
  )
}