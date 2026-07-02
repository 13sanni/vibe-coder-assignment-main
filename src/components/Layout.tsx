import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useListStore } from "@/store/useListStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const profileCount = useListStore((state) => state.profiles.length);

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Link
          to="/"
          className="text-lg font-bold tracking-tight no-underline"
          style={{ color: "var(--accent)" }}
        >
          ✦ InfluencerHub
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 text-sm no-underline px-3 py-1.5 rounded-full"
          style={{
            background: "var(--accent-bg)",
            color: "var(--accent)",
            border: "1px solid var(--accent-border)",
          }}
        >
          📋 My List
          {profileCount > 0 && (
            <span
              className="text-xs font-semibold text-white px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--accent)" }}
            >
              {profileCount}
            </span>
          )}
        </Link>
      </header>

      <main className="flex-1 px-6 py-6">
        {title && (
          <h1 className="mb-1" style={{ color: "var(--text-h)" }}>
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
