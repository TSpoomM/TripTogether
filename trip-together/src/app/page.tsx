"use client";

import Link from "next/link";

export default function HomePage() {
  const isLoggedIn =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem("token") && localStorage.getItem("user"));

  return (
    <main className="px-6 py-14 sm:px-10">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200/80 bg-white/85 p-10 shadow-xl shadow-indigo-100/60 backdrop-blur">
        <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-700">
          Group Planning Platform
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          TripTogether
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          A collaborative workspace for proposing destinations, voting as a
          group, and finalizing travel plans with clear summaries.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/trips"
            className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            View Trips
          </Link>
          {!isLoggedIn && (
            <Link
              href="/login"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              Login
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}