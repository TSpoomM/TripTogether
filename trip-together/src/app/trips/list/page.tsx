"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Trip {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    ownerId: string;
    inviteCode: string;
    owner?: {
        name?: string;
        email?: string;
    };
    members?: {
        userId: string;
    }[];
}

interface StoredUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function TripListPage() {
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
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

    const loadTrips = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/trips", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token ?? ""}`,
                },
                cache: "no-store",
            });
            const result = await res.json();
            if (res.ok) {
                setTrips(result.data ?? []);
                return;
            }
            setMessage(result.message || "Failed to load trips");
        } catch {
            setMessage("Failed to load trips");
        }
    };

    useEffect(() => {
        if (!currentUser) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/login");
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadTrips();
    }, [router, currentUser]);

    const handleJoin = async (inviteCode: string) => {
        if (!currentUser) {
            return;
        }

        setMessage("");
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
        loadTrips();
    };

    const handleDelete = async (tripId: string) => {
        if (!currentUser) {
            return;
        }
        const token = localStorage.getItem("token");
        const res = await fetch("/api/trips/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token ?? ""}`,
            },
            body: JSON.stringify({
                tripId,
            }),
        });
        const result = await res.json();
        if (!res.ok) {
            setMessage(result.message || "Failed to delete trip");
            return;
        }
        setMessage("Trip deleted successfully");
        loadTrips();
    };

    const handleLeave = async (tripId: string) => {
        if (!currentUser) {
            return;
        }
        const token = localStorage.getItem("token");
        const res = await fetch("/api/trips/leave", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token ?? ""}`,
            },
            body: JSON.stringify({
                tripId,
            }),
        });
        const result = await res.json();
        if (!res.ok) {
            setMessage(result.message || "Failed to leave trip");
            return;
        }
        setMessage("Left trip successfully");
        loadTrips();
    };

    if (!currentUser) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-6 text-slate-600 shadow-lg shadow-indigo-100/60">
                    Redirecting to login...
                </div>
            </main>
        );
    }

    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60">
                <h1 className="text-2xl font-bold text-slate-900">Trip List</h1>
                <p className="mt-2 text-sm text-slate-700">All trips that you own or joined.</p>

                {message && <p className="mt-4 text-sm font-medium text-rose-700">{message}</p>}

                <div className="mt-6 grid gap-4">
                    {trips.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-500">
                            No trips found
                        </div>
                    ) : (
                        trips.map((trip) => (
                            <div key={trip.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                                <h3 className="text-lg font-semibold text-slate-900">{trip.title}</h3>
                                <p className="mt-1 text-slate-600">{trip.description || "No description"}</p>
                                <div className="mt-3 text-sm text-slate-700">
                                    <p>Status: {trip.status}</p>
                                    <p>Owner: {trip.owner?.name || "-"}</p>
                                    <p>Participants: {trip.members?.length ?? 0}</p>
                                </div>
                                <div className="mt-4 mb-4 flex flex-wrap gap-2">
                                    <Link
                                        href={`/trips/${trip.id}`}
                                        className="inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                    >
                                        View Trip
                                    </Link>
                                    {currentUser &&
                                        trip.status === "OPEN" &&
                                        trip.ownerId !== currentUser.id &&
                                        !trip.members?.some((member) => member.userId === currentUser.id) && (
                                            <button
                                                type="button"
                                                onClick={() => handleJoin(trip.inviteCode)}
                                                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                                            >
                                                Join
                                            </button>
                                        )}
                                    {currentUser && trip.ownerId === currentUser.id && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(trip.id)}
                                            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    {currentUser &&
                                        trip.ownerId !== currentUser.id &&
                                        trip.members?.some((member) => member.userId === currentUser.id) && (
                                            <button
                                                type="button"
                                                onClick={() => handleLeave(trip.id)}
                                                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                            >
                                                Leave
                                            </button>
                                        )}
                                </div>
                                <p className="text-sm text-slate-700">Invite Code: {trip.inviteCode}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
