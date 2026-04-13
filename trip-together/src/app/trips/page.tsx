async function getTrips() {
    const res = await fetch("http://localhost:3000/api/trips", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch trips");
    }

    return res.json();
}

export default async function TripsPage() {
    const result = await getTrips();
    const trips = result.data ?? [];

    return (
        <main className="min-h-screen p-10 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Trips</h1>

                <div className="grid gap-4">
                    {trips.length === 0 ? (
                        <div className="p-6 bg-white rounded-xl border">
                            No trips found
                        </div>
                    ) : (
                        trips.map((trip: any) => (
                            <div key={trip.id} className="p-6 bg-white rounded-xl border">
                                <h2 className="text-xl font-semibold">{trip.title}</h2>
                                <p className="text-gray-600 mt-2">
                                    {trip.description || "No description"}
                                </p>
                                <p className="text-sm text-gray-500 mt-3">
                                    Status: {trip.status}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}