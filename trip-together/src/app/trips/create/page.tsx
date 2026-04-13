"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StoredUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function CreateTripPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        if (!token || !rawUser) {
            router.replace("/login");
            return;
        }

        try {
            setCurrentUser(JSON.parse(rawUser));
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/login");
            return;
        }
        setCheckingAuth(false);
    }, [router]);

    const handleCreateTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!currentUser) {
            setMessage("Please login first");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    ownerId: currentUser.id,
                }),
            });

            const result = await res.json();
            if (!res.ok) {
                setMessage(result.message || "Failed to create trip");
                return;
            }

            setMessage("Trip created successfully");
            setTitle("");
            setDescription("");
        } catch {
            setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-6 text-slate-600 shadow-lg shadow-indigo-100/60">
                    Checking login...
                </div>
            </main>
        );
    }

    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60">
                <h1 className="text-2xl font-bold text-slate-900">Create Trip</h1>
                <p className="mt-2 mb-6 text-sm text-slate-700">
                    Logged in as <span className="font-medium">{currentUser?.name}</span>
                </p>

                <form onSubmit={handleCreateTrip} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-800">Trip Title</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Bangkok Cafe Trip"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-800">Description</label>
                        <textarea
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe this trip..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Trip"}
                    </button>
                </form>

                {message && <p className="mt-4 text-sm font-medium text-slate-800">{message}</p>}
            </div>
        </main>
    );
}
