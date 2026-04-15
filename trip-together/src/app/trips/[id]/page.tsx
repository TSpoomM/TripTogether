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

interface Destination {
    id: string;
    placeName: string;
    description?: string | null;
    estimatedBudget?: number | null;
    category?: string | null;
    proposedBy?: {
        name?: string;
    };
    votes?: {
        id: string;
        score: number;
    }[];
}

interface TripSummary {
    tripId: string;
    totalDestinations: number;
    topDestination: {
        id: string;
        placeName: string;
        averageScore: number;
        totalVotes: number;
    } | null;
    rankings: {
        id: string;
        placeName: string;
        description?: string | null;
        category?: string | null;
        estimatedBudget?: number | null;
        totalVotes: number;
        averageScore: number;
        proposedBy?: {
            name?: string;
        } | null;
    }[];
}

interface TripDetail {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    ownerId: string;
    owner?: {
        name?: string;
    };
    members?: {
        userId: string;
    }[];
}

export default function TripDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [tripId, setTripId] = useState("");
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
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [placeName, setPlaceName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [estimatedBudget, setEstimatedBudget] = useState("");
    const [message, setMessage] = useState("");
    const [summary, setSummary] = useState<TripSummary | null>(null);
    const [trip, setTrip] = useState<TripDetail | null>(null);

    useEffect(() => {
        params.then((p) => setTripId(p.id));
        if (!currentUser) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/login");
        }
    }, [params, router, currentUser]);

    const loadDestinations = async (id: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/trips/${id}/destinations`, {
            headers: {
                Authorization: `Bearer ${token ?? ""}`,
            },
            cache: "no-store",
        });
        const result = await res.json();

        if (res.ok) {
            setDestinations(result.data ?? []);
        }
    };

    const loadSummary = async (id: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/trips/${id}/summary`, {
            headers: {
                Authorization: `Bearer ${token ?? ""}`,
            },
            cache: "no-store",
        });

        const result = await res.json();

        if (res.ok) {
            setSummary(result.data);
        }
    };

    const loadTrip = async (id: string) => {
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
            const foundTrip = (result.data ?? []).find((item: TripDetail) => item.id === id);
            setTrip(foundTrip || null);
        }
    };

    useEffect(() => {
        if (tripId && currentUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadTrip(tripId);
            loadDestinations(tripId);
        }
    }, [tripId, currentUser]);

    useEffect(() => {
        if (!trip) {
            return;
        }
        if (trip.status !== "FINALIZED") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSummary(null);
            return;
        }

        (async () => {
            await loadSummary(trip.id);
        })();
    }, [trip]);

    if (!currentUser) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-6 text-slate-600 shadow-lg shadow-indigo-100/60">
                    Redirecting to login...
                </div>
            </main>
        );
    }

    const handleVote = async (destinationId: string, score: number) => {
        setMessage("");

        if (!currentUser) {
            setMessage("Please login first");
            return;
        }

        const res = await fetch("/api/votes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
            body: JSON.stringify({
                destinationId,
                score,
            }),
        });

        const result = await res.json();

        if (!res.ok) {
            setMessage(result.message || "Failed to vote");
            return;
        }

        setMessage("Vote submitted successfully");
        loadDestinations(tripId);
        if (trip?.status === "FINALIZED") {
            loadSummary(tripId);
        }
    };

    const handleFinalizeTrip = async () => {
        setMessage("");

        if (!currentUser || !trip) {
            setMessage("Trip or user not found");
            return;
        }

        const res = await fetch("/api/trips/finalize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
            body: JSON.stringify({
                tripId: trip.id,
            }),
        });

        const result = await res.json();

        if (!res.ok) {
            setMessage(result.message || "Failed to finalize trip");
            return;
        }

        setMessage("Trip finalized successfully");
        await loadTrip(trip.id);
        await loadSummary(trip.id);
    };

    const handleCreateDestination = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!currentUser) {
            setMessage("Please login first");
            return;
        }

        const res = await fetch("/api/destinations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
            body: JSON.stringify({
                tripId,
                placeName,
                description,
                category,
                estimatedBudget: estimatedBudget ? Number(estimatedBudget) : undefined,
            }),
        });

        const result = await res.json();

        if (!res.ok) {
            setMessage(result.message || "Failed to add destination");
            return;
        }

        setMessage("Destination added successfully");
        setPlaceName("");
        setDescription("");
        setCategory("");
        setEstimatedBudget("");
        loadDestinations(tripId);
    };



    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-8 text-3xl font-bold text-slate-900">Trip Detail</h1>
                <div className="mb-6">
                    <Link
                        href={`/trips/${tripId}/chat`}
                        className="inline-block rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                    >
                        Open Group Chat
                    </Link>
                </div>

                <div className="mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">Trip Information</h2>

                    {trip ? (
                        <div className="space-y-2 text-slate-800">
                            <p>
                                <span className="font-medium">Title:</span> {trip.title}
                            </p>
                            <p>
                                <span className="font-medium">Status:</span> {trip.status}
                            </p>
                            <p>
                                <span className="font-medium">Owner:</span> {trip.owner?.name || "-"}
                            </p>

                            {currentUser?.id === trip.ownerId && trip.status === "OPEN" && (
                                <button
                                    type="button"
                                    onClick={handleFinalizeTrip}
                                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
                                >
                                    Finalize Trip
                                </button>
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-500">Loading trip...</p>
                    )}
                </div>

                <div className="mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">Add Destination</h2>

                    <form onSubmit={handleCreateDestination} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Place name"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                        />

                        <textarea
                            placeholder="Description"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Category"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Estimated budget"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
                            value={estimatedBudget}
                            onChange={(e) => setEstimatedBudget(e.target.value)}
                        />

                        <button
                            type="submit"
                            disabled={trip?.status === "FINALIZED"}
                            className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {trip?.status === "FINALIZED" ? "Trip Finalized" : "Add Destination"}
                        </button>
                    </form>

                    {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
                </div>

                <div className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">Destination List</h2>

                    <div className="grid gap-4">
                        {destinations.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-500">
                                No destinations yet
                            </div>
                        ) : (
                            destinations.map((destination) => (
                                <div key={destination.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {destination.placeName}
                                    </h3>
                                    <p className="mt-1 text-slate-600">
                                        {destination.description || "No description"}
                                    </p>
                                    <div className="mt-2 text-sm text-slate-700">
                                        <p>Category: {destination.category || "-"}</p>
                                        <p>Budget: {destination.estimatedBudget ?? "-"}</p>
                                        <p>Proposed by: {destination.proposedBy?.name || "-"}</p>
                                    </div>
                                    <div className="mt-3 text-sm text-slate-700">
                                        <p>
                                            Total Votes: {destination.votes?.length ?? 0}
                                        </p>
                                        <p>
                                            Average Score:{" "}
                                            {destination.votes && destination.votes.length > 0
                                                ? (
                                                    destination.votes.reduce((sum, vote) => sum + vote.score, 0) /
                                                    destination.votes.length
                                                ).toFixed(1)
                                                : "0.0"}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        {[1, 2, 3, 4, 5].map((score) => (
                                            <button
                                                key={score}
                                                type="button"
                                                disabled={trip?.status === "FINALIZED"}
                                                onClick={() => handleVote(destination.id, score)}
                                                className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-700"
                                            >
                                                {score}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-8 mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-indigo-100/60">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">Trip Summary</h2>

                    {trip?.status !== "FINALIZED" ? (
                        <p className="text-slate-600">
                            Summary will be available after trip owner finalizes this trip.
                        </p>
                    ) : !summary ? (
                        <p className="text-slate-500">No summary available</p>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Total Destinations: {summary.totalDestinations}
                            </p>

                            {summary.topDestination ? (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                    <h3 className="text-lg font-semibold text-emerald-700">
                                        Top Recommended Destination
                                    </h3>
                                    <p className="mt-2 font-medium">
                                        {summary.topDestination.placeName}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Average Score: {summary.topDestination.averageScore}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Total Votes: {summary.topDestination.totalVotes}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-500">No votes yet</p>
                            )}

                            <div>
                                <h3 className="mb-3 text-lg font-semibold">Ranking</h3>
                                <div className="grid gap-3">
                                    {summary.rankings.map((item, index) => (
                                        <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="font-semibold">
                                                #{index + 1} {item.placeName}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                Average Score: {item.averageScore}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                Total Votes: {item.totalVotes}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}