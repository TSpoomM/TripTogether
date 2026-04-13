"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [name, setName] = useState("Owner");
    const [password, setPassword] = useState("123456");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        if (token && rawUser) {
            router.replace("/trips");
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, password }),
        });

        const result = await res.json();

        if (!res.ok) {
            setMessage(result.message || "Login failed");
            return;
        }

        setToken(result.data.token);
        setMessage(`Welcome ${result.data.user.name}`);
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        router.push("/trips");
    };

    return (
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-indigo-100/60">
                <h1 className="mb-1 text-2xl font-bold text-slate-900">Login</h1>
                <p className="mb-6 text-sm text-slate-600">Sign in to create and manage your trips.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-800">Name</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-300 transition focus:ring-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-800">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-300 transition focus:ring-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
                    >
                        Login
                    </button>
                </form>

                {message && <p className="mt-4 text-sm font-medium text-slate-800">{message}</p>}

                {token && (
                    <div className="mt-4 break-all rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-900">
                        {token}
                    </div>
                )}

                <p className="mt-4 text-sm text-slate-600">
                    No account yet?{" "}
                    <Link href="/register" className="font-medium text-indigo-700 hover:text-indigo-800">
                        Register
                    </Link>
                </p>
            </div>
        </main>
    );
}