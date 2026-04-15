"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface StoredUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function AppNavbar() {
    const router = useRouter();
    const currentUser: StoredUser | null = (() => {
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
    })();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const navItems = currentUser
        ? [
              { href: "/", label: "Home" },
              { href: "/trips", label: "Trips" },
              { href: "/trips/create", label: "Create" },
              { href: "/trips/join", label: "Join" },
              { href: "/trips/list", label: "Trip List" },
          ]
        : [
              { href: "/", label: "Home" },
              { href: "/register", label: "Register" },
              { href: "/login", label: "Login" },
          ];

    return (
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
                TripTogether
            </Link>
            <div className="flex items-center gap-3">
                {currentUser && (
                    <p className="hidden text-sm font-medium text-slate-700 sm:block">
                        {currentUser.name}
                    </p>
                )}
                <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-800 transition hover:bg-slate-900 hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                    {currentUser && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full bg-rose-50 px-4 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </div>
    );
}
