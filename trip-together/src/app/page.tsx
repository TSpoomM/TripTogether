import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">PlanSphere</h1>
        <p className="text-lg mb-8">
          A collaborative trip planning and destination voting platform.
        </p>

        <div className="flex gap-4">
          <Link
            href="/trips"
            className="px-5 py-3 rounded-lg bg-black text-white"
          >
            View Trips
          </Link>
          <Link
            href="/login"
            className="px-5 py-3 rounded-lg border border-black"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}