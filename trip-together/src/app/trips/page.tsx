"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface StoredUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function TripsPage() {
    const router = useRouter();
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
            const parsedUser: StoredUser = JSON.parse(rawUser);
            setCurrentUser(parsedUser);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/login");
            return;
        }
        setCheckingAuth(false);
    }, [router]);

    if (checkingAuth) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-6 text-slate-600 shadow-lg shadow-indigo-100/60">
                    Checking login...
                </div>
            </main>
        );
    }

    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Trips</h1>
                    <p className="mt-2 text-slate-700">
                        Choose what you want to do next.
                    </p>
                </div>

                <p className="mb-6 text-sm text-slate-700">
                    Logged in as <span className="font-medium">{currentUser?.name}</span>
                </p>
                <div className="grid gap-5 md:grid-cols-3">
                    <Link
                        href="/trips/create"
                        className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60 transition hover:-translate-y-0.5 hover:border-indigo-200"
                    >
                        <h2 className="text-xl font-semibold text-slate-900">Create Trip</h2>
                        <p className="mt-2 text-sm text-slate-700">
                            Start a new group trip and generate invite code.
                        </p>
                    </Link>
                    <Link
                        href="/trips/join"
                        className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60 transition hover:-translate-y-0.5 hover:border-sky-200"
                    >
                        <h2 className="text-xl font-semibold text-slate-900">Join Trip</h2>
                        <p className="mt-2 text-sm text-slate-700">
                            Enter invite code to join an existing trip.
                        </p>
                    </Link>
                    <Link
                        href="/trips/list"
                        className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60 transition hover:-translate-y-0.5 hover:border-violet-200"
                    >
                        <h2 className="text-xl font-semibold text-slate-900">Trip List</h2>
                        <p className="mt-2 text-sm text-slate-700">
                            Browse all trips you own or joined.
                        </p>
                    </Link>
                </div>
            </div>
        </main>
    );
}