"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, FilePlus, Wrench, Home, LayoutDashboard } from "lucide-react";
import clsx from "clsx";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Report", href: "/report", icon: FilePlus },
    { label: "Contractor", href: "/contractor", icon: Wrench },
    { label: "Executive Dashboard", href: "/admin", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white sm:text-lg">CivicTruth</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-400 border border-emerald-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">Automated Municipal DPI Verification</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-800 text-emerald-400 border border-zinc-700"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
