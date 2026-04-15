"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StoredUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function JoinTripPage() {
    const router = useRouter();
    const [inviteCode, setInviteCode] = useState("");
    const [message, setMessage] = useState("");
    const [currentUser] = useState<StoredUser | null>(() => {
        if (typeof window === "undefined") {
            return null;
        }
        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        if (!token || !rawUser) {
            return null;
        }
        try {
            return JSON.parse(rawUser);
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (!currentUser) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/login");
        }
    }, [router, currentUser]);

    const handleJoinTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!currentUser) {
            setMessage("Please login first");
            return;
        }

        const token = localStorage.getItem("token");
        const res = await fetch("/api/trips/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token ?? ""}`,
            },
            body: JSON.stringify({
                inviteCode,
            }),
        });

        const result = await res.json();
        if (!res.ok) {
            setMessage(result.message || "Failed to join trip");
            return;
        }

        setMessage("Joined trip successfully");
        setInviteCode("");
    };

    if (!currentUser) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-6 text-slate-600 shadow-lg shadow-indigo-100/60">
                    Redirecting to login...
                </div>
            </main>
        );
    }

    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60">
                <h1 className="text-2xl font-bold text-slate-900">Join Trip</h1>
                <p className="mt-2 mb-6 text-sm text-slate-700">
                    Logged in as <span className="font-medium">{currentUser?.name}</span>
                </p>

                <form onSubmit={handleJoinTrip} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter invite code"
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                    />
                    <button className="rounded-xl bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-700">
                        Join
                    </button>
                </form>

                {message && <p className="mt-4 text-sm font-medium text-slate-800">{message}</p>}
            </div>
        </main>
    );
}
