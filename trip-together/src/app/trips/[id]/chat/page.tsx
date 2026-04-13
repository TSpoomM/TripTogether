"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StoredUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface TripDetail {
    id: string;
    ownerId: string;
    members?: {
        userId: string;
    }[];
}

export default function TripChatPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [tripId, setTripId] = useState("");
    const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
    const [trip, setTrip] = useState<TripDetail | null>(null);
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState<
        { id: string; text: string; createdAt: string; sender: { name: string } }[]
    >([]);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        params.then((p) => setTripId(p.id));

        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        if (!token || !rawUser) {
            router.replace("/login");
            return;
        }

        try {
            setCurrentUser(JSON.parse(rawUser));
            setCheckingAuth(false);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/login");
        }
    }, [params, router]);

    useEffect(() => {
        if (!tripId || !currentUser) {
            return;
        }

        const loadTrip = async () => {
            const res = await fetch(`/api/trips?userId=${encodeURIComponent(currentUser.id)}`, {
                cache: "no-store",
            });
            const result = await res.json();
            if (res.ok) {
                const foundTrip = (result.data ?? []).find((item: TripDetail) => item.id === tripId);
                setTrip(foundTrip || null);
            }
        };

        loadTrip();
    }, [tripId, currentUser]);

    const loadMessages = async () => {
        if (!tripId || !currentUser) {
            return;
        }
        const res = await fetch(`/api/trips/${tripId}/chat?userId=${encodeURIComponent(currentUser.id)}`, {
            cache: "no-store",
        });
        const raw = await res.text();
        const result = raw ? JSON.parse(raw) : null;
        if (res.ok) {
            setChatMessages(result.data ?? []);
            setMessage("");
            return;
        }
        setMessage(result?.message || "Failed to load chat messages");
    };

    useEffect(() => {
        loadMessages();
    }, [tripId, currentUser]);

    const isTripMember = Boolean(
        currentUser &&
            trip &&
            (trip.ownerId === currentUser.id ||
                trip.members?.some((member) => member.userId === currentUser.id))
    );

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !chatInput.trim()) {
            return;
        }

        fetch(`/api/trips/${tripId}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUser.id,
                text: chatInput.trim(),
            }),
        }).then(async (res) => {
            const raw = await res.text();
            const result = raw ? JSON.parse(raw) : null;
            if (!res.ok) {
                setMessage(result?.message || "Failed to send message");
                return;
            }
            setMessage("");
            loadMessages();
        });
        setChatInput("");
    };

    if (checkingAuth) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-6 text-slate-600 shadow-lg shadow-indigo-100/60">
                    Checking login...
                </div>
            </main>
        );
    }

    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60">
                <h1 className="text-2xl font-bold text-slate-900">Group Chat</h1>
                {!isTripMember ? (
                    <p className="mt-4 text-sm text-slate-700">Join this trip first to access group chat.</p>
                ) : (
                    <div className="mt-4">
                        {message && <p className="mb-3 text-sm font-medium text-rose-700">{message}</p>}
                        <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                            {chatMessages.length === 0 ? (
                                <p className="text-sm text-slate-500">No messages yet. Start the conversation.</p>
                            ) : (
                                chatMessages.map((item, index) => (
                                    <div
                                        key={item.id || `${item.createdAt}-${index}`}
                                        className={`flex ${item.sender.name === currentUser?.name ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${
                                                item.sender.name === currentUser?.name
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-white text-slate-800"
                                            }`}
                                        >
                                            <p
                                                className={`text-xs font-semibold ${
                                                    item.sender.name === currentUser?.name ? "text-indigo-100" : "text-slate-500"
                                                }`}
                                            >
                                                {item.sender.name === currentUser?.name ? "You" : item.sender.name}
                                            </p>
                                            <p className="text-sm">{item.text}</p>
                                            <p
                                                className={`mt-1 text-[11px] ${
                                                    item.sender.name === currentUser?.name ? "text-indigo-200" : "text-slate-400"
                                                }`}
                                            >
                                                {new Date(item.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Write a message..."
                                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
                            />
                            <button className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700">
                                Send
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
