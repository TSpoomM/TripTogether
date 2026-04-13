"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        if (token && rawUser) {
            router.replace("/trips");
        }
    }, [router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setSubmitting(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage(result.message || "Register failed");
                return;
            }

            setMessage("Registered successfully. Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 800);
        } catch {
            setMessage("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-indigo-100/60">
                <h1 className="mb-1 text-2xl font-bold text-slate-900">Register</h1>
                <p className="mb-6 text-sm text-slate-700">Create your account to join trip planning.</p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-800">Name</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-300 transition focus:ring-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-800">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-300 transition focus:ring-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-800">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-300 transition focus:ring-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {submitting ? "Creating account..." : "Create account"}
                    </button>
                </form>

                {message && <p className="mt-4 text-sm font-medium text-slate-800">{message}</p>}

                <p className="mt-4 text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-indigo-700 hover:text-indigo-800">
                        Login
                    </Link>
                </p>
            </div>
        </main>
    );
}
