"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  FilePlus,
  Wrench,
  Home,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Citizen Report", href: "/report", icon: FilePlus },
    { label: "Contractor Portal", href: "/contractor", icon: Wrench },
    { label: "Executive Dashboard", href: "/admin", icon: LayoutDashboard },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  CivicTruth
                </span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
                Autonomous Municipal DPI Verification
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs lg:text-sm font-semibold transition-all",
                    isActive
                      ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop System Status Beacon */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DPI Core: Online</span>
            </div>

            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>New Report</span>
            </Link>
          </div>

          {/* Mobile / Tablet Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/report"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <span>+ Report</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative h-5 w-5 flex items-center justify-center">
                <Menu
                  className={clsx(
                    "h-5 w-5 absolute transition-all duration-300 transform",
                    mobileMenuOpen
                      ? "opacity-0 rotate-90 scale-75 pointer-events-none"
                      : "opacity-100 rotate-0 scale-100"
                  )}
                />
                <X
                  className={clsx(
                    "h-5 w-5 absolute transition-all duration-300 transform",
                    mobileMenuOpen
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-75 pointer-events-none"
                  )}
                />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Over / Dropdown Drawer with Smooth Fluid Transitions */}
      <div
        className={clsx(
          "fixed inset-x-0 top-16 bottom-0 z-40 bg-slate-950/95 backdrop-blur-xl md:hidden overflow-y-auto transition-all duration-300 ease-in-out",
          mobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 -translate-y-3 pointer-events-none invisible"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className={clsx(
            "flex flex-col p-5 space-y-4 max-w-md mx-auto transition-all duration-300 ease-out",
            mobileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          
          {/* Status indicator */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Municipal DPI Network:</span>
            <span className="flex items-center gap-1.5 font-mono font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Active (Wards 84, 112, 150)
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors min-h-[48px]",
                    isActive
                      ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </Link>
              );
            })}
          </nav>

          {/* Quick Action Button */}
          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10 min-h-[48px]"
            >
              <FilePlus className="h-4 w-4" />
              <span>Submit Grievance with Voice Note</span>
            </Link>
          </div>

          {/* Footer metadata */}
          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-500 font-mono">
              CivicTruth AI • Build with AI Hackathon 2026
            </span>
          </div>

        </div>
      </div>
    </>
  );
}
